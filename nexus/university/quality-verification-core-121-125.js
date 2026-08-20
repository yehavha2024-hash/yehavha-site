(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER,tb=window.NEXUS_CORE_TEXTBOOK||{};if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'연대·사료성격·원전 위치·저자 귀속·번역·후대개념 소급 여부의 1차 정합성 검수. 고고학적 연대·사본계통·번역판별 쟁점의 최종 전문검증까지 완료했다는 뜻은 아니다.',sources:Array.isArray(sources)?sources:[sources],note});
const courseNotes={
 'CORE-121':'고대·중세 문명 서술에서 후기 자료의 소급 적용, 현대 법·종교 개념의 투사, 단일인과와 통일적 제도모형을 제거하고 1차사료의 성격을 구분했다.',
 'CORE-122':'근현대 연대와 문서의 성격을 재검토하고 르네상스·과학혁명·민족주의·제국주의·세계대전·디지털화의 단선적 인과를 경쟁 해석 구조로 교정했다.',
 'CORE-123':'사상가별 원전 위치와 후대 분류용어를 구분하고, 철학사 서술에서 후기 범주를 사상가 자신의 용어처럼 소급하지 않도록 교정했다.',
 'CORE-124':'문학이론의 후대 비평개념과 작품 자체의 어휘를 구분하고 Poetics·Bakhtin·postcolonial theory·digital literature의 이론가 귀속을 정리했다.',
 'CORE-125':'언어철학·화용론·해석학의 원전 위치, 편집·저작 상태, 핵심용어의 번역과 이론범위를 검토하고 법해석·LLM 적용에서 과잉일반화를 제거했다.'
};
for(const id of ['CORE-121','CORE-122','CORE-123','CORE-124','CORE-125']){const c=tb[id];if(!c)continue;c.lessons.forEach((l,i)=>{const key=`${id}-L${String(i+1).padStart(2,'0')}`;q.verified[key]=V(l[5]||[],`${courseNotes[id]} 현재 Lesson(${l[0]})의 핵심 역사·개념 주장과 지정 원자료/대표문헌을 1차 대조했다.`);});}
Object.assign(q.revised,{
 'CORE-121-L01':{date:'2026-08-20',reason:'Hammurabi 자료를 현대적 포괄 법전처럼 읽을 위험',change:'왕실 법률비문·법률집 성격과 실무문서 대조 필요성을 명시.'},
 'CORE-121-L02':{date:'2026-08-20',reason:'Book of the Dead를 Old Kingdom 국가형성 근거로 소급',change:'Pyramid Texts와 Old Kingdom 연구로 교체.'},
 'CORE-121-L04':{date:'2026-08-20',reason:'Qin Legalism→Han Confucian bureaucracy의 단순 교체서사',change:'행정제도 지속성과 유교적 정당화의 점진적 확대를 분리.'},
 'CORE-121-L05':{date:'2026-08-20',reason:'고대근동 조약과 성서언약의 직접의존을 암시할 위험',change:'형식비교와 역사적 의존명제를 구분.'},
 'CORE-121-L06':{date:'2026-08-20',reason:'hoplite warfare와 민주정의 단순 인과',change:'논쟁적 가설임을 명시하고 시민권 배제범위를 1차자료와 연결.'},
 'CORE-121-L07':{date:'2026-08-20',reason:'Hellenism을 일방적 문화융합으로 표현',change:'지역전통·권력·적응·공존의 불균등성 명시.'},
 'CORE-121-L08':{date:'2026-08-20',reason:'Roman citizenship을 시대불변 제도로 취급할 위험',change:'공화정→제정의 변화와 AD 212 Constitutio Antoniniana를 반영.'},
 'CORE-121-L09':{date:'2026-08-20',reason:'Constantine 이후 공인을 국교화와 혼동',change:'313년 관용/재산회복과 380년 Cunctos populos를 분리.'},
 'CORE-121-L10':{date:'2026-08-20',reason:'성숙한 sharia/fiqh를 7세기에 소급',change:'Qur’anic/early community norms와 8–9세기 이후 법학체계 형성을 구분.'},
 'CORE-121-L11':{date:'2026-08-20',reason:'feudalism을 보편 단일 피라미드로 설명할 위험',change:'Bloch와 Reynolds의 상이한 분석을 통해 범주의 논쟁성 명시.'},
 'CORE-122-L01':{date:'2026-08-20',reason:'printing press를 초기 Renaissance의 발생원인처럼 서술',change:'르네상스 선행과 15세기 중엽 이후 인쇄 확산을 시간적으로 분리.'},
 'CORE-122-L03':{date:'2026-08-20',reason:'Scientific Revolution을 하나의 timeless scientific method로 단순화',change:'수학·관찰·실험·도구·전통의 이질적 실천과 경계논쟁 명시.'},
 'CORE-122-L05':{date:'2026-08-20',reason:'Haitian Revolution을 1789 French Declaration의 단순 적용처럼 보일 위험',change:'1804 독립선언·1805 헌법을 별도 원자료로 추가.'},
 'CORE-122-L07':{date:'2026-08-20',reason:'Anderson 이론을 국민국가 형성의 보편원인으로 과잉일반화',change:'print-capitalism을 경쟁 이론 중 하나로 위치시킴.'},
 'CORE-122-L08':{date:'2026-08-20',reason:'Hobson·Said를 동일한 제국주의 원인론처럼 배열',change:'경제·표상·비교식민주의의 서로 다른 분석수준으로 분리.'},
 'CORE-122-L09':{date:'2026-08-20',reason:'Sarajevo 사건과 제1차 세계대전 원인을 혼동',change:'촉발요인·근접원인·구조원인과 책임귀속 논쟁을 분리.'},
 'CORE-122-L10':{date:'2026-08-20',reason:'경제위기가 파시즘·Holocaust를 직접 설명하는 단선인과',change:'이념·제도·폭력·반유대주의·전쟁을 독립 분석축으로 추가.'},
 'CORE-122-L12':{date:'2026-08-20',reason:'19세기 세계사 저작을 1970년대 이후 digital globalization의 직접 근거로 사용',change:'Castells·Baldwin으로 현대 네트워크·글로벌 가치사슬 문헌 교체.'},
 'CORE-123-L05':{date:'2026-08-20',reason:'Renaissance/Reformation을 modern individual 탄생으로 목적론화',change:'ad fontes·conscience·authority의 역사적 논쟁으로 제한.'},
 'CORE-123-L06':{date:'2026-08-20',reason:'rationalism/empiricism을 사상가들의 자기분류처럼 표현',change:'후대 철학사 분류임을 명시.'},
 'CORE-123-L08':{date:'2026-08-20',reason:'Kant와 consequentialism의 시대적 범주 혼동',change:'결과주의는 현대 비교범주라는 점을 명시.'},
 'CORE-123-L09':{date:'2026-08-20',reason:'Marx의 alienated labour를 Capital에 포괄 귀속',change:'1844 Economic and Philosophic Manuscripts를 핵심 원전으로 추가.'},
 'CORE-123-L10':{date:'2026-08-20',reason:'Darwin·Nietzsche·Freud를 하나의 인간관 전환이론으로 합침',change:'각자의 생물학·계보학·정신분석 논증을 분리.'},
 'CORE-123-L12':{date:'2026-08-20',reason:'critical theory·feminism·postcolonialism·technology critique를 단일 이론처럼 합침',change:'Foucault·Beauvoir·Said·Heidegger의 방법과 대상 분리.'},
 'CORE-124-L01':{date:'2026-08-20',reason:'collective memory를 고대 서사시의 자기개념처럼 소급',change:'현대 분석개념임을 명시하고 작품의 전승사와 구분.'},
 'CORE-124-L02':{date:'2026-08-20',reason:'hamartia·catharsis를 고정 번역으로 제시',change:'Poetics의 Bekker 위치와 번역·해석 논쟁을 명시.'},
 'CORE-124-L03':{date:'2026-08-20',reason:'Bakhtin carnivalesque를 Swift의 개념처럼 보일 위험',change:'후대 비평이론과 작품의 역사적 어휘를 분리.'},
 'CORE-124-L05':{date:'2026-08-20',reason:'modern novel과 individualism의 단선적 발생서사',change:'historiographical thesis임을 명시.'},
 'CORE-124-L09':{date:'2026-08-20',reason:'polyphony와 heteroglossia 혼용',change:'Dostoevsky polyphony와 사회적 언어 heteroglossia를 분리.'},
 'CORE-124-L10':{date:'2026-08-20',reason:'hybridity·subaltern을 Achebe/Said에 포괄 귀속',change:'Bhabha·Spivak의 개념적 귀속을 추가.'},
 'CORE-124-L12':{date:'2026-08-20',reason:'Hayles 2008을 modern generative-AI authorship의 직접 실증근거로 사용',change:'electronic literature의 역사적 배경과 LLM 논쟁을 분리.'},
 'CORE-125-L01':{date:'2026-08-20',reason:'Course in General Linguistics를 Saussure의 완성 저서로 단순 귀속',change:'Bally·Sechehaye의 1916 사후 편집본임을 명시.'},
 'CORE-125-L03':{date:'2026-08-20',reason:'early/late Wittgenstein을 연속 단일이론으로 읽을 위험',change:'Tractatus 2.1·4.01과 PI §§23,43,66–71을 분리.'},
 'CORE-125-L04':{date:'2026-08-20',reason:'법적 발화효과를 문장발화만으로 발생하는 것처럼 설명',change:'Austin의 felicity conditions와 법적 권한·절차 조건 추가.'},
 'CORE-125-L05':{date:'2026-08-20',reason:'some→not all을 논리적 함의처럼 읽을 위험',change:'취소 가능한 conversational implicature임을 명시.'},
 'CORE-125-L07':{date:'2026-08-20',reason:'Schleiermacher/Dilthey를 단순 authorial-intention 복원론으로 축약',change:'문법적·개별적 해석과 역사적 이해를 구분.'},
 'CORE-125-L08':{date:'2026-08-20',reason:'Gadamer의 prejudice를 단순 편견으로 오해할 가능성',change:'Vorurteil·effective history·fusion of horizons의 철학적 의미를 명시.'},
 'CORE-125-L10':{date:'2026-08-20',reason:'translation을 일대일 대응 문제로 축약',change:'Jakobson의 세 번역유형과 equivalence in difference 반영.'},
 'CORE-125-L11':{date:'2026-08-20',reason:'Hart/Dworkin을 textualism/purposivism과 단순 일대일 대응',change:'Hart open texture, Scalia/Garner textualism, Barak purposive theory를 별도 문헌으로 분리.'},
 'CORE-125-L12':{date:'2026-08-20',reason:'Bender & Koller 2020을 모든 후속 LLM에 대한 최종 empirical verdict로 확장할 위험',change:'form-only systems에 대한 position argument로 범위를 한정하고 grounding 논쟁을 별도 제시.'}
});
q.version='1.5';q.updated='2026-08-20';
const batch=(q.batches||[]).find(b=>b.id==='QA-01');if(batch)batch.status='ACTIVE · 180/420 SOURCE PASS';
Object.assign(q.notes,{
 'CORE-121':{status:'FIRST_PASS_ANCIENT_MEDIEVAL_SOURCE_COMPLETE',next:'연대·고고학·사본전승·고대법률 번역의 전문 2차 검증'},
 'CORE-122':{status:'FIRST_PASS_MODERN_CHRONOLOGY_COMPLETE',next:'혁명·산업화·제국주의·전쟁의 통계·지역별 사례와 경쟁사학 2차 검증'},
 'CORE-123':{status:'FIRST_PASS_INTELLECTUAL_HISTORY_COMPLETE',next:'Stephanus·Bekker·Akademie·A/B 등 원전 위치와 번역어의 판본별 재확인'},
 'CORE-124':{status:'FIRST_PASS_LITERARY_ATTRIBUTION_COMPLETE',next:'작품 인용위치·번역본·비평개념의 텍스트 적용과 작품별 반례 2차 검토'},
 'CORE-125':{status:'FIRST_PASS_LANGUAGE_HERMENEUTICS_COMPLETE',next:'원어용어 Sinn/Bedeutung·Vorurteil·illocution·implicature 및 법해석 사례의 세부검증'}
});
})();