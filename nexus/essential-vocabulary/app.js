(() => {
  'use strict';

  const hsRaw = [
    window.HS_VOCAB_1_200 || [], window.HS_VOCAB_201_400 || [],
    window.HS_VOCAB_401_600 || [], window.HS_VOCAB_601_800 || [],
    window.HS_VOCAB_801_1000 || []
  ].flat();

  const FALLBACK_PHRASES = [
    ['comply with','~을 준수하다'],['account for','~을 설명하다; ~을 차지하다'],['subject to','~의 적용을 받는; ~을 조건으로 하는'],
    ['in response to','~에 대응하여'],['carry out','수행하다'],['follow up on','~을 후속 조치하다'],['phase out','단계적으로 폐지하다'],
    ['be entitled to','~할 자격이 있다'],['be eligible for','~을 받을 자격이 있다'],['designate A as B','A를 B로 지정하다'],
    ['be exempt from','~에서 면제되다'],['adjacent to','~에 인접한'],['be covered by a warranty','보증의 적용을 받다'],
    ['inquire about','~에 관해 문의하다'],['waive a fee','수수료를 면제하다'],['take inventory','재고 조사를 하다'],
    ['undergo renovation','보수·개조 공사를 거치다'],['on the premises','구내에서'],['make a decision','결정하다'],
    ['reach an agreement','합의에 이르다'],['raise a concern','우려를 제기하다'],['by appointment','예약을 통해'],
    ['in advance','미리, 사전에'],['at short notice','촉박한 통보로'],['be responsible for','~을 책임지다'],
    ['be subject to change','변경될 수 있다'],['in accordance with','~에 따라, ~와 일치하여'],['as a result','그 결과'],
    ['with regard to','~에 관하여'],['in terms of','~의 관점에서'],['due to','~ 때문에'],['prior to','~에 앞서'],
    ['as opposed to','~와 대조적으로'],['in addition to','~에 더하여'],['take into account','~을 고려하다'],
    ['be likely to','~할 가능성이 있다'],['be required to','~하도록 요구되다'],['be scheduled to','~할 예정이다'],
    ['be available for','~에 이용 가능하다'],['on behalf of','~을 대신하여'],['in charge of','~을 담당하여']
  ];

  const RELATIONS = {
    adapt:{similar:['adjust'],antonym:[],related:['adaptive','adaptation']}, adaptive:{related:['adapt','adaptation']}, adaptation:{related:['adapt','adaptive']},
    disappoint:{antonym:['satisfy'],related:['disappointment']}, disappointment:{antonym:['satisfaction'],related:['disappoint']},
    frustrate:{related:['frustration']}, frustration:{related:['frustrate']}, excite:{antonym:['bore'],related:['excitedly']}, excitedly:{related:['excite']},
    anticipate:{similar:['expect'],related:['anticipation','expectation']}, anticipation:{related:['anticipate','expectation']}, expectation:{related:['anticipate','anticipation']},
    isolate:{antonym:['connect'],related:['isolation']}, isolation:{related:['isolate']}, dominate:{similar:['control'],related:['dominance']}, dominance:{related:['dominate']},
    persuade:{similar:['convince'],related:['persuasive']}, persuasive:{related:['persuade']}, differ:{antonym:['correspond'],related:['differentiate','disagreement']},
    strengthen:{antonym:['weaken'],related:['reinforce']}, weaken:{antonym:['strengthen'],related:['undermine']}, enhance:{similar:['improve','strengthen'],antonym:['diminish']},
    diminish:{antonym:['enhance','increase']}, restrict:{similar:['limit','confine'],antonym:['expand']}, maximize:{antonym:['minimize']}, minimize:{antonym:['maximize']},
    sustain:{similar:['maintain'],antonym:['abandon']}, abandon:{antonym:['retain','sustain']}, retain:{antonym:['abandon']},
    explicit:{antonym:['implicit','ambiguous']}, ambiguous:{antonym:['explicit']}, relevant:{antonym:['irrelevant']}, irrelevant:{antonym:['relevant']},
    scarce:{antonym:['abundant'],related:['abundance']}, abundance:{antonym:['scarcity'],related:['scarce']}, reluctant:{antonym:['willing'],related:['reluctantly']},
    willingly:{antonym:['reluctantly'],related:['willingness']}, reluctant:{antonym:['willing'],related:['reluctantly']},
    deliberate:{related:['deliberately','intentional']}, deliberately:{similar:['intentionally'],antonym:['accidentally'],related:['intentional']}, intentionally:{similar:['deliberately'],antonym:['accidentally'],related:['intentional']},
    accurate:{antonym:['inaccurate']}, inaccurate:{antonym:['accurate']}, familiar:{antonym:['unfamiliar']}, unfamiliar:{antonym:['familiar']},
    profitable:{antonym:['unprofitable'],related:['profitability']}, profitability:{related:['profitable']}, persist:{similar:['continue'],related:['persistent','persistently']},
    persistent:{related:['persist','persistently']}, mitigate:{similar:['alleviate','reduce'],related:['mitigation']}, mitigation:{related:['mitigate']},
    conceal:{antonym:['reveal','expose']}, expose:{antonym:['conceal']}, prohibit:{antonym:['permit','allow']}, facilitate:{similar:['enable','assist'],antonym:['hinder']}, hinder:{antonym:['facilitate']},
    encompass:{similar:['include','incorporate']}, incorporate:{similar:['include','integrate'],related:['integrate']}, integrate:{antonym:['separate'],related:['incorporate']},
    robust:{similar:['strong','durable']}, durable:{similar:['robust']}, vague:{antonym:['explicit','clear']}, obscure:{similar:['vague'],antonym:['clear']}
  };

  const wordMap = new Map();
  const phraseMap = new Map();
  const norm = value => String(value || '').trim().toLowerCase().replace(/\s+/g,' ');
  const cleanTerm = value => String(value || '').trim().replace(/\s+/g,' ');

  function mergeWord(term, meaning, source, extra = {}) {
    term = cleanTerm(term); meaning = String(meaning || '').trim();
    if (!term || !meaning || term.length > 60 || /[.!?]/.test(term)) return;
    const key = norm(term);
    const existing = wordMap.get(key) || {term, meanings:[], sources:new Set(), rank:null, frequency:null};
    if (!existing.meanings.includes(meaning)) existing.meanings.push(meaning);
    existing.sources.add(source);
    if (extra.rank && (!existing.rank || extra.rank < existing.rank)) existing.rank = extra.rank;
    if (extra.frequency && (!existing.frequency || extra.frequency > existing.frequency)) existing.frequency = extra.frequency;
    wordMap.set(key, existing);
  }

  function mergePhrase(term, meaning, source='TOEIC') {
    term = cleanTerm(term); meaning = String(meaning || '').trim();
    if (!term || !meaning || !/\s/.test(term) || term.length > 90) return;
    const key = norm(term);
    const existing = phraseMap.get(key) || {term, meanings:[], sources:new Set()};
    if (!existing.meanings.includes(meaning)) existing.meanings.push(meaning);
    existing.sources.add(source);
    phraseMap.set(key, existing);
  }

  hsRaw.forEach(([rank,term,frequency,meaning]) => mergeWord(term, meaning, '수능', {rank,frequency}));

  try {
    if (typeof TOEIC_CONTENT !== 'undefined') {
      (TOEIC_CONTENT.vocab || []).forEach(item => mergeWord(item.title || item.term, item.meaning || item.meaningKo, 'TOEIC'));
      ['expression','expressions','phrase','phrases'].forEach(key => (TOEIC_CONTENT[key] || []).forEach(item => mergePhrase(item.title || item.term, item.meaning || item.meaningKo, 'TOEIC')));
    }
  } catch (error) { console.warn('TOEIC core vocabulary load skipped:', error); }

  function scanToeic(node, seen = new WeakSet()) {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (!Array.isArray(node)) {
      const meaning = node.meaningKo || node.meaning;
      const term = node.term || node.lemma || node.title;
      if (typeof term === 'string' && typeof meaning === 'string') {
        if (/\s/.test(cleanTerm(term))) mergePhrase(term, meaning, 'TOEIC');
        else mergeWord(term, meaning, 'TOEIC');
      }
    }
    Object.values(node).forEach(value => scanToeic(value, seen));
  }
  scanToeic(window.TOEIC_HUMAN_V2);
  FALLBACK_PHRASES.forEach(([term,meaning]) => mergePhrase(term, meaning, 'TOEIC'));

  let words = [...wordMap.values()].map(item => ({...item,sources:[...item.sources]}));
  words.sort((a,b) => (a.rank || 999999) - (b.rank || 999999) || a.term.localeCompare(b.term));
  let phrases = [...phraseMap.values()].map(item => ({...item,sources:[...item.sources]})).sort((a,b)=>a.term.localeCompare(b.term));

  const els = {
    totalWords:document.getElementById('totalWords'), highSchoolCount:document.getElementById('highSchoolCount'), toeicCount:document.getElementById('toeicCount'), phraseCount:document.getElementById('phraseCount'),
    modeTabs:[...document.querySelectorAll('.mode-tab')], sourceFilters:document.getElementById('sourceFilters'), filters:[...document.querySelectorAll('.filter')], search:document.getElementById('searchInput'),
    sourceBadges:document.getElementById('sourceBadges'), position:document.getElementById('positionLabel'), term:document.getElementById('term'), meaning:document.getElementById('meaning'), meta:document.getElementById('meta'), relations:document.getElementById('relations'),
    prev:document.getElementById('prevBtn'), next:document.getElementById('nextBtn'), random:document.getElementById('randomBtn'), known:document.getElementById('knownBtn'), review:document.getElementById('reviewBtn'), progress:document.getElementById('progressNote')
  };

  els.totalWords.textContent = words.length.toLocaleString('ko-KR');
  els.highSchoolCount.textContent = words.filter(item=>item.sources.includes('수능')).length.toLocaleString('ko-KR');
  els.toeicCount.textContent = words.filter(item=>item.sources.includes('TOEIC')).length.toLocaleString('ko-KR');
  els.phraseCount.textContent = phrases.length.toLocaleString('ko-KR');

  let mode = 'word', source = 'all', index = 0;
  const statusKey = 'essential_vocab_memory_v1';
  let status = {};
  try { status = JSON.parse(localStorage.getItem(statusKey) || '{}'); } catch {}
  const save = () => localStorage.setItem(statusKey, JSON.stringify(status));
  const itemKey = item => `${mode}:${norm(item.term)}`;

  function relationHtml(item) {
    if (mode !== 'word') return '';
    const rel = RELATIONS[norm(item.term)] || {};
    const family = (rel.related || []).filter(Boolean);
    const sections = [
      ['유사어',rel.similar || []], ['반대어',rel.antonym || []], ['관련 어휘',family]
    ].filter(([,list])=>list.length);
    if (!sections.length) return '';
    return sections.map(([label,list])=>`<div class="relation-row"><span>${label}</span><div>${list.map(v=>`<b>${escapeHtml(v)}</b>`).join('')}</div></div>`).join('');
  }

  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function currentList() {
    const query = norm(els.search.value);
    let list = mode === 'word' ? words : phrases;
    if (mode === 'word' && source !== 'all') list = list.filter(item=>item.sources.includes(source));
    if (query) list = list.filter(item=>norm(item.term).includes(query) || item.meanings.some(m=>norm(m).includes(query)));
    return list;
  }

  function render() {
    const list = currentList();
    if (!list.length) {
      els.sourceBadges.innerHTML=''; els.position.textContent='0 / 0'; els.term.textContent='검색 결과 없음'; els.meaning.textContent='다른 검색어나 출처를 선택하세요.'; els.meta.textContent=''; els.relations.innerHTML=''; els.progress.textContent=''; return;
    }
    index = Math.max(0, Math.min(index, list.length - 1));
    const item = list[index];
    els.sourceBadges.innerHTML = item.sources.map(s=>`<span>${escapeHtml(s)}</span>`).join('');
    els.position.textContent = `${(index+1).toLocaleString('ko-KR')} / ${list.length.toLocaleString('ko-KR')}`;
    els.term.textContent = item.term;
    els.meaning.textContent = item.meanings.join(' · ');
    els.meta.textContent = mode === 'word' && item.rank ? `수능 빈도순 ${item.rank}위 · 출현 ${item.frequency}회` : mode === 'phrase' ? '숙어 · 연어 · 고정결합' : 'TOEIC 학습 어휘';
    els.relations.innerHTML = relationHtml(item);
    const state = status[itemKey(item)] || '';
    els.known.classList.toggle('selected', state === 'known');
    els.review.classList.toggle('selected', state === 'review');
    const knownCount = list.filter(x=>status[`${mode}:${norm(x.term)}`]==='known').length;
    const reviewCount = list.filter(x=>status[`${mode}:${norm(x.term)}`]==='review').length;
    els.progress.textContent = `현재 목록 ${list.length.toLocaleString('ko-KR')}개 · 외움 ${knownCount.toLocaleString('ko-KR')} · 다시 보기 ${reviewCount.toLocaleString('ko-KR')}`;
  }

  els.modeTabs.forEach(btn=>btn.addEventListener('click',()=>{
    mode=btn.dataset.mode; index=0; els.modeTabs.forEach(x=>x.classList.toggle('active',x===btn));
    els.sourceFilters.hidden = mode === 'phrase'; if (mode === 'phrase') source='all'; render();
  }));
  els.filters.forEach(btn=>btn.addEventListener('click',()=>{source=btn.dataset.source;index=0;els.filters.forEach(x=>x.classList.toggle('active',x===btn));render();}));
  els.search.addEventListener('input',()=>{index=0;render();});
  els.prev.addEventListener('click',()=>{const l=currentList(); if(l.length){index=(index-1+l.length)%l.length;render();}});
  els.next.addEventListener('click',()=>{const l=currentList(); if(l.length){index=(index+1)%l.length;render();}});
  els.random.addEventListener('click',()=>{const l=currentList(); if(l.length){index=Math.floor(Math.random()*l.length);render();}});
  els.known.addEventListener('click',()=>{const l=currentList();if(!l.length)return;status[itemKey(l[index])]=status[itemKey(l[index])]==='known'?'':'known';save();render();});
  els.review.addEventListener('click',()=>{const l=currentList();if(!l.length)return;status[itemKey(l[index])]=status[itemKey(l[index])]==='review'?'':'review';save();render();});

  render();
})();
