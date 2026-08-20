(()=>{
'use strict';
const cur=window.NEXUS_CURRICULUM||{};
const books=window.NEXUS_CORE_TEXTBOOK=window.NEXUS_CORE_TEXTBOOK||{};
const tracks={
  core:['핵심 개념','용어와 정의','문제구조','대표 이론','방법과 증거','분석과 추론','대표 사례','반론과 한계','검증과 오류','현대 적용','인접학문 연결','종합 과제'],
  humanities:['핵심 개념','역사적 맥락','원전과 1차 자료','대표 이론','텍스트·사료 비판','해석 방법','대표 사례','경쟁 해석','비판과 반론','현대 적용','인접학문 연결','종합 세미나'],
  social:['핵심 개념','행위자와 구조','고전 이론','현대 이론','개념화와 측정','연구설계와 인과','대표 경험연구','제도와 맥락','경쟁설명과 반론','정책 적용','디지털·AI 쟁점','종합 사례'],
  law:['법원과 핵심개념','법률관계','요건과 효과','해석 방법','대표 학설','판례 구조','절차와 증명','사례 포섭','대립논증','비교법·정책','기술·AI 쟁점','종합 사례'],
  natural:['기본 단위와 변수','핵심 법칙','측정과 오차','대표 모형','실험 방법','수학적 관계','대표 현상','자료 해석','가정과 한계','응용 문제','현대 연구','종합 실험'],
  engineering:['요구조건','기초 원리','수학적 모델','구성요소','설계 방법','시뮬레이션','대표 시스템','실험·검증','고장·안전','최적화','자동화·AI','설계 프로젝트'],
  computing:['문제와 추상화','자료 표현','핵심 알고리즘','시스템 구조','구현 방법','복잡도·성능','대표 서비스','테스트·검증','보안·실패','확장성','AI·사회 쟁점','구현 프로젝트'],
  medicine:['정상 구조','정상 기능','병태생리','원인·위험요인','증상과 징후','검사와 진단','감별진단','치료 원리','근거와 안전','예후·예방','의료윤리·AI','Case Conference'],
  architecture:['공간과 사용자','대지와 맥락','형태와 구성','구조와 하중','재료와 구축','환경과 설비','대표 사례','도면·BIM','안전·법규','도시 연결','스마트시티·AI','Design Studio'],
  arts:['매체와 형식','기초 요소','역사와 양식','작품 분석','기법과 제작','구성 원리','대표 작품','창작 실습','비평과 수정','디지털 미디어','생성형 AI','Creative Capstone'],
  theology:['본문과 정경','원어와 핵심용어','역사적 맥락','본문·자료비평','해석 방법','신학적 주제','대표 본문','상호본문성','논쟁과 반론','수용사','디지털 본문연구','Exegetical Capstone'],
  education:['학습문제와 목표','학습자 차이','학습이론','교육과정','설명과 연습','수업 상호작용','평가와 측정','피드백','학습데이터','디지털 학습','AI Tutor','Instructional Design'],
  interdisciplinary:['문제정의','이해관계자','시스템 맵','전문분야 렌즈','사회·윤리 렌즈','증거와 불확실성','위험과 실패','가치충돌','법·거버넌스','시나리오','대안설계','통합 Capstone']
};
const domainMethod={
  law:'법규범·판례·학설·사실관계를 구분하고 요건과 효과를 단계적으로 포섭한다',
  computing:'자료구조·알고리즘·계산모형·구현·성능·실패조건을 연결해 분석한다',
  natural:'법칙·모형·측정·실험·오차·경계조건을 함께 검토한다',
  engineering:'요구조건·모델링·설계·검증·안전·고장모드를 하나의 설계 사이클로 분석한다',
  medicine:'정상기전·병태생리·진단·근거수준·외적타당도·환자안전을 구분해 학습한다',
  social:'이론·개념화·측정·연구설계·인과추론·경쟁설명을 구분해 분석한다',
  humanities:'원전·1차 자료·역사적 맥락·해석·경쟁해석을 구분해 읽는다',
  theology:'본문·원어·전승·역사적 맥락·교리적 해석을 구분하고 원자료가 허용하는 범위를 먼저 확인한다',
  arts:'형식·작품·기법·맥락·창작·비평을 연결하고 결과물을 반복 수정한다',
  architecture:'대지·사용자·공간·구조·환경·법규·표현·검증을 통합한다',
  education:'학습목표·학습자·학습이론·교수전략·평가·피드백·재설계를 연결한다',
  interdisciplinary:'여러 분야의 전제와 증거수준을 분리한 뒤 시스템 수준의 trade-off를 통합한다',
  core:'핵심개념·근거·방법·적용조건·반론을 연결해 학습한다'
};
const generated=[];
for(const c of (cur.all||[])){
  const existing=books[c.id];
  if(existing&&Array.isArray(existing.lessons)&&existing.lessons.length)continue;
  const plan=tracks[c.domain]||tracks.core;
  const method=domainMethod[c.domain]||domainMethod.core;
  const summary=String(c.summary||`${c.title}의 핵심 문제와 방법을 학습한다`).trim();
  books[c.id]={
    provisional:true,
    overview:`${c.title}은 ${summary} 이 과정에서는 ${method}. 기초 개념에서 출발해 전공의 핵심 방법, 사례 적용, 비판과 종합까지 12개 Lesson으로 단계적으로 학습한다.`,
    texts:[],
    lessons:plan.map((topic,i)=>{
      const n=i+1;
      const body=`${c.title}의 ${topic} 단계에서는 ${summary}라는 과목의 중심 문제를 ${method}. 단순 암기보다 개념의 정의, 전제, 적용범위와 실패조건을 확인하고, 앞선 Lesson의 내용을 다음 단계와 연결해 하나의 전공 지식구조로 재구성한다.`;
      const concepts=[`${c.title} 핵심개념`,topic,`${c.department||c.college||'전공'} 관점`,n<=4?'기초 구조':n<=8?'분석·적용':'비판·종합'];
      const application=`${c.title}과 관련된 실제 또는 가상 사례를 하나 선정하고 ${topic}의 기준으로 문제를 분해한 뒤, 필요한 근거와 누락된 변수를 확인하여 대안 설명을 제시한다.`;
      return [`${topic}`,body,concepts,'',application,[]];
    })
  };
  generated.push(c.id);
}
window.NEXUS_TEXTBOOK_COVERAGE_BRIDGE={generated,count:generated.length,total:(cur.all||[]).length};
if(generated.length)console.warn('NEXUS UNIVERSITY textbook coverage bridge supplemented:',generated);
})();
