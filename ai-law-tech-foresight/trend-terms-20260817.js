(() => {
  'use strict';

  const records = window.AI_FORESIGHT_RECORDS || [];
  const meta = window.AI_FORESIGHT_META || (window.AI_FORESIGHT_META = {});
  const gaps = window.AI_FORESIGHT_GAPS || [];
  const policies = window.AI_FORESIGHT_POLICIES || [];

  const addUnique = (list, values) => {
    const out = Array.isArray(list) ? list : [];
    values.forEach(value => { if (!out.includes(value)) out.push(value); });
    return out;
  };

  const patch = (id, updater) => {
    const item = records.find(record => record.id === id);
    if (item) updater(item);
  };

  meta.latestTermPrinciple = '영문 전문용어는 단순 음역이 아니라 실제 작동방식·기능·위험을 설명하는 한국어 뜻을 괄호 안에 병기한다.';
  meta.latestTerms = [
    'Frontier Model (현재 최고 수준의 성능과 능력을 겨루는 최첨단 인공지능 모델)',
    'Evaluation Harness (모델을 동일 조건에서 실행·측정하기 위한 평가 코드·도구·설정의 묶음)',
    'Reasoning (문제를 여러 단계로 나누어 판단·추론하는 처리)',
    'Compaction (긴 대화·작업 맥락을 압축해 핵심 상태만 남겨 계속 사용하는 처리)',
    'Prompt Injection (외부 입력에 숨은 악성 지시가 원래 지시를 덮어쓰거나 우회하게 하는 공격)',
    'Red Teaming (공격자 관점에서 취약점과 실패경로를 의도적으로 찾아내는 안전성 검증)',
    'Self-Play (AI가 서로 다른 역할을 맡아 반복 대결·상호작용하며 전략을 학습하는 방식)',
    'Interoperability (서로 다른 에이전트·도구·서비스가 공통 규격으로 연결되어 함께 작동하는 능력)',
    'Identity (에이전트의 주체·출처·권한을 식별하고 인증하는 체계)',
    'VLA · Vision-Language-Action Model (영상과 언어를 함께 이해해 로봇의 실제 행동 명령으로 연결하는 모델)',
    'Embodied Reasoning (몸·센서·공간·물리환경의 상태를 반영해 행동을 판단하는 추론)',
    'On-device AI (클라우드가 아니라 기기 내부에서 직접 인공지능을 실행하는 방식)',
    'Full-Stack Safety (하드웨어·운영체제·모델·제어·검증을 하나의 안전체계로 묶는 접근)',
    'Unified Memory (CPU·GPU 등이 하나의 메모리 공간을 공유해 대형 모델 실행 효율을 높이는 구조)',
    'VRAM · Video Random Access Memory (GPU가 모델 가중치·연산 데이터를 저장하는 전용 메모리)',
    'KV Cache · Key-Value Cache (생성 과정에서 이전 토큰의 계산결과를 저장해 다음 추론을 빠르게 하는 메모리)',
    'Local Inference (클라우드 서버가 아닌 개인 기기·로컬 장비에서 모델 추론을 수행하는 방식)',
    'UAS · Unmanned Aircraft System (드론 기체뿐 아니라 조종·통신·지상통제까지 포함한 무인항공시스템)',
    'BVLOS · Beyond Visual Line of Sight (조종자가 육안으로 기체를 직접 볼 수 없는 범위에서 수행하는 비가시권 비행)'
  ];

  patch('llm', item => {
    item.tech = addUnique(item.tech, [
      'Frontier Model (현재 최고 수준의 성능과 능력을 겨루는 최첨단 인공지능 모델)',
      'Routing (요청의 내용·비용·위험에 따라 다른 모델이나 도구로 자동 배분하는 처리)',
      'Deployment (개발된 모델을 실제 서비스·업무환경에 배치하고 운영하는 단계)',
      'Compaction (긴 대화·작업 맥락을 압축해 핵심 상태만 남겨 계속 사용하는 처리)'
    ]);
    item.issues = addUnique(item.issues, ['모델 자체 능력과 실행환경·라우팅·메모리 설정이 결합해 실제 성능과 위험이 달라지는 문제']);
    item.gaps = addUnique(item.gaps, ['동일 모델이라도 실행환경과 평가설정에 따라 결과가 달라질 때 법적 성능기준을 무엇으로 특정할지의 공백']);
    if (item.academic?.technical) item.academic.technical.push('최근 프런티어 모델의 성능은 모델 가중치만으로 결정되지 않는다. Routing (요청을 조건에 따라 다른 모델·도구로 배분하는 처리), Compaction (긴 맥락을 압축해 핵심 상태를 유지하는 처리), 메모리 유지, 도구 연결과 같은 실행환경이 실제 서비스 능력을 좌우한다. 따라서 법적 안전성 평가에서도 모델명과 버전뿐 아니라 당시의 실행구성 전체를 특정해야 한다.');
  });

  patch('ai-agent', item => {
    item.tech = addUnique(item.tech, [
      'Prompt Injection (외부 입력에 숨은 악성 지시가 원래 지시를 덮어쓰거나 우회하게 하는 공격)',
      'Interoperability (서로 다른 에이전트·도구·서비스가 공통 규격으로 연결되어 함께 작동하는 능력)',
      'Identity (에이전트의 주체·출처·권한을 식별하고 인증하는 체계)'
    ]);
    item.issues = addUnique(item.issues, ['외부 웹페이지·이메일·파일·도구출력에 포함된 악성 지시가 에이전트 권한을 오용하게 하는 프롬프트 인젝션 위험','에이전트 간 상호운용 시 상대 에이전트의 신원·권한·메시지 출처를 검증해야 하는 문제']);
    item.governance = addUnique(item.governance, ['외부 입력과 명령 채널 분리','에이전트 신원·권한 인증','도구별 최소권한과 중요행위 재승인']);
    if (item.academic?.technical) item.academic.technical.push('Prompt Injection (외부 입력에 숨은 악성 지시가 원래 지시를 덮어쓰거나 우회하게 하는 공격)은 에이전트가 웹페이지·이메일·문서·도구출력을 읽는 순간 외부 데이터가 사실상 명령으로 변하는 문제다. 에이전트가 결제·파일수정·전송 권한까지 가진 경우 단순한 잘못된 답변이 아니라 재산처분·정보유출·권한오용으로 이어질 수 있다.');
  });

  patch('agentic-ai', item => {
    item.tech = addUnique(item.tech, [
      'Long-horizon Task (여러 단계와 장시간에 걸쳐 목표와 상태를 유지하며 수행하는 과업)',
      'Red Teaming (공격자 관점에서 취약점과 실패경로를 의도적으로 찾아내는 안전성 검증)',
      'Self-Play (AI가 서로 다른 역할을 맡아 반복 대결·상호작용하며 전략을 학습하는 방식)'
    ]);
    item.policy = addUnique(item.policy, ['장기과업별 누적 권한·비용 한도','공격 시뮬레이션을 이용한 에이전트 안전평가']);
    item.governance = addUnique(item.governance, ['프롬프트 인젝션 방어','레드팀 결과에 따른 배치 제한·재검증']);
  });

  patch('multi-agent', item => {
    item.tech = addUnique(item.tech, [
      'Interoperability (서로 다른 에이전트·도구·서비스가 공통 규격으로 연결되어 함께 작동하는 능력)',
      'Identity (각 에이전트의 주체·출처·권한을 식별하고 인증하는 체계)',
      'Multi-Robot Collaboration (복수 로봇이 역할·상태·정보를 공유하며 하나의 물리적 과업을 공동 수행하는 구조)'
    ]);
    item.issues = addUnique(item.issues, ['에이전트 표준·프로토콜을 통한 상호연결에서 신원위조·권한승계·메시지 출처가 책임귀속에 미치는 문제']);
    item.governance = addUnique(item.governance, ['에이전트별 검증 가능한 신원','메시지 출처·권한승계 기록','상호운용 프로토콜별 안전정책']);
  });

  patch('physical-ai', item => {
    item.tech = addUnique(item.tech, [
      'VLA · Vision-Language-Action Model (영상과 언어를 함께 이해해 로봇의 실제 행동 명령으로 연결하는 모델)',
      'Embodied Reasoning (몸·센서·공간·물리환경의 상태를 반영해 행동을 판단하는 추론)',
      'On-device AI (클라우드가 아니라 로봇·기기 내부에서 직접 인공지능을 실행하는 방식)',
      'Full-Stack Safety (하드웨어·운영체제·모델·제어·검증을 하나의 안전체계로 묶는 접근)'
    ]);
    item.issues = addUnique(item.issues, ['VLA와 체화추론이 고수준 계획부터 실제 구동까지 연결될 때 판단오류가 어느 계층에서 발생했는지 구분하는 문제','온디바이스 실행과 클라우드 지능이 혼합될 때 통제권·업데이트 책임이 분리되는 문제']);
    if (item.academic?.technical) item.academic.technical.push('VLA · Vision-Language-Action Model (영상과 언어를 함께 이해해 로봇의 실제 행동 명령으로 연결하는 모델)과 Embodied Reasoning (몸·센서·공간·물리환경의 상태를 반영해 행동을 판단하는 추론)이 결합되면서 로봇의 법적 평가단위는 단순 제어소프트웨어를 넘어 고수준 계획·센서·행동정책·구동계 전체로 확대된다.');
  });

  patch('autonomous-driving', item => {
    item.tech = addUnique(item.tech, ['Remote Operation (차량 밖의 원격운영자가 통신망을 통해 주행상황을 감독·지원·개입하는 방식)']);
  });

  const newRecords = [
    {
      id:'frontier-evaluation', order:15, title:'프런티어 AI·평가 실행환경', en:'Frontier AI & Evaluation Harness', stage:'현재·확장 기술', maturity:'급속 변화',
      summary:'최첨단 모델의 실제 능력은 모델 자체뿐 아니라 추론 유지, 맥락 압축, 메모리, 도구연결과 평가 실행환경의 구성에 따라 달라지므로 법적 성능평가도 시스템 구성 전체를 기록해야 한다.',
      researchQuestion:'동일 모델의 성능이 Evaluation Harness와 실행설정에 따라 크게 달라질 때 안전성·자율성·주의의무 판단의 기준이 되는 “AI 시스템”은 어디까지 포함해야 하는가.',
      tech:['Frontier Model (현재 최고 수준의 성능과 능력을 겨루는 최첨단 인공지능 모델)','Evaluation Harness (모델을 동일 조건에서 실행·측정하기 위한 평가 코드·도구·설정의 묶음)','Reasoning (문제를 여러 단계로 나누어 판단·추론하는 처리)','Compaction (긴 대화·작업 맥락을 압축해 핵심 상태만 남겨 계속 사용하는 처리)','Benchmark (모델·시스템의 성능을 공통 과제와 지표로 비교하는 평가기준)'],
      currentLaw:['인공지능기본법','민법','소비자법','계약법','고위험 분야별 안전법제'],
      issues:['모델명만으로 실제 성능·위험을 특정할 수 없는 문제','벤치마크 결과의 조건·재현성·표시 적정성','기초모델 제공자와 시스템 통합자의 성능책임 분리'],
      doctrine:['과실책임과 합리적 검증의무','정보제공·표시의무','계약상 성능보증'],
      gaps:['평가 실행환경과 시스템 구성의 법적 기록기준 부족','벤치마크 성능과 실제 배치성능 사이의 차이를 규율하는 기준 부족'],
      comparative:['NIST 평가·위험관리 체계','프런티어 모델 사업자의 공개 평가자료','학술 벤치마크의 재현성 논의'],
      policy:['평가조건·버전·도구·메모리 설정 공개','독립 평가와 재현성 검증'], governance:['배치 전·후 동일 평가세트 반복','구성 변경시 재평가'], legislation:['고위험 AI의 평가구성·버전 기록의무','중대한 성능표시의 근거자료 보존'],
      phdTags:['행위효과','책임귀속','Agentic AI','증명위험','기능적 단위'],
      academic:{
        technical:['Evaluation Harness (모델을 동일 조건에서 실행·측정하기 위한 평가 코드·도구·설정의 묶음)는 단순 시험지가 아니라 프롬프트 형식, 도구 접근, 상태유지, 재시도, 메모리와 점수계산까지 포함할 수 있다. 따라서 동일 모델도 하네스가 달라지면 관찰되는 성능이 크게 달라질 수 있다.','Compaction (긴 대화·작업 맥락을 압축해 핵심 상태만 남겨 계속 사용하는 처리)과 Reasoning (문제를 여러 단계로 나누어 판단·추론하는 처리)은 장기 작업형 에이전트의 지속성에 직접 영향을 준다. 법적으로는 모델 파일이 아니라 실제 배치된 구성 전체가 위험평가의 단위가 되어야 한다.'],
        currentLawAnalysis:['현행법은 특정 벤치마크 점수를 직접적인 책임기준으로 삼지 않는다. 그러나 사업자가 성능을 광고하거나 고위험 시스템의 안전성을 검증하는 경우 어떤 조건에서 측정된 수치인지가 표시의 적정성과 주의의무 판단자료가 될 수 있다.'],
        legalIssuesAnalysis:['모델 제공자가 일반 성능을 제시했더라도 통합자가 도구·메모리·프롬프트 구조를 변경하면 실제 위험은 달라진다. 사고 당시 실행구성을 재현할 수 없으면 성능결함과 통합과실의 구분도 어려워진다.'],
        doctrineAnalysis:['과실책임은 당시 합리적으로 이용 가능한 평가방법과 배치환경 검증을 수행했는지를 묻는 방식으로 적용할 수 있다. 단일 벤치마크 고득점이 실제 사용맥락의 안전성을 자동 보증하지는 않는다.'],
        gapAnalysis:['고위험 AI에 대해 평가환경·버전·도구권한·메모리설정의 보존기준이 통일되어 있지 않다는 점이 핵심 공백이다.'],
        comparativeAnalysis:['NIST AI 위험관리 체계와 산업계의 모델평가 관행은 평가를 일회성 시험이 아니라 배치맥락에 따른 지속적 측정으로 보는 방향을 제공한다.'],
        liabilityEvidence:['모델 버전, Evaluation Harness, 시스템 프롬프트, 도구목록, 메모리·Compaction 설정, 평가 데이터셋과 점수계산 코드를 함께 보존해야 사고 당시 능력을 재구성할 수 있다.'],
        policyAnalysis:['중요 성능수치를 공개할 때는 모델명과 함께 평가조건·실행환경·날짜를 기록하고, 고위험 배치에서는 구성 변경 후 재평가를 요구할 수 있다.'],
        legislationAnalysis:['고위험 AI의 평가자료 보존의무를 모델 단위가 아니라 실제 배치구성 단위로 설계하는 방안을 검토할 수 있다.']
      },
      sources:[{label:'OpenAI · ARC-AGI-3 evaluation configuration',url:'https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/'},{label:'ARC-AGI-3 · arXiv',url:'https://arxiv.org/abs/2603.24621'}]
    },
    {
      id:'agent-security', order:16, title:'에이전트 보안·프롬프트 인젝션', en:'Agent Security & Prompt Injection', stage:'현재·확장 기술', maturity:'고위험 확산',
      summary:'에이전트가 웹·이메일·파일·도구출력의 외부 데이터를 읽고 행동하는 환경에서는 데이터에 숨은 악성 지시가 권한오용·정보유출·거래변경으로 이어질 수 있다.',
      researchQuestion:'Prompt Injection으로 에이전트의 원래 지시가 우회되어 손해가 발생한 경우 모델 제공자·통합자·도구 제공자·운영자의 보안의무와 책임을 어떻게 계층화할 것인가.',
      tech:['Prompt Injection (외부 입력에 숨은 악성 지시가 원래 지시를 덮어쓰거나 우회하게 하는 공격)','Red Teaming (공격자 관점에서 취약점과 실패경로를 의도적으로 찾아내는 안전성 검증)','Self-Play (AI가 서로 다른 역할을 맡아 반복 대결·상호작용하며 전략을 학습하는 방식)','Agent Security (에이전트의 데이터·도구·권한·행동경로를 공격과 오용으로부터 보호하는 보안체계)'],
      currentLaw:['개인정보 보호법','정보통신·사이버보안 법제','민법','계약법','영업비밀 보호법제'],
      issues:['외부 데이터와 명령의 경계 붕괴','도구권한을 이용한 2차 피해','보안통제 실패의 계층별 책임','취약점 공개·패치 시점'],
      doctrine:['과실책임','계약상 안전의무','정보보호의무','위험원 지배'],
      gaps:['에이전트형 프롬프트 인젝션에 대한 표준 주의의무 부족','외부도구까지 연결된 공격경로의 증명곤란'],
      comparative:['NIST 에이전트 보안·표준 논의','AI 사업자의 레드팀·안전평가 관행'],
      policy:['외부 데이터와 시스템 지시의 구조적 분리','중요 도구행위 재승인','지속적 레드팀'], governance:['최소권한','권한만료','도구별 정책검사','공격사례 회귀테스트'], legislation:['고위험 에이전트 보안평가·사고로그 의무','중대한 보안사고 통지기준 검토'],
      phdTags:['책임귀속','Agentic AI','계층적 책임귀속','증명위험','입법론'],
      academic:{
        technical:['Prompt Injection (외부 입력에 숨은 악성 지시가 원래 지시를 덮어쓰거나 우회하게 하는 공격)은 전통적 코드 인젝션과 달리 자연어·문서·웹콘텐츠가 모델에게 명령처럼 해석되는 특성을 이용한다. 에이전트가 외부 도구를 사용할 수 있으면 공격은 단순 출력변조를 넘어 파일삭제·메일전송·정보유출·결제로 연결될 수 있다.','Red Teaming (공격자 관점에서 취약점과 실패경로를 의도적으로 찾아내는 안전성 검증)과 Self-Play (AI가 서로 다른 역할을 맡아 반복 대결하며 전략을 학습하는 방식)는 알려진 공격뿐 아니라 새로운 공격경로를 탐색하는 수단으로 활용될 수 있다.'],
        currentLawAnalysis:['개인정보·영업비밀 유출에는 기존 정보보호법제가 적용될 수 있고, 시스템 운영자가 합리적인 보안통제를 하지 않았다면 민사상 과실과 계약상 안전의무가 문제된다.'],
        legalIssuesAnalysis:['공격자의 고의행위가 존재해도 시스템의 취약한 권한설계가 손해를 확대했다면 제3자의 고의만으로 사업자 책임이 당연히 단절되는 것은 아니다. 예견가능한 공격유형과 합리적 방어조치의 존재가 핵심이다.'],
        doctrineAnalysis:['위험원 지배와 과실책임은 누가 외부 입력경로와 고위험 도구권한을 설계·통제했는지를 기준으로 계층화할 수 있다.'],
        gapAnalysis:['에이전트가 다수 외부서비스를 연결할수록 한 사업자가 전체 공격경로를 통제하지 못하는 구조적 공백이 발생한다.'],
        comparativeAnalysis:['NIST의 에이전트 표준·보안 연구와 산업계의 레드팀 체계는 최소권한·신원·프로토콜 안전을 공통기반으로 발전시키는 방향을 보여준다.'],
        liabilityEvidence:['외부 입력 원문, 시스템 지시, 도구호출, 권한상태, 보안필터 결과, 승인로그, 공격 이후 데이터 이동경로를 시간순으로 보존해야 한다.'],
        policyAnalysis:['고위험 에이전트는 외부 데이터와 명령을 분리하고 중요행위마다 정책검사 또는 인간 재승인을 두며 알려진 공격사례를 지속적으로 회귀테스트해야 한다.'],
        legislationAnalysis:['고위험 분야에서는 에이전트 보안평가·사고로그·취약점 대응절차를 최소 운영의무로 규정하는 방안을 검토할 수 있다.']
      },
      sources:[{label:'OpenAI · GPT-Red',url:'https://openai.com/index/unlocking-self-improvement-gpt-red/'},{label:'NIST · AI Agent Standards Initiative',url:'https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative'}]
    },
    {
      id:'ai-compute-memory', order:17, title:'AI 컴퓨팅·메모리 아키텍처', en:'AI Compute & Memory Architecture', stage:'현재 기술', maturity:'급속 확장',
      summary:'대형 모델과 에이전트가 개인 PC·워크스테이션에서 직접 실행되면서 GPU 성능뿐 아니라 통합 메모리, VRAM, KV Cache와 로컬 추론이 데이터 통제·책임경계의 핵심 인프라가 되고 있다.',
      researchQuestion:'클라우드 중심 AI가 로컬·온디바이스 실행으로 이동할 때 서비스 제공자·기기 제조자·소프트웨어 통합자·최종 운용자의 통제가능성과 법적 책임은 어떻게 달라지는가.',
      tech:['Unified Memory (CPU·GPU 등이 하나의 메모리 공간을 공유해 대형 모델 실행 효율을 높이는 구조)','VRAM · Video Random Access Memory (GPU가 모델 가중치·연산 데이터를 저장하는 전용 메모리)','KV Cache · Key-Value Cache (생성 과정에서 이전 토큰의 계산결과를 저장해 다음 추론을 빠르게 하는 메모리)','Local Inference (클라우드 서버가 아닌 개인 기기·로컬 장비에서 모델 추론을 수행하는 방식)','On-device AI (클라우드가 아니라 기기 내부에서 직접 인공지능을 실행하는 방식)'],
      currentLaw:['개인정보 보호법','정보보안 법제','제조물책임법','소프트웨어법','계약법'],
      issues:['로컬 실행 시 데이터의 외부전송 감소와 단말 내부 위험 증가','기기 사양과 모델 성능표시','로컬 에이전트의 독립적 행동에 대한 서비스 제공자 통제 한계','모델·드라이버·OS 공급망 책임'],
      doctrine:['과실책임','제품·소프트웨어 결함','정보보호의무','계약상 성능·안전의무'],
      gaps:['로컬 에이전트의 사고로그·업데이트 책임주체 불명확','하드웨어 자원제약이 안전성에 미치는 영향의 법적 평가기준 부족'],
      comparative:['온디바이스 개인정보보호 정책','AI PC·워크스테이션의 산업표준과 공급망 안전논의'],
      policy:['로컬 실행시 데이터 저장·삭제정책 명확화','하드웨어 자원 부족시 안전한 기능저하'], governance:['모델·드라이버·OS 버전관리','로컬 로그 암호화','원격관리 권한 최소화'], legislation:['고위험 로컬 AI의 최소 로그·업데이트 기준 검토'],
      phdTags:['책임귀속','Agentic AI','계층적 책임귀속','증명위험','기능적 단위'],
      academic:{
        technical:['Unified Memory (CPU·GPU 등이 하나의 메모리 공간을 공유해 대형 모델 실행 효율을 높이는 구조)는 대형 모델을 단일 장치에서 실행할 수 있는 범위를 넓힌다. VRAM (GPU가 모델 가중치·연산 데이터를 저장하는 전용 메모리)과 KV Cache (이전 토큰 계산결과를 저장해 다음 추론을 빠르게 하는 메모리)는 모델 크기와 긴 맥락 유지능력을 결정하는 핵심 자원이다.','Local Inference (클라우드가 아닌 개인 기기·로컬 장비에서 모델 추론을 수행하는 방식)는 개인정보의 외부전송을 줄일 수 있지만 동시에 중앙 서비스 제공자의 실시간 통제·차단·로그접근 가능성을 약화시킨다.'],
        currentLawAnalysis:['개인정보가 단말 안에서만 처리되더라도 개인정보 보호법상 처리책임이 사라지는 것은 아니다. 로컬 소프트웨어와 하드웨어 결함이 손해에 결합하면 제조자·소프트웨어 제공자·운영자의 통제범위를 나누어 보아야 한다.'],
        legalIssuesAnalysis:['동일 모델이라도 메모리 부족, 양자화, 컨텍스트 축소 등 하드웨어 제약으로 성능과 안전성이 달라질 수 있어 제품사양과 실제 기능표시의 적정성이 문제된다.'],
        doctrineAnalysis:['통제가능성 기준은 클라우드 제공자가 아니라 실제 모델·권한·데이터를 관리하는 로컬 운영자와 기기·소프트웨어 공급자 쪽으로 이동할 수 있다.'],
        gapAnalysis:['고위험 로컬 AI의 사고시 중앙 사업자가 원격 로그를 보유하지 않는 경우 증거보존 책임을 누구에게 둘지 불명확하다.'],
        comparativeAnalysis:['AI PC와 온디바이스 AI 확산은 데이터 보호와 제품안전을 동시에 다루는 새로운 규제접점을 형성한다.'],
        liabilityEvidence:['기기 모델, GPU·메모리 사양, OS·드라이버·모델 버전, 로컬 설정, 로그, 업데이트이력을 함께 확보해야 한다.'],
        policyAnalysis:['고위험 로컬 AI에는 최소한의 안전로그와 버전정보를 단말에 암호화하여 보존하고 중대한 사고시 사용자가 내보낼 수 있는 기능을 고려할 수 있다.'],
        legislationAnalysis:['로컬 실행 자체를 규제하기보다 고위험 용도에서 버전·로그·업데이트·책임주체를 추적할 수 있는 최소기준을 마련하는 것이 적절하다.']
      },
      sources:[{label:'AMD · Agent Computers',url:'https://www.amd.com/en/blogs/2026/amd-powers-next-generation-agent-computers-with-new-ryzen-ai-hal.html'}]
    },
    {
      id:'agent-standards', order:18, title:'AI 에이전트 표준·상호운용성', en:'AI Agent Standards & Interoperability', stage:'확장 기술', maturity:'표준화 초기',
      summary:'서로 다른 사업자의 에이전트가 도구·데이터·다른 에이전트와 연결되는 단계에서는 공통 프로토콜뿐 아니라 신원, 권한, 메시지 출처, 로그와 인증체계가 법적 책임추적의 기반이 된다.',
      researchQuestion:'에이전트 상호운용 표준이 사실상의 시장 인프라가 될 때 신원·권한·메시지 출처·감사로그를 어느 수준까지 법적 안전기준으로 수용할 것인가.',
      tech:['Interoperability (서로 다른 에이전트·도구·서비스가 공통 규격으로 연결되어 함께 작동하는 능력)','Identity (에이전트의 주체·출처·권한을 식별하고 인증하는 체계)','Authentication (접속한 에이전트·사용자가 실제로 주장한 주체가 맞는지 확인하는 절차)','Authorization (인증된 주체가 어떤 데이터·도구·행동을 사용할 수 있는지 권한을 부여·제한하는 절차)','Protocol (서로 다른 시스템이 메시지와 기능을 교환하기 위해 따르는 통신규칙)'],
      currentLaw:['인공지능기본법','전자거래 법제','개인정보 보호법','사이버보안 법제','민법·계약법'],
      issues:['에이전트 신원위조와 권한오용','프로토콜을 통한 책임분산','표준준수와 민사상 주의의무의 관계','사업자 간 로그·사고협조'],
      doctrine:['전자적 의사표시','과실책임','계약상 안전의무','공동불법행위'],
      gaps:['상호운용 에이전트의 법적 식별자·권한표시 기준 부족','사업자 간 사건로그 연결기준 부족'],
      comparative:['NIST AI Agent Standards Initiative','산업 주도 개방형 에이전트 프로토콜과 신원체계 논의'],
      policy:['검증 가능한 에이전트 신원','권한위임 범위 표시','공통 사고로그 규격'], governance:['상호인증','권한최소화','메시지 무결성','프로토콜 버전관리'], legislation:['고위험 상호운용 환경의 식별·로그·사고협조 의무 검토'],
      phdTags:['행위효과','책임귀속','Multi-Agent','계층적 책임귀속','증명위험'],
      academic:{
        technical:['Interoperability (서로 다른 에이전트·도구·서비스가 공통 규격으로 연결되어 함께 작동하는 능력)는 단순 API 연결을 넘어 상대 에이전트의 기능·권한·메시지 형식을 이해하고 협업하는 상태를 뜻한다. Identity (에이전트의 주체·출처·권한을 식별하고 인증하는 체계)가 없으면 누가 어떤 지시를 보냈는지 사후 책임추적이 어려워진다.'],
        currentLawAnalysis:['표준 자체는 곧바로 법률이 아니지만 산업에서 광범위하게 채택되면 전문사업자의 합리적 보안·주의수준을 판단하는 사실상 기준으로 기능할 수 있다.'],
        legalIssuesAnalysis:['표준을 준수했다는 사실이 자동 면책을 의미하는지, 반대로 보편화된 안전표준을 무시한 것이 과실의 근거가 되는지가 핵심 쟁점이다.'],
        doctrineAnalysis:['과실책임에서는 당시 통상적으로 기대되는 기술적 안전조치와 표준의 보급정도가 주의의무 구체화 자료가 될 수 있다.'],
        gapAnalysis:['서로 다른 사업자의 에이전트가 연결될 때 공통 법적 식별자와 사고협조 절차가 없으면 책임이 네트워크 경계에서 단절될 수 있다.'],
        comparativeAnalysis:['NIST의 AI Agent Standards Initiative는 상호운용성·보안·인증·신원을 하나의 표준화 의제로 다룬다는 점에서 책임추적 인프라 연구에 직접 연결된다.'],
        liabilityEvidence:['에이전트 식별자, 인증서, 권한위임, 메시지 출처, 프로토콜 버전, 상호작용 로그를 보존해야 한다.'],
        policyAnalysis:['고위험 에이전트 생태계에서는 기술표준과 계약표준을 결합해 신원·권한·로그·사고협조의 최소요건을 마련할 수 있다.'],
        legislationAnalysis:['법률이 특정 프로토콜을 고정하기보다 검증 가능한 신원·권한·로그라는 기능적 요건을 제시하고 세부 기술은 표준으로 위임하는 방식이 적절하다.']
      },
      sources:[{label:'NIST · AI Agent Standards Initiative',url:'https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative'}]
    },
    {
      id:'autonomous-drones', order:19, title:'드론·무인항공시스템 자율화', en:'Autonomous Drones & UAS', stage:'현재·확장 기술', maturity:'상용화 확대',
      summary:'드론 배송·점검·감시·군집운용이 비가시권 비행과 자율판단으로 확대되면서 기체 안전뿐 아니라 통신·지상통제·운영승인·사고책임을 하나의 시스템으로 분석해야 한다.',
      researchQuestion:'BVLOS와 자율운항이 확대될 때 기체 제조자·운영자·원격조종자·자율비행 소프트웨어·통신사업자의 책임과 인허가 의무를 어떻게 계층화할 것인가.',
      tech:['UAS · Unmanned Aircraft System (드론 기체뿐 아니라 조종·통신·지상통제까지 포함한 무인항공시스템)','BVLOS · Beyond Visual Line of Sight (조종자가 육안으로 기체를 직접 볼 수 없는 범위에서 수행하는 비가시권 비행)','Autonomous Flight (사전에 정한 경로만 따르는 것을 넘어 센서와 알고리즘이 상황에 따라 비행행동을 선택하는 자율비행)','Fleet Management (복수 드론의 위치·임무·배터리·통신상태를 통합 관리하는 운영체계)'],
      currentLaw:['항공안전법','항공사업법','개인정보 보호법','민법','제조물책임법','전파·통신 관련 법제'],
      issues:['BVLOS 운항승인과 안전기준','통신두절·GPS 오류·충돌의 복합원인','배송·감시 과정의 개인정보 처리','복수 드론 군집운용의 책임분산'],
      doctrine:['운영자 과실','제조물 결함','공동불법행위','인허가상 안전의무'],
      gaps:['자율비행 소프트웨어와 운영자의 실질적 통제경계','군집운용 사고의 로그·인과관계 재구성 기준'],
      comparative:['미 FAA UAS·BVLOS 규제와 배송운영 승인','각국 무인항공 안전·개인정보 규율'],
      policy:['운항범위별 위험등급','지오펜싱·충돌회피','통신상실 안전모드'], governance:['비행로그','원격운영자 식별','기체·소프트웨어 버전관리','사고 자동 증거동결'], legislation:['BVLOS·고자율 UAS의 로그·보험·책임주체 기준 정교화'],
      phdTags:['행위효과','책임귀속','Multi-Agent','계층적 책임귀속','증명위험','입법론'],
      academic:{
        technical:['UAS · Unmanned Aircraft System (드론 기체뿐 아니라 조종·통신·지상통제까지 포함한 무인항공시스템)는 기체 하나보다 넓은 시스템 개념이다. BVLOS (조종자가 육안으로 기체를 직접 볼 수 없는 범위의 비가시권 비행)에서는 조종자의 직접 관찰이 약화되어 센서·통신·원격관제·자동 충돌회피의 신뢰성이 중요해진다.'],
        currentLawAnalysis:['항공안전법상 운항·안전 규율과 사업 관련 인허가, 개인정보 보호, 제조물·민사책임이 중첩될 수 있다. 승인받은 운항이라고 해서 사고시 민사책임이 자동 면제되는 것은 아니다.'],
        legalIssuesAnalysis:['통신두절·센서오류·소프트웨어 판단·운영자의 감독부실이 결합한 사고에서 어느 위험이 누구의 통제영역에 있었는지가 핵심이다.'],
        doctrineAnalysis:['운영자 과실과 제조물 결함을 분리하되 복수 원인이 결합한 경우 공동불법행위와 구상관계를 검토할 수 있다.'],
        gapAnalysis:['군집·장거리 자율운항에서는 개별 드론의 로그와 중앙 Fleet Management 기록을 동기화하지 않으면 사고경로를 재구성하기 어렵다.'],
        comparativeAnalysis:['미 FAA의 드론 배송·BVLOS 규제는 기술성능뿐 아니라 운영승인·환경·지역영향·안전절차가 상용화 조건이라는 점을 보여준다.'],
        liabilityEvidence:['기체 식별자, 비행경로, 센서·GPS·통신상태, 자율비행 명령, 원격운영 개입, 소프트웨어버전과 중앙 운영로그가 핵심 증거다.'],
        policyAnalysis:['장거리·배송·군집운용에는 비행위험도에 따라 로그·보험·충돌회피·통신상실 안전모드를 차등 요구할 수 있다.'],
        legislationAnalysis:['BVLOS와 고자율 UAS의 책임주체·사고로그·보험·운영승인 기준을 기술발전에 맞춰 정교화할 필요가 있다.']
      },
      sources:[{label:'FAA · NEPA and Drones',url:'https://www.faa.gov/uas/advanced_operations/nepa_and_drones'}]
    }
  ];

  newRecords.forEach(record => {
    if (!records.some(existing => existing.id === record.id)) records.push(record);
  });

  if (!gaps.some(item => item.id === 'prompt-injection')) gaps.push({
    id:'prompt-injection',
    title:'에이전트 명령경계·프롬프트 인젝션 공백',
    problem:'외부 데이터에 포함된 지시가 에이전트의 시스템 지시와 혼합되어 권한오용·데이터유출·거래변경으로 이어질 수 있으나 데이터와 명령의 법적·기술적 경계가 불명확한 문제',
    existing:'과실책임·정보보호의무·계약상 안전의무와 보안관리의무를 통제가능성에 따라 적용',
    solutions:['외부 데이터와 명령 채널 분리','도구별 최소권한','중요행위 재승인','레드팀·공격 회귀테스트','공격·권한 로그보존']
  });

  if (!gaps.some(item => item.id === 'system-evaluation')) gaps.push({
    id:'system-evaluation',
    title:'모델·실행환경 평가단위 공백',
    problem:'동일한 기반모델도 메모리·도구·Compaction·Evaluation Harness 구성에 따라 성능과 위험이 달라져 모델명만으로 실제 시스템 능력을 특정하기 어려운 문제',
    existing:'과실책임·성능표시·안전검증의무를 실제 배치환경 기준으로 구체화',
    solutions:['평가조건 표준기록','배치구성 버전관리','중대한 구성변경 재평가','독립 재현성 검증']
  });

  if (!policies.some(item => item.id === 'agent-identity')) policies.push({
    id:'agent-identity',
    title:'에이전트 신원·권한 표준',
    role:'서로 다른 에이전트가 상호작용할 때 주체·출처·권한·메시지 경로를 검증하고 사고 후 책임사슬을 복원하는 기반 마련',
    trigger:'다중 에이전트·외부 도구·사업자 간 상호운용이 이루어지는 환경',
    caution:'특정 민간 프로토콜을 법률로 고정하기보다 검증 가능한 신원·권한·로그라는 기능적 요건을 규정한다.'
  });
})();
