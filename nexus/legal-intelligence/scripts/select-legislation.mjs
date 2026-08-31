import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const config = JSON.parse(await fs.readFile(path.join(root, 'collector-config.json'), 'utf8'));
const current = JSON.parse(await fs.readFile(path.join(root, 'legislation.json'), 'utf8'));
const inputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.resolve(process.cwd(), '.tmp-legislation-collected.json');
const outputPath = process.argv[3] ? path.resolve(process.cwd(), process.argv[3]) : path.resolve(process.cwd(), '.tmp-legislation-selected.json');
const collected = JSON.parse(await fs.readFile(inputPath, 'utf8'));

const existingByKey = new Map((current.records || []).map(record => [record.recordKey, record]));
const clean = value => value == null ? '' : String(value).trim();

function normalizeDate(value) {
  const text = clean(value);
  if (!text) return '';
  const match = text.match(/(20\d{2})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return text.slice(0, 10);
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

function first(raw, keys) {
  for (const key of keys) {
    const value = clean(raw?.[key]);
    if (value) return value;
  }
  return '';
}

function topicsFor(text) {
  const source = clean(text).toLocaleLowerCase('ko-KR');
  const topics = [];
  for (const rule of config.topicRules || []) {
    if ((rule.keywords || []).some(keyword => source.includes(String(keyword).toLocaleLowerCase('ko-KR')))) topics.push(rule.topic);
  }
  return [...new Set(topics)];
}

function assemblyStatus(raw, previous) {
  const result = first(raw, ['PROC_RESULT_CD', 'PROC_RESULT', 'LAW_PROC_RESULT_CD']);
  const lawDate = normalizeDate(first(raw, ['LAW_PROC_DT', 'PROMULGATION_DT']));
  const plenaryDate = normalizeDate(first(raw, ['PROC_DT', 'LAW_PRESENT_DT', 'RGS_PRESENT_DT']));
  const committeeProcDate = normalizeDate(first(raw, ['CMT_PROC_DT', 'COMMITTEE_PROC_DT', 'COMMITTEE_PROC_DATE']));
  const committeePresentDate = normalizeDate(first(raw, ['CMT_PRESENT_DT', 'COMMITTEE_PRESENT_DT', 'COMMITTEE_PRESENT_DATE']));
  const referralDate = normalizeDate(first(raw, ['COMMITTEE_DT', 'JRCMIT_RFRL_DT', 'COMMITTEE_REFERRAL_DT']));
  const proposedAt = normalizeDate(first(raw, ['PROPOSE_DT', 'PPSL_DT']));

  if (lawDate) return {code: 'promulgated', label: result ? `공포·${result}` : '공포', date: lawDate};
  if (plenaryDate && result) return {code: 'plenary_result', label: result, date: plenaryDate};
  if (plenaryDate) return {code: 'plenary', label: '본회의 단계', date: plenaryDate};
  if (committeeProcDate) return {code: 'committee_decision', label: '위원회 의결', date: committeeProcDate};
  if (committeePresentDate) return {code: 'committee_review', label: '위원회 상정·심사', date: committeePresentDate};
  if (referralDate) return {code: 'committee_referral', label: '위원회 회부', date: referralDate};
  if (result) return {code: 'processed', label: result, date: previous?.statusDate || proposedAt};
  if (previous?.statusCode && previous?.statusLabel) return {code: previous.statusCode, label: previous.statusLabel, date: previous.statusDate || proposedAt};
  return {code: 'introduced', label: '발의·계류', date: proposedAt};
}

function assemblyHistory(raw, status, proposedAt) {
  const rows = [];
  if (proposedAt) rows.push({date: proposedAt, stage: '발의'});
  const candidates = [
    [['COMMITTEE_DT', 'JRCMIT_RFRL_DT', 'COMMITTEE_REFERRAL_DT'], '위원회 회부'],
    [['CMT_PRESENT_DT', 'COMMITTEE_PRESENT_DT', 'COMMITTEE_PRESENT_DATE'], '위원회 상정·심사'],
    [['CMT_PROC_DT', 'COMMITTEE_PROC_DT', 'COMMITTEE_PROC_DATE'], '위원회 의결'],
    [['LAW_PRESENT_DT', 'RGS_PRESENT_DT'], '본회의 상정'],
    [['PROC_DT'], '본회의 처리'],
    [['LAW_PROC_DT', 'PROMULGATION_DT'], '공포']
  ];
  for (const [keys, stage] of candidates) {
    const date = normalizeDate(first(raw, keys));
    if (date) rows.push({date, stage});
  }
  if (status.date && !rows.some(row => row.date === status.date && row.stage === status.label)) rows.push({date: status.date, stage: status.label});
  return rows;
}

function mapAssembly(item) {
  const raw = item.raw || {};
  const key = `assembly:${item.sourceId}`;
  const previous = existingByKey.get(key);
  const title = first(raw, ['BILL_NAME', 'BILL_NM']);
  const proposer = first(raw, ['PROPOSER', 'RST_PROPOSER', 'PPSR_NM']);
  const proposedAt = normalizeDate(first(raw, ['PROPOSE_DT', 'PPSL_DT']));
  const committee = first(raw, ['COMMITTEE', 'COMMITTEE_NM', 'JRCMIT_NM']);
  const sourceUrl = first(raw, ['DETAIL_LINK', 'LINK_URL']) || `https://likms.assembly.go.kr/bill/billDetail.do?billId=${encodeURIComponent(first(raw, ['BILL_ID']))}`;
  const status = assemblyStatus(raw, previous);
  const topics = topicsFor([title, committee, proposer].join(' '));
  if (!previous && !topics.length) return null;

  return {
    sourceType: 'assembly',
    sourceId: item.sourceId,
    title,
    proposer,
    proposedAt,
    committee,
    statusCode: status.code,
    statusLabel: status.label,
    statusDate: status.date || proposedAt,
    active: !/(폐기|철회|부결|가결|공포)/.test(status.label),
    topics: topics.length ? topics : previous?.topics || [],
    ...(previous ? {} : {summary: `공식 국회 API에서 자동 선별된 법률안입니다. 현재 단계는 ${status.label}이며 세부 제·개정 이유와 영향은 공식 원문을 기준으로 보강합니다.`}),
    sourceUrl,
    history: assemblyHistory(raw, status, proposedAt)
  };
}

function governmentStatusLabel(raw) {
  return first(raw, ['lbPrcStsNm', 'lbPrcStsCdGrpNm']) || '정부입법 진행';
}

function mapGovernment(item) {
  const raw = item.raw || {};
  const key = `government:${item.sourceId}`;
  const previous = existingByKey.get(key);
  const title = first(raw, ['lsNmKo']);
  const ministry = first(raw, ['cptOfiOrgNm', 'asndOfiCdNm']);
  const lawType = first(raw, ['lsKndNm', 'lsKndCdNm']);
  const statusLabel = governmentStatusLabel(raw);
  const statusDate = normalizeDate(first(raw, ['lbPrcStsDt'])) || previous?.statusDate || '';
  const topics = topicsFor([title, ministry, first(raw, ['rrRsn', 'essCts'])].join(' '));
  if (!previous && !topics.length) return null;
  const statusCode = /(폐기|철회)/.test(statusLabel) ? 'withdrawn' : /(공포)/.test(statusLabel) ? 'promulgated' : /(국회)/.test(statusLabel) ? 'submitted_to_assembly' : /(심사)/.test(statusLabel) ? 'review' : /(심의|의결)/.test(statusLabel) ? 'deliberation' : 'government_process';
  const details = first(raw, ['rrRsn', 'essCts']);
  const officialLbicId = first(raw, ['officialLbicId', 'lbicId']);

  return {
    sourceType: 'government',
    sourceId: item.sourceId,
    ...(officialLbicId ? {officialLbicId} : {}),
    title,
    ministry,
    lawType,
    statusCode,
    statusLabel,
    statusDate,
    active: !/(폐기|철회|공포)/.test(statusLabel),
    topics: topics.length ? topics : previous?.topics || [],
    ...(previous ? {} : {summary: details || `법제처 정부입법 API에서 자동 선별된 법령안입니다. 현재 추진단계는 ${statusLabel}이며 세부 내용은 공식 원문을 기준으로 보강합니다.`}),
    sourceUrl: previous?.sourceUrl || 'https://opinion.lawmaking.go.kr/gcom/govLm/2000000/lmSts/govLm',
    history: statusDate ? [{date: statusDate, stage: statusLabel}] : []
  };
}

const selected = [];
for (const item of collected.records || []) {
  const mapped = item.sourceType === 'assembly' ? mapAssembly(item) : item.sourceType === 'government' ? mapGovernment(item) : null;
  if (!mapped?.sourceId || !mapped?.title) continue;
  selected.push(mapped);
}

const deduped = new Map(selected.map(record => [`${record.sourceType}:${record.sourceId}`, record]));
const output = {
  updatedAt: new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()),
  records: [...deduped.values()]
};

if (!output.records.length) throw new Error('Selection produced zero legislation records; refusing to update canonical data.');
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Selected ${output.records.length} record(s) -> ${outputPath}`);
