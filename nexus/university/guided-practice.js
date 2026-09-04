(() => {
'use strict';

const cur=window.NEXUS_CURRICULUM||{};
const books=window.NEXUS_CORE_TEXTBOOK||{};
const id=new URLSearchParams(location.search).get('id');
const course=(cur.all||[]).find(x=>x.id===id);
const rich=books[id];
if(!course||!rich||!Array.isArray(rich.lessons))return;

const clip=(v,max=260)=>{const s=String(v||'').replace(/\s+/g,' ').trim();return s.length>max?`${s.slice(0,max-1)}…`:s;};
const list=v=>Array.isArray(v)?v.filter(Boolean).map(String):[];
function kind(code,domain){
  if(code.startsWith('CORE-'))return'core';
  if(/^(LAW|PPA)-/.test(code))return'law';
  if(/^(CS|DS|AI|ROB|SEC)-/.test(code))return'ai';
  if(/^PHI-/.test(code))return'philosophy';
  if(/^(SOC|POL|PSY|ANT|URBS)-/.test(code))return'social';
  if(/^(MATH|PHY|CHEM|BIO|ENV)-/.test(code))return'natural';
  if(/^(ME|EE|CE|MSE|ISE)-/.test(code))return'engineering';
  if(/^(BMS|CLN|NEU|PH|MEH)-/.test(code))return'medicine';
  if(/^(BIB|BLG|SYS|CHH|JRS)-/.test(code))return'theology';
  if(/^(HIS|LIT|LIN|CIV)-/.test(code))return'humanities';
  if(/^(MUS|FAR|DES|AES)-/.test(code))return'arts';
  if(/^(ECO|BUS|FIN)-/.test(code))return'economics';
  if(/^(ARC|ARE|URB)-/.test(code))return'architecture';
  if(/^(EDU|LRS)-/.test(code))return'education';
  if(/^(INT|SEM)-/.test(code))return'interdisciplinary';
  if(domain==='computing')return'ai';
  return domain||'core';
}
const k=kind(course.id,course.domain);

const paths={
  core:['정의','핵심명제','근거','적용조건','반론'],
  law:['사실','쟁점','규범','요건','포섭','반론','결론'],
  ai:['입력·출력','알고리즘·모형','시스템','평가','실패모드','한계'],
  philosophy:['문제설정','명제','논증','숨은 전제','반론','재반론'],
  social:['개념화','변수·측정','자료','인과·식별','경쟁설명','한계'],
  natural:['변수·단위','법칙·모형','가정','계산·관측','오차','한계'],
  engineering:['요구조건','모델','설계','검증','고장모드','안전'],
  medicine:['정상 구조·생리','병태생리','증상·징후','감별','검사','치료원리','근거','안전'],
  theology:['본문','원어·문맥','역사적 맥락','자료비평','해석','교리적 함의','대립해석'],
  humanities:['자료','작성시기·장르','맥락','사료·텍스트 비판','해석','경쟁해석'],
  arts:['형식·재료','기법','작품·맥락','효과','비평','수정'],
  economics:['가정','변수','모형·자료','계산·추정','민감도','의사결정'],
  architecture:['대지·사용자','프로그램','공간·구조','환경·법규','설계','검증·수정'],
  education:['학습목표','선수지식','활동','평가','피드백','재설계'],
  interdisciplinary:['문제경계','이해관계자','분야별 증거','불확실성·위험','가치충돌','대안','잔여위험']
};
const limits={
  core:'정의의 범위가 달라지거나 다른 설명모형이 더 적합한 경우',
  law:'관할·사실관계·적용시점·증거 또는 대립하는 법적 해석이 달라지는 경우',
  ai:'데이터 분포·구현·평가척도·시스템 권한·실행환경이 달라지는 경우',
  philosophy:'숨은 전제가 받아들여지지 않거나 경쟁 논증이 더 강한 경우',
  social:'측정오차·선택편향·역인과·누락변수 또는 외적타당도 문제가 있는 경우',
  natural:'가정·경계조건·단위·측정오차가 모형의 적용범위를 벗어나는 경우',
  engineering:'요구조건·하중·재료·환경·안전계수가 설계 가정을 벗어나는 경우',
  medicine:'환자의 상태·검사전확률·동반질환·근거수준이 달라지거나 위험신호가 존재하는 경우',
  theology:'본문의 언어·사본·문맥·시대층과 후대 교리적 해석을 구분하지 않는 경우',
  humanities:'자료의 작성목적·전승상태·생존편향 또는 경쟁 사료가 다른 해석을 지지하는 경우',
  arts:'매체·작품맥락·의도·수용자의 평가기준이 달라지는 경우',
  economics:'가정·기준시점·자료·가격·할인율·행동반응이 달라지는 경우',
  architecture:'대지·법규·사용자·환경성능·구조조건이 달라지는 경우',
  education:'학습자의 선수지식·인지부하·평가도구·전이환경이 달라지는 경우',
  interdisciplinary:'각 분야의 증거수준과 가치기준을 동일한 척도로 취급하는 경우'
};
const counters={
  core:'같은 현상을 다른 개념틀로 설명할 수 있으며, 현재 설명은 특정 전제에 의존할 수 있다.',
  law:'같은 사실에서도 다른 조문·판례·법리가 우선 적용되거나 요건 충족 여부가 달리 평가될 수 있다.',
  ai:'벤치마크 성능이 실제 환경의 신뢰성·안전성·일반화 성능을 그대로 보장하지 않는다.',
  philosophy:'결론을 부정하기보다 그 결론을 지탱하는 핵심 전제 하나를 거부하는 반론이 더 강하다.',
  social:'관찰된 관계는 제3변수·선택효과·역인과로도 설명될 수 있으므로 인과결론을 바로 내릴 수 없다.',
  natural:'모형은 현실을 단순화하므로 경계조건 밖에서는 다른 모형이나 추가 항이 필요할 수 있다.',
  engineering:'정상작동 사례만으로 설계 안전성을 증명할 수 없으며 실패모드와 극한조건 검증이 필요하다.',
  medicine:'한 증상이나 검사결과만으로 진단을 확정할 수 없으며 위험질환과 흔한 질환을 함께 감별해야 한다.',
  theology:'후대의 교리적 결론이 본문이 직접 말하는 범위를 넘어설 수 있으므로 본문·전승·수용사를 분리해야 한다.',
  humanities:'한 자료의 서술은 작성자의 목적과 생존한 자료의 편향을 반영할 수 있으므로 독립자료 교차검증이 필요하다.',
  arts:'형식적 완성도만으로 작품의 역사적·사회적·수용 맥락 전체를 설명할 수 없다.',
  economics:'모형의 최적해가 현실의 제약·불확실성·분배효과까지 자동으로 최적화하는 것은 아니다.',
  architecture:'형태적 완성도가 구조·환경·접근성·법규·사용성의 충족을 자동으로 보장하지 않는다.',
  education:'즉시 수행 향상이 장기 기억이나 새로운 상황으로의 전이를 보장하지 않는다.',
  interdisciplinary:'한 분야에서 강한 증거가 다른 분야의 규범적·법적 결론까지 자동으로 결정하지 않는다.'
};

function grouped(concepts){
  const out={};
  list(concepts).forEach(raw=>{
    const p=raw.indexOf(':');
    const key=p>0?raw.slice(0,p).trim():'핵심개념';
    const value=p>0?raw.slice(p+1).trim():raw.trim();
    (out[key]||(out[key]=[])).push(value);
  });
  return out;
}
function one(g,keys,fallback=''){
  for(const key of keys){if(g[key]?.length)return g[key][0];}
  return fallback;
}
function conceptText(concepts,n=5){return list(concepts).slice(0,n).map(x=>x.replace(/^[^:]{1,20}:\s*/,'' )).join(' · ');}
function readingText(readings){return list(readings)[0]||'대표 원전·표준문헌';}

function answersFor(lesson){
  const title=clip(lesson?.[0],120);
  const thesis=clip(lesson?.[1],360);
  const concepts=list(lesson?.[2]);
  const formula=clip(lesson?.[3],220);
  const caseText=clip(lesson?.[4],320);
  const readings=list(lesson?.[5]);
  const g=grouped(concepts);
  const cs=conceptText(concepts,5)||title;
  const route=(paths[k]||paths.core).join(' → ');
  const limit=limits[k]||limits.core;
  const counter=counters[k]||counters.core;
  const source=readingText(readings);

  if(k==='medicine'){
    const normal=one(g,['정상구조'],'정상 구조');
    const phys=one(g,['생리'],'정상 생리');
    const path=one(g,['병태생리'],'병태생리 변화');
    const diag=one(g,['진단'],'병력·진찰·검사의 통합');
    const diff=one(g,['감별'],'경쟁 진단');
    const treat=one(g,['치료원리'],'적응증·금기·위해를 고려한 치료원리');
    const evidence=one(g,['근거수준'],'근거수준 평가');
    const safety=one(g,['환자안전'],'환자안전 점검');
    return [
      `모범답안은 정상과 이상을 먼저 분리한다. 정상 기준은 “${normal}”과 “${phys}”이고, 이상은 “${path}”가 정상 기전을 어떻게 변화시키는지 설명하는 것이다. 따라서 “정상 구조·기능 → 변화된 기전 → 예상되는 증상·징후” 순으로 연결하면 된다.`,
      `진단은 한 결과를 곧바로 정답으로 보는 과정이 아니다. 이 Lesson에서는 “${diag}”를 사용하되 “${diff}”를 경쟁가설로 함께 둔다. 검사 전에는 어떤 질환 가능성이 높은지 생각하고, 검사 뒤에는 결과가 그 가능성을 얼마나 바꾸는지를 해석해야 한다. ${limit}에는 결론을 다시 조정해야 한다.`,
      `사례는 ${route} 순서로 푼다. 먼저 문제목록과 위험신호를 적고, “${path}”로 증상을 설명한 뒤 “${diff}”를 우선순위화한다. 필요한 검사는 감별을 줄이는 데 실제로 도움이 되는지 판단하고, 치료는 “${treat}”의 목표·적응증·주요 위해를 구분한다. 마지막에 “${safety}”를 확인한다.`,
      `대표 읽기자료 “${source}”를 기준으로 하되 모든 환자에게 같은 결론을 기계적으로 적용하지 않는다. 근거는 “${evidence}”의 수준과 적용대상을 확인해야 한다. 가능한 반론은 “${counter}”이다. 이 과목의 사례는 교육용이며 실제 진료 판단을 대신하지 않는다.`
    ];
  }
  if(k==='law'){
    const norm=one(g,['조문·규범'],'적용 가능한 조문·규범');
    const theory=one(g,['법리·학설'],'관련 법리·학설');
    const precedent=one(g,['판례'],'관련 판례');
    const compare=one(g,['비교법'],'비교법 자료');
    return [
      `핵심 개념은 “${norm}”, “${theory}”${precedent?`, “${precedent}”`:''}를 같은 층위로 섞지 않는 것이다. 조문은 적용규범, 법리·학설은 해석과 논증, 판례는 구체적 사실관계에서의 판단근거다. 답안에서는 각각의 역할을 구분한 뒤 서로 어떻게 연결되는지를 설명한다.`,
      formula?`제시된 법적 모형·관계 “${formula}”는 계산식처럼 외우기보다 각 요소가 어떤 법적 요건이나 판단요소를 뜻하는지 분해한다. 그 뒤 충족사실과 미충족사실을 나누고 반대해석 가능성을 적는다.`:`핵심 설명은 “${thesis}”이다. 이 명제가 성립하려면 관련 법원이 실제 사안에 적용되고 사실이 법률요건에 포섭되어야 한다. ${limit}에는 결론이 달라질 수 있으므로 적용시점·관할·증거·반대논증을 별도로 확인한다.`,
      `사례는 ${route} 순으로 작성한다. 먼저 평가가 필요한 사실을 뽑고 쟁점을 한 문장으로 특정한다. 그 다음 “${norm}”의 요건을 나눈 뒤 각 요건에 사실과 증거를 포섭한다. “${theory}”와 ${precedent||'관련 판례'}를 근거로 찬반 논증을 비교한 뒤 잠정 결론과 가능한 구제수단을 적는다.`,
      `대표문헌 “${source}” 또는 ${compare||'비교법·판례 자료'}를 사용할 때는 결론만 인용하지 말고 어떤 사실과 논증에서 그 결론이 나왔는지 확인한다. 가능한 반론은 “${counter}”이다. 좋은 답안은 가장 강한 반대논증을 먼저 제시한 뒤 왜 수용하거나 배척하는지를 설명한다.`
    ];
  }
  if(k==='ai'){
    const algorithm=one(g,['알고리즘'],'핵심 알고리즘');
    const system=one(g,['시스템 구조'],'시스템 구조');
    const paper=one(g,['대표논문'],'대표 연구');
    const failure=one(g,['실패모드'],'대표 실패모드');
    return [
      `“${algorithm}”과 “${system}”을 구별한다. 알고리즘은 입력을 어떤 계산절차로 출력에 바꾸는지, 시스템 구조는 그 알고리즘이 데이터·메모리·네트워크·도구와 어떻게 결합되는지를 설명한다. 답안은 입력 → 처리 → 출력 → 평가척도 순으로 쓰고 “${failure}”가 어디서 발생하는지도 표시한다.`,
      formula?`제시된 식·모형은 “${formula}”이다. 먼저 결과변수와 입력항을 구분하고 각 항의 의미·단위·방향을 확인한다. 그 다음 어떤 데이터분포와 구현조건에서 성립하는지 적고, 작은 예를 대입한 뒤 경계조건과 실패조건을 확인한다. 식의 값이 좋다고 실제 시스템의 안전성까지 자동으로 증명되는 것은 아니다.`:`핵심 설명은 “${thesis}”이다. 이를 평가하려면 데이터·구현·baseline·평가척도와 실행환경이 명시되어야 한다. ${limit}에는 실험결과를 그대로 일반화하면 안 된다.`,
      `사례·실습은 ${route} 순으로 푼다. 무엇이 입력되고 어떤 출력이 필요한지 정의한 뒤 “${algorithm}”을 선택하고 “${system}”에서 실행 위치를 정한다. 이후 성능·오류·보안·“${failure}”를 테스트하고 로그로 원인을 재구성한다.`,
      `대표문헌 “${paper||source}”을 읽을 때는 제안기법·실험설정·baseline·평가척도·한계를 분리한다. 가능한 반론은 “${counter}”이다. 논문의 성능수치와 실제 배포환경의 효과를 동일시하지 않는 것이 핵심이다.`
    ];
  }
  if(k==='natural'){
    const law=one(g,['법칙'],'핵심 법칙');
    const experiment=one(g,['실험'],'대표 실험');
    const measurement=one(g,['측정·데이터'],'측정값');
    const theoryLimit=one(g,['이론 한계'],'모형의 한계');
    return [
      `“${law}”을 설명할 때는 현상 이름만 쓰지 말고 변수·단위·방향·조건을 함께 적는다. “${experiment}”은 법칙을 시험하는 절차이고 “${measurement}”은 관측된 자료다. 법칙·실험·관측값을 구분하면 무엇이 이론이고 무엇이 증거인지 명확해진다.`,
      formula?`모형은 “${formula}”이다. 풀이 순서는 ① 각 기호의 정의와 단위 ② 주어진 값의 단위 통일 ③ 가정·경계조건 확인 ④ 값 대입과 계산 ⑤ 결과의 물리적 크기와 방향 검토 ⑥ “${theoryLimit}” 확인이다. 숫자가 나왔다고 끝나는 것이 아니라 결과가 현실적으로 가능한지까지 검산해야 한다.`:`핵심 설명은 “${thesis}”이다. 이 설명은 측정과 실험으로 검증되어야 하며 ${limit}에는 다른 모형이 필요할 수 있다.`,
      `사례는 ${route} 순으로 분석한다. 무엇을 측정할지 정하고 “${law}”으로 예측값을 만든 뒤 “${experiment}”에서 얻은 “${measurement}”와 비교한다. 차이가 나면 측정오차·모형의 단순화·경쟁가설을 분리해 검토한다.`,
      `대표문헌 “${source}”의 결론을 그대로 외우지 말고 어떤 실험과 조건에서 얻어진 결과인지 본다. 가능한 반론은 “${counter}”이며, 특히 “${theoryLimit}”이 현재 사례에 해당하는지를 확인해야 한다.`
    ];
  }
  if(k==='engineering'){
    const req=one(g,['요구조건'],'측정 가능한 요구조건');
    const model=one(g,['모델링'],'설계 모델');
    const verification=one(g,['검증'],'검증 기준');
    const failure=one(g,['고장모드'],'대표 고장모드');
    const safety=one(g,['안전·규격'],'안전 기준');
    return [
      `“${req}”은 무엇을 만족해야 하는지, “${model}”은 설계대안을 어떻게 예측할지, “${verification}”은 결과가 요구조건을 충족했는지 판단하는 기준이다. 이 세 가지를 분리해 쓰면 설계 목표·계산·검증이 뒤섞이지 않는다.`,
      formula?`계산·모형은 “${formula}”이다. 입력값·단위·하중조건·경계조건을 먼저 명시하고 계산한 뒤 설계여유를 확인한다. 계산값 하나만 맞추는 것이 아니라 요구조건과 안전계수를 만족하는지, 입력값이 바뀌면 결과가 얼마나 민감한지도 검토한다.`:`핵심 설명은 “${thesis}”이다. 설계가 유효하려면 요구조건과 환경조건이 모델의 가정 안에 있어야 하며 ${limit}에는 재설계가 필요하다.`,
      `프로젝트 사례는 ${route} 순으로 푼다. “${req}”을 수치화하고 “${model}”로 대안을 비교한 뒤 “${verification}”으로 시험한다. 이어 “${failure}”가 발생할 때의 영향과 검출방법을 쓰고 “${safety}”에 맞춘 완화책을 제시한다.`,
      `대표문헌·규격 “${source}”를 읽을 때는 적용범위와 시험조건을 확인한다. 가능한 반론은 “${counter}”이다. 따라서 정상작동뿐 아니라 극한조건·고장모드·잔여위험까지 설명해야 완결된 답안이 된다.`
    ];
  }
  if(k==='philosophy'){
    const primary=one(g,['원전'],'대표 원전');
    const thesisItem=one(g,['핵심명제'],title);
    const argument=one(g,['논증'],'핵심 논증');
    const rival=one(g,['대립학설'],'대립학설');
    const objection=one(g,['반론'],'대표 반론');
    return [
      `“${thesisItem}”은 결론이고 “${argument}”은 그 결론으로 가는 이유다. “${rival}”은 다른 출발점에서 경쟁하는 설명이다. 답안에서는 명제와 근거를 분리하고 전제 → 추론 → 결론의 순서를 재구성한다.`,
      `핵심 설명은 “${thesis}”이다. 숨은 전제가 무엇인지 한 문장으로 적고 그 전제가 거부될 때 결론이 유지되는지 확인한다. ${limit}에는 논증을 수정하거나 결론의 범위를 좁혀야 한다.`,
      `현대 사례에는 ${route} 순서를 적용한다. 먼저 사례가 던지는 철학적 질문을 특정하고 “${thesisItem}”의 논증을 적용한 뒤 “${rival}”이 같은 사례를 어떻게 다르게 설명하는지 비교한다. 마지막에는 어느 입장이 더 강한지 근거를 적는다.`,
      `원전 “${primary||source}”을 읽은 뒤 가능한 반론 “${objection||counter}”을 가장 강한 형태로 제시한다. 좋은 답안은 상대 입장을 약하게 만들어 반박하지 않고, 그 반론이 원래 논증의 어느 전제를 공격하는지와 재반론 가능성까지 보여준다.`
    ];
  }
  if(k==='social'){
    const theory=one(g,['이론'],'핵심 이론');
    const variable=one(g,['개념·변수'],'핵심 변수');
    const design=one(g,['연구설계'],'연구설계');
    const study=one(g,['경험연구'],'경험연구');
    const rival=one(g,['경쟁설명'],'경쟁설명');
    return [
      `“${theory}”을 연구하려면 추상개념을 “${variable}”처럼 관찰 가능한 변수로 바꿔야 한다. 이론은 설명틀, 변수는 측정대상, “${design}”은 인과관계를 식별하기 위한 절차다. 세 층위를 구별해 답한다.`,
      `핵심 설명은 “${thesis}”이다. 이를 검증하려면 변수의 조작적 정의·표본·측정도구와 식별전략이 필요하다. ${limit}에는 관찰된 관계를 인과관계라고 단정할 수 없다.`,
      `사례는 ${route} 순으로 분석한다. “${theory}”에서 가설을 만들고 “${variable}”을 측정한 뒤 “${design}”으로 경쟁설명을 통제한다. 결과는 “${study}”와 비교하되 “${rival}”이 같은 결과를 설명할 가능성도 검토한다.`,
      `대표연구 “${study||source}”의 표본·측정·식별전략·외적타당도를 확인한다. 가능한 반론은 “${counter}”이다. 통계적으로 유의한 관계와 사회적으로 중요한 효과도 구분해야 한다.`
    ];
  }
  if(k==='theology'){
    const text=one(g,['본문·사료'],'대표 본문');
    const original=one(g,['원어·핵심용어'],'핵심 원어');
    const context=one(g,['역사적 맥락'],'역사적 맥락');
    const criticism=one(g,['본문·자료비평'],'자료비평');
    const doctrine=one(g,['교리·신학'],'교리적 해석');
    const rival=one(g,['대립해석'],'대립해석');
    return [
      `“${text}”는 해석의 출발자료이고 “${original}”은 번역에서 놓칠 수 있는 의미범위를 확인하는 도구다. “${context}”는 본문이 처음 놓였던 역사적 조건이다. 답안은 본문이 직접 말하는 내용과 후대의 “${doctrine}”을 먼저 구분한다.`,
      `핵심 설명은 “${thesis}”이다. 해석이 성립하려면 문법·문맥·전승자료와 역사적 맥락이 이를 지지해야 한다. ${limit}에는 교리적 결론을 본문 자체의 직접 진술처럼 제시하면 안 된다.`,
      `사례·본문 적용은 ${route} 순서로 한다. 먼저 “${text}”의 문맥을 읽고 “${original}”과 “${criticism}”을 확인한 뒤 역사적 의미와 신학적 함의를 분리한다. 그 다음 “${rival}”이 같은 자료를 어떻게 읽는지 비교한다.`,
      `대표자료 “${source}”를 사용할 때는 원문 위치·번역·시대층을 확인한다. 가능한 반론은 “${counter}”이다. 좋은 답안은 신앙고백과 역사적·문헌학적 주장 사이의 근거유형을 구별한다.`
    ];
  }
  if(k==='humanities'){
    const primary=one(g,['원전·대표텍스트'],'대표 원전');
    const sourceItem=one(g,['사료·자료'],'사료·자료');
    const context=one(g,['맥락'],'역사·문화적 맥락');
    const method=one(g,['해석방법'],'해석방법');
    const debate=one(g,['경쟁해석·논쟁'],'경쟁해석');
    return [
      `“${primary}”와 “${sourceItem}”을 읽을 때 내용만 요약하지 말고 누가·언제·왜·어떤 장르로 만들었는지를 먼저 확인한다. “${context}”는 자료의 의미범위를 정하는 배경이고 “${method}”는 그 자료를 해석하는 절차다.`,
      `핵심 설명은 “${thesis}”이다. 이 해석은 자료의 작성조건과 전승상태가 뒷받침할 때 설득력이 있다. ${limit}에는 결론을 좁히거나 다른 자료와 교차검증해야 한다.`,
      `사례는 ${route} 순으로 분석한다. 원자료의 성격을 확인하고 “${context}”에 놓은 뒤 “${method}”로 읽는다. 이후 “${debate}”와 비교하여 같은 자료에서 왜 다른 해석이 가능한지 설명한다.`,
      `대표 원전 “${primary||source}”의 직접 진술과 연구자의 해석을 구별한다. 가능한 반론은 “${counter}”이다. 독립 사료가 같은 사실을 확인하는지, 침묵하거나 충돌하는 자료가 있는지도 답안에 포함한다.`
    ];
  }
  if(k==='arts'){
    const form=one(g,['형식·구조'],'형식·구조');
    const work=one(g,['대표작품·사례'],'대표작품');
    const technique=one(g,['기법'],'기법');
    const context=one(g,['사조·맥락'],'사조·맥락');
    const critique=one(g,['비평기준'],'비평기준');
    const revision=one(g,['수정'],'수정 방향');
    return [
      `“${form}”은 작품이 어떻게 조직되는지, “${technique}”은 그것을 실제로 구현하는 방법, “${context}”는 작품이 놓인 역사·문화적 조건이다. 답안은 취향평가보다 관찰 가능한 형식과 제작 선택을 먼저 설명한다.`,
      `핵심 설명은 “${thesis}”이다. 작품분석에서는 어떤 형식적 선택이 어떤 효과를 만드는지 근거를 제시한다. ${limit}에는 하나의 미학적 기준을 모든 작품에 보편적으로 적용하지 않는다.`,
      `“${work}” 또는 실습 결과는 ${route} 순으로 분석한다. 형식과 기법을 구체적으로 지적하고 맥락과 연결한 뒤 “${critique}”로 장점·문제를 평가하고 “${revision}”처럼 수정방향을 제시한다.`,
      `대표작품·문헌 “${source}”를 볼 때 작품 자체의 관찰과 해석자의 평가를 구분한다. 가능한 반론은 “${counter}”이다. 좋은 비평은 평가어만 쓰지 않고 어떤 요소가 왜 효과적이거나 문제인지 증거를 제시한다.`
    ];
  }
  if(k==='economics'){
    const model=one(g,['모형·회계·의사결정'],'핵심 모형');
    const method=one(g,['분석방법'],'분석방법');
    const data=one(g,['자료·변수'],'자료·변수');
    const decision=one(g,['의사결정'],'의사결정 기준');
    return [
      `“${model}”은 현실을 단순화한 관계이고 “${data}”는 그 모형에 넣거나 검증하는 관측자료다. “${method}”은 계산·추정 절차다. 답안에서는 가정과 자료를 분리한 뒤 어떤 조건에서 의사결정 “${decision}”으로 이어지는지 설명한다.`,
      formula?`제시된 관계는 “${formula}”이다. 계산 전에 기준시점·단위·명목/실질 여부와 가정을 확인하고, 계산 뒤에는 입력값이 변할 때 결과가 어떻게 바뀌는지 민감도를 본다. 결과값 하나만 제시하지 말고 그 값이 어떤 의사결정을 지지하는지와 불확실성을 함께 적는다.`:`핵심 설명은 “${thesis}”이다. ${limit}에는 결론이 달라질 수 있으므로 대안가정과 시나리오를 비교한다.`,
      `사례는 ${route} 순으로 푼다. “${model}”의 가정과 “${data}”의 출처를 확인한 뒤 “${method}”으로 계산·추정하고, 최소한 하나의 대안 시나리오와 민감도 분석을 거쳐 “${decision}”의 근거를 제시한다.`,
      `대표문헌 “${source}”의 모형가정과 자료범위를 먼저 확인한다. 가능한 반론은 “${counter}”이다. 효율성·수익성 판단과 분배효과·위험 판단은 같은 질문이 아니므로 구분한다.`
    ];
  }
  if(k==='architecture'){
    const site=one(g,['대지·맥락'],'대지·맥락');
    const structure=one(g,['구조·구축'],'구조·구축');
    const environment=one(g,['환경·성능'],'환경·성능');
    const regulation=one(g,['법규·안전'],'법규·안전');
    const method=one(g,['설계·검증방법'],'설계·검증방법');
    const critique=one(g,['비평·수정기준'],'비평·수정기준');
    return [
      `“${site}”는 설계조건, “${structure}”는 물리적 실현방식, “${environment}”은 성능, “${regulation}”은 최소한의 법적·안전 제약이다. 네 요소를 분리해 설명한 뒤 하나의 공간결정에서 어떻게 동시에 작동하는지 연결한다.`,
      `핵심 설명은 “${thesis}”이다. 설계안은 형태가 좋아 보이는지만으로 평가하지 않고 “${method}”으로 구조·환경·동선·접근성·법규를 검증해야 한다. ${limit}에는 대안을 다시 비교한다.`,
      `프로젝트는 ${route} 순으로 푼다. “${site}”에서 요구를 추출하고 프로그램을 만들며 “${structure}”와 “${environment}”을 통합한다. “${regulation}”을 충족하는지 확인한 뒤 “${critique}”를 근거로 수정안을 제시한다.`,
      `대표문헌 “${source}”과 사례를 볼 때 형태를 복제하지 말고 어떤 대지·사용자·기술 조건에 대한 해법이었는지 읽는다. 가능한 반론은 “${counter}”이다.`
    ];
  }
  if(k==='education'){
    const theory=one(g,['학습이론'],'학습이론');
    const design=one(g,['교수설계'],'교수설계');
    const assessment=one(g,['평가·피드백'],'평가·피드백');
    const data=one(g,['학습데이터'],'학습데이터');
    const revision=one(g,['재설계'],'재설계');
    return [
      `“${theory}”은 학습이 일어나는 원리를 설명하고 “${design}”은 그 원리를 수업활동으로 구현하는 방식이다. “${assessment}”은 실제 학습이 일어났는지 확인한다. 설명이론·수업방법·평가도구를 구별해 답한다.`,
      `핵심 설명은 “${thesis}”이다. 목표와 활동과 평가가 서로 같은 학습성과를 겨냥해야 한다. ${limit}에는 즉시 점수 상승을 장기학습으로 오인할 수 있으므로 지연평가와 전이과제를 함께 본다.`,
      `사례는 ${route} 순으로 분석한다. 학습목표와 선수지식을 진단하고 “${design}”을 적용한 뒤 “${assessment}”으로 결과를 확인한다. “${data}”에서 오개념과 실패지점을 찾아 “${revision}”으로 다시 설계한다.`,
      `대표문헌 “${source}”의 학습자·과제·측정조건을 확인한다. 가능한 반론은 “${counter}”이다. 특정 교육효과가 모든 연령·과목·환경에 그대로 전이된다고 가정하지 않는다.`
    ];
  }
  if(k==='interdisciplinary'){
    const lens=one(g,['전문분야 렌즈'],'전문분야 렌즈');
    const evidence=one(g,['증거·자료'],'증거·자료');
    const risk=one(g,['위험·실패경로'],'위험·실패경로');
    const governance=one(g,['법·거버넌스'],'법·거버넌스');
    const capstone=one(g,['Capstone 산출물'],'통합 산출물');
    return [
      `“${lens}”은 문제를 보는 하나의 관점이고 “${evidence}”는 그 관점의 주장을 뒷받침하는 자료다. “${risk}”와 “${governance}”는 기술적 사실과 별개의 위험·규범 판단층이다. 서로 다른 분야의 결론을 같은 종류의 증거처럼 섞지 않는다.`,
      `핵심 설명은 “${thesis}”이다. 각 분야의 전제와 증거수준을 따로 적고 서로 충돌하는 지점을 표시한다. ${limit}에는 통합결론이 과도하게 단순화될 수 있으므로 불확실성과 잔여갈등을 남겨야 한다.`,
      `복합사례는 ${route} 순으로 푼다. 문제경계를 정하고 이해관계자를 식별한 뒤 “${lens}”별로 “${evidence}”를 정리한다. 이후 “${risk}”와 “${governance}”를 비교하여 대안을 설계하고 남는 위험을 명시한다.`,
      `최종 산출물 “${capstone}”에는 한 분야의 정답이 아니라 분야별 증거·가치충돌·trade-off가 보여야 한다. 가능한 반론은 “${counter}”이다. 어떤 대안을 선택하더라도 누가 어떤 비용과 위험을 부담하는지를 적는다.`
    ];
  }

  return [
    `핵심 개념은 “${cs}”이다. 각각을 한 문장으로 정의한 뒤 서로 무엇이 같고 무엇이 다른지 비교하고, 이 Lesson의 중심 설명 “${thesis}”과 연결한다. 개념 이름만 나열하지 말고 각 개념이 무엇을 설명하는지 적는다.`,
    formula?`제시된 공식·모형은 “${formula}”이다. 각 항의 의미와 관계를 확인하고 적용조건을 먼저 적은 뒤 작은 예를 만들어 계산·논리관계를 확인한다. 마지막에 ${limit}를 한계로 적는다.`:`핵심 명제는 “${thesis}”이다. 전제는 현재 사례가 이 설명의 적용범위에 들어온다는 것이고, ${limit}에는 결론을 수정하거나 범위를 좁혀야 한다.`,
    `사례 “${caseText||title}”은 ${(paths[k]||paths.core).join(' → ')} 순으로 푼다. 먼저 문제를 분해하고 관련 개념을 선택한 뒤 근거를 연결하고 누락된 변수를 확인한다. 결론은 한 문장으로 제시하되 어떤 조건에서 달라질 수 있는지도 적는다.`,
    `대표문헌 “${source}”의 핵심 주장과 근거를 구분하고 가능한 반론 “${counter}”을 제시한다. 반론이 원래 설명의 어느 전제를 공격하는지 쓰고, 원래 입장이 어떻게 답할 수 있는지까지 정리한다.`
  ];
}

const whyTexts=[
  '정의형 문제는 용어를 외우는 데서 끝나지 않고 개념 사이의 경계와 관계를 설명해야 실제 이해가 생깁니다.',
  '공식·명제형 문제는 정답값보다 적용조건과 한계를 먼저 확인해야 다른 사례에서도 스스로 사용할 수 있습니다.',
  '사례형 문제는 결론을 맞히는 것보다 어떤 순서로 사실과 근거를 연결하는지를 익히는 것이 핵심입니다.',
  '비판형 문제는 반대의견을 단순히 부정하지 않고 가장 강한 반론을 재구성해야 자신의 이해도 함께 검증됩니다.'
];

function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function enhanceLessons(){
  const lessonEls=[...document.querySelectorAll('.lesson')];
  lessonEls.forEach((lessonEl,index)=>{
    const data=rich.lessons[index];
    if(!data)return;
    const section=[...lessonEl.querySelectorAll('.lesson-section')].find(s=>s.querySelector('h3')?.textContent.includes('확인·연습'));
    if(!section||section.querySelector('.guided-practice-grid'))return;
    const h=section.querySelector('h3');
    if(h)h.textContent='확인·연습 · 모범답안과 풀이';
    const exercise=section.querySelector('.exercise');
    const questions=[...(exercise?.querySelectorAll('li')||[])].map(x=>x.textContent.trim());
    const intro=el('p','guided-practice-intro','문제를 먼저 읽고 스스로 생각한 뒤, 바로 아래 모범답안과 풀이 과정을 비교해 보세요. 처음 접하는 전공이라면 해설을 먼저 읽고 문제를 다시 보는 방식으로 학습해도 됩니다.');
    const grid=el('div','guided-practice-grid');
    const answers=answersFor(data);
    answers.slice(0,4).forEach((answer,i)=>{
      const card=el('article','guided-answer');
      const head=el('div','guided-answer-head');
      head.append(el('span','guided-answer-no',String(i+1)),el('strong','',`${i+1}번 모범답안 · 풀이`));
      card.append(head);
      if(questions[i])card.append(el('p','guided-question',`문제: ${questions[i]}`));
      card.append(el('p','guided-answer-text',answer));
      const why=el('p','guided-why');
      const label=el('strong','', '왜 이렇게 푸는가: ');
      why.append(label,document.createTextNode(whyTexts[i]||whyTexts[0]));
      card.append(why);
      grid.append(card);
    });
    const path=el('div','guided-domain-path');
    (paths[k]||paths.core).forEach(step=>path.append(el('span','',step)));
    section.append(intro,grid,path);
  });

  document.querySelectorAll('.tutor-box p').forEach(p=>{
    p.textContent='위 모범답안과 풀이를 먼저 읽은 뒤 AI Tutor에서는 같은 개념을 다른 사례에 적용하고, 전제·오류·반론을 추가로 점검합니다.';
    p.classList.add('guided-tutor-note');
  });
}

const assessmentStructures={
  core:['핵심개념을 정의하고 서로 구별한다.','대표 근거·문헌을 사용해 핵심명제를 재구성한다.','처음 보는 사례에 적용한 뒤 반론과 한계를 적는다.'],
  law:['사실관계와 쟁점을 분리한다.','조문·판례·법리를 특정하고 요건별로 포섭한다.','가장 강한 반대논증과 구제수단까지 제시한다.'],
  ai:['입력·출력·목적함수 또는 평가척도를 정의한다.','알고리즘·데이터·시스템 구조와 실험설정을 연결한다.','실패모드·보안·일반화 한계를 포함해 결론을 평가한다.'],
  philosophy:['원전의 문제설정과 핵심명제를 재구성한다.','전제→추론→결론을 논증지도처럼 배열한다.','대립학설을 steelman한 뒤 반론과 재반론을 쓴다.'],
  social:['이론을 변수와 관찰지표로 바꾼다.','자료·표본·측정·식별전략을 제시한다.','경쟁설명·외적타당도·윤리적 한계를 검토한다.'],
  natural:['변수·단위·가정·경계조건을 먼저 쓴다.','법칙·모형으로 예측하고 관측자료와 비교한다.','오차·모형한계·경쟁가설을 분리한다.'],
  engineering:['요구조건을 측정 가능하게 정의한다.','모델·계산·시뮬레이션으로 설계대안을 비교한다.','검증·FMEA·안전대책과 잔여위험을 적는다.'],
  medicine:['정상 구조·생리에서 병태생리로 이어지는 기전을 설명한다.','문제목록·위험신호·감별진단·검사의 역할을 순서대로 제시한다.','치료원리·근거수준·불확실성·환자안전을 함께 쓴다.'],
  theology:['본문·원어·문맥과 역사적 층위를 확인한다.','본문이 직접 말하는 범위와 교리적 해석을 구별한다.','대립해석의 근거를 비교하고 결론의 범위를 명시한다.'],
  humanities:['원자료의 작성자·시기·목적·장르를 식별한다.','사료를 교차검증하고 해석방법을 적용한다.','경쟁해석과 자료의 침묵·편향·한계를 평가한다.'],
  arts:['작품의 형식·재료·기법을 구체적으로 관찰한다.','역사·사회적 맥락과 제작선택을 연결한다.','비평기준으로 평가하고 수정 전후의 근거를 제시한다.'],
  economics:['가정·변수·기준시점·단위를 명시한다.','모형과 자료로 계산·추정하고 시나리오를 비교한다.','민감도·위험·분배효과를 포함해 의사결론을 적는다.'],
  architecture:['대지·사용자·프로그램 요구를 설계조건으로 바꾼다.','공간·구조·환경·법규를 통합한 대안을 제시한다.','성능검증과 비평을 근거로 수정안을 만든다.'],
  education:['학습목표와 선수지식을 진단한다.','목표-활동-평가를 정렬하고 피드백을 설계한다.','학습데이터로 오개념을 확인해 재설계한다.'],
  interdisciplinary:['문제경계와 이해관계자를 먼저 정의한다.','분야별 증거와 불확실성을 분리해 시스템맵으로 연결한다.','가치충돌·법·위험·대안·잔여위험을 함께 제시한다.']
};
function enhanceAssessment(){
  const finalSection=[...document.querySelectorAll('section')].find(s=>s.querySelector('.section-head h2')?.textContent.includes('Final Assessment'));
  if(!finalSection||finalSection.querySelector('.assessment-guide'))return;
  const cards=finalSection.querySelector('.textbook-assessment');
  if(cards){
    const guide=el('div','assessment-guide');
    guide.append(el('h3','', '평가문항 풀이 방법 · 먼저 읽는 답안 구조'));
    guide.append(el('p','',`${course.title}의 평가는 처음부터 정답을 알고 있어야 풀 수 있는 시험이 아니라, 아래 답안구조를 반복해 전공의 사고방식을 익히는 학습과정입니다.`));
    const ol=el('ol');
    (assessmentStructures[k]||assessmentStructures.core).forEach(x=>ol.append(el('li','',x)));
    guide.append(ol);
    cards.after(guide);
  }
  const cap=[...finalSection.querySelectorAll('.assessment')].find(x=>x.querySelector('h3')?.textContent.includes('Capstone'));
  if(cap&&!cap.querySelector('.capstone-worked-example')){
    const box=el('div','capstone-worked-example');
    const route=(paths[k]||paths.core).join(' → ');
    box.append(el('strong','', 'Capstone 예시 구성: '),document.createTextNode(`${route}. 먼저 문제와 범위를 정하고, 각 단계에서 사용한 근거를 표시한 뒤 반론·한계와 잠정결론을 별도 문단으로 작성합니다. 완성된 답안은 결론보다 “왜 그 결론에 도달했는가”가 추적 가능해야 합니다.`));
    cap.append(box);
  }
}

enhanceLessons();
enhanceAssessment();
window.NEXUS_GUIDED_PRACTICE={course:id,lessons:document.querySelectorAll('.guided-practice-grid').length,domain:k,version:'2026.08.20-1'};
})();
