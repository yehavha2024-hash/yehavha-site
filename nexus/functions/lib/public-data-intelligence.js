function countBy(records, field) {
  const counts = new Map();
  for (const record of records) {
    const value = String(record?.[field] || '').trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))
    .slice(0, 8)
    .map(([value, count]) => ({ value, count }));
}

function numeric(value) {
  if (value === undefined || value === null) return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function sumCandidate(records, keys) {
  let total = 0;
  let count = 0;
  for (const record of records) {
    const metadata = record?.metadata || {};
    for (const key of keys) {
      const value = numeric(metadata[key]);
      if (value === null) continue;
      total += value;
      count += 1;
      break;
    }
  }
  return count ? { total, count } : null;
}

function axisNarrative(axis, count) {
  if (axis === 'legal') {
    return {
      assessment: `${count}건의 법령·판례·입법 원천자료를 동일 스키마에서 비교할 수 있는 현재 스냅샷입니다.`,
      impact: '개정·시행·심사 상태가 바뀌는 자료를 기존 NEXUS 법률 분석과 직접 연결할 수 있습니다.',
      watch: '시행일, 심사단계, 소관기관 변화와 신규 원문을 다음 스냅샷에서 비교합니다.'
    };
  }
  if (axis === 'local-government') {
    return {
      assessment: `${count}건의 예산·사업·입찰·계약 원천자료를 지방정부 사업 단위로 연결할 수 있는 현재 스냅샷입니다.`,
      impact: '예산 편성에서 공고·계약·집행으로 이어지는 사업 흐름을 같은 기준으로 추적할 수 있습니다.',
      watch: '기관별 사업량, 계약금액, 집행 변화와 신규 공고의 증가·감소를 후속 스냅샷에서 비교합니다.'
    };
  }
  if (axis === 'education') {
    return {
      assessment: `${count}건의 학교·대학·교육여건 자료를 교육기관 단위로 정규화한 현재 스냅샷입니다.`,
      impact: 'N University·에듀테크 연구에서 기관 특성, 교육여건, 재정·성과를 공통 기준으로 비교할 수 있습니다.',
      watch: '학년도·공시시점별 학생, 교원, 재정, 교육여건 지표의 변화를 축적해 비교합니다.'
    };
  }
  if (axis === 'research') {
    return {
      assessment: `${count}건의 연구·특허·기술 자료를 동일 구조로 정리한 현재 스냅샷입니다.`,
      impact: '연구과제와 논문·특허·기술성과를 산업·전략정보와 연계할 수 있습니다.',
      watch: '신규 과제, 성과물, 출원·등록 상태와 주요 기관의 활동 변화를 후속 스냅샷에서 비교합니다.'
    };
  }
  return {
    assessment: `${count}건의 공식 원천자료를 동일 스키마로 정규화한 현재 스냅샷입니다.`,
    impact: '서로 다른 제공기관의 자료를 같은 화면 규격과 분석 기준으로 비교할 수 있습니다.',
    watch: '다음 갱신 시 신규·변경·소멸 항목을 이전 스냅샷과 비교해 방향성을 판단합니다.'
  };
}

function amountSummary(sourceId, records) {
  const candidates = sourceId.startsWith('g2b-contract-')
    ? ['totCntrctAmt', 'cntrctAmt', 'contractAmt']
    : sourceId.startsWith('g2b-bid-')
      ? ['presmptPrce', 'asignBdgtAmt']
      : sourceId === 'apt-trade'
        ? ['dealAmount', '거래금액']
        : sourceId === 'customs-trade-total'
          ? ['expDlr', 'impDlr', 'tradeBal']
          : [];
  return candidates.length ? sumCandidate(records, candidates) : null;
}

export function buildPublicDataIntelligence(sourceId, source, records, fetchedAt = new Date().toISOString()) {
  const count = records.length;
  const organizations = countBy(records, 'organization');
  const regions = countBy(records, 'region');
  const statuses = countBy(records, 'status');
  const amount = amountSummary(sourceId, records);
  const narrative = axisNarrative(source.axis, count);

  const factParts = [`${source.title} ${count}건`];
  if (organizations[0]) factParts.push(`최다 기관 ${organizations[0].value} ${organizations[0].count}건`);
  if (regions[0]) factParts.push(`주요 지역 ${regions[0].value} ${regions[0].count}건`);
  if (statuses[0]) factParts.push(`주요 상태 ${statuses[0].value} ${statuses[0].count}건`);

  return {
    generated_at: fetchedAt,
    source: sourceId,
    axis: source.axis,
    owner: source.owner || null,
    signal: count ? 'active' : 'empty',
    count,
    dimensions: { organizations, regions, statuses },
    amount,
    briefing: {
      fact: factParts.join(' · '),
      assessment: narrative.assessment,
      impact: narrative.impact,
      watch: narrative.watch
    },
    trend: {
      state: 'snapshot',
      direction: 'baseline',
      note: '단일 조회 결과만으로 증가·감소를 단정하지 않습니다. 영속 스냅샷이 연결되면 시점 간 변화량을 계산합니다.'
    }
  };
}
