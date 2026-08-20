(()=>{'use strict';
const id=new URLSearchParams(location.search).get('id');
const law=window.NEXUS_LAW_TEXTBOOKS||{};const ai=window.NEXUS_AI_TEXTBOOKS||{};const philosophy=window.NEXUS_PHILOSOPHY_TEXTBOOKS||{};const social=window.NEXUS_SOCIAL_TEXTBOOKS||{};const natural=window.NEXUS_NATURAL_TEXTBOOKS||{};const engineering=window.NEXUS_ENGINEERING_TEXTBOOKS||{};const medicine=window.NEXUS_MEDICINE_TEXTBOOKS||{};const integrity=window.NEXUS_TEXTBOOK_INTEGRITY;
const kind=law[id]?'law':ai[id]?'ai':philosophy[id]?'philosophy':social[id]?'social':natural[id]?'natural':engineering[id]?'engineering':medicine[id]?'medicine':null;if(!kind)return;
const configs={
 law:{badge:'LAW TEXTBOOK 2.0',note:'이 과목은 일반 자동강의가 아니라 과목별 조문·법리·학설·판례·비교법·사례 포섭을 직접 구성한 법학 전공 교재입니다.',theory:'조문·법리·학설·판례·비교법',case:'사례 포섭',read:'대표 원전·판례·문헌'},
 ai:{badge:'AI TEXTBOOK 2.0',note:'이 과목은 일반 자동강의가 아니라 과목별 알고리즘·수학모형·시스템 구조·대표논문·실험·실패모드를 직접 구성한 컴퓨팅·AI 전공 교재입니다.',theory:'알고리즘·시스템·대표논문·실패모드',case:'실험·기술사례·실패 재현',read:'대표논문·표준문헌'},
 philosophy:{badge:'PHILOSOPHY TEXTBOOK 2.0',note:'이 과목은 사상가 소개나 요약이 아니라 원전의 문제설정에서 핵심명제와 논증을 재구성하고, 대립학설·반론을 검토한 뒤 현대 문제에 적용하는 철학 전공 교재입니다.',theory:'원전·핵심명제·논증·대립학설·반론',case:'현대 적용',read:'대표 원전·주석·문헌'},
 social:{badge:'SOCIAL SCIENCE TEXTBOOK 2.0',note:'이 과목은 이론 소개에 머물지 않고 개념화·변수·연구설계·자료·인과추론·대표 경험연구·경쟁설명을 직접 연결하는 사회과학 전공 교재입니다.',theory:'이론·개념화·변수·연구설계·경험연구·경쟁설명',case:'자료·사례 적용',read:'대표 연구·데이터·문헌'},
 natural:{badge:'NATURAL SCIENCE TEXTBOOK 2.0',note:'이 과목은 법칙과 공식을 나열하지 않고 법칙→수학모형→실험→측정→데이터→오차→이론의 한계 순서로 검증하는 자연과학 전공 교재입니다.',theory:'법칙·실험·측정·데이터·오차·이론 한계',case:'실험·데이터 분석',read:'표준교재·실험·대표문헌'},
 engineering:{badge:'ENGINEERING TEXTBOOK 2.0',note:'이 과목은 요구조건→모델링→설계→계산→시뮬레이션→제작·구현→검증→고장모드→안전의 전체 공학 사이클을 직접 다루는 전공 교재입니다.',theory:'요구조건·모델링·시뮬레이션·제작·검증·고장모드·안전',case:'설계·검증 프로젝트',read:'표준교재·규격·설계문헌'},
 medicine:{badge:'MEDICINE TEXTBOOK 2.0',note:'이 과목은 정상구조→생리→병태생리→진단→감별→치료원리→근거수준→환자안전 순서로 임상추론을 훈련하는 의학·보건 전공 교재입니다. 실제 진료지시가 아닌 교육용 과정입니다.',theory:'정상구조·생리·병태생리·진단·감별·치료원리·근거수준·환자안전',case:'교육용 임상사례',read:'표준교재·가이드라인·근거문헌'}
};
const text=configs[kind];
const badges=[...document.querySelectorAll('.course-kicker .badge')];if(badges.length)badges[badges.length-1].textContent=text.badge;
document.querySelectorAll('.course-meta span').forEach(el=>{if(el.textContent.trim()==='TEXTBOOK CORE')el.textContent=text.badge;});
const note=document.querySelector('.textbook-note');if(note)note.textContent=text.note;
document.querySelectorAll('.lesson-section h3').forEach(h=>{const t=h.textContent.trim();if(t==='핵심 이론·학설·개념')h.textContent=text.theory;else if(t==='사례')h.textContent=text.case;else if(t==='대표 원전·문헌')h.textContent=text.read;else if(t==='공식·모형'&&(kind==='ai'||kind==='natural'||kind==='engineering'))h.textContent=kind==='natural'?'수학모형·공식':kind==='engineering'?'설계계산·공식':'수학모형·공식';});
const overviewTag=document.querySelector('.section-head span');if(overviewTag&&overviewTag.textContent.includes('TEXTBOOK'))overviewTag.textContent=text.badge;
if(integrity&&!integrity.ok){const host=document.querySelector('.course-hero-box');if(host){const warn=document.createElement('div');warn.className='textbook-note';warn.style.borderColor='rgba(239,120,120,.4)';warn.style.color='#f3b7b7';warn.textContent=`교재 데이터 점검 필요: ${integrity.invalid.slice(0,3).join(' / ')}${integrity.invalid.length>3?' 외':''}`;host.append(warn);}}
})();