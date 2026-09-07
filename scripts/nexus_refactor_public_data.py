from pathlib import Path
import re


def replace_once(path: str, pattern: re.Pattern[str], replacement: str, label: str) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    updated, count = pattern.subn(lambda _: replacement, text, count=1)
    if count != 1:
        raise SystemExit(f"{label} replacement count={count}")
    file_path.write_text(updated, encoding="utf-8")


BRIEFING_REPLACEMENT = """function kstForecastBase(){const now=new Date();const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);const get=t=>Number(parts.find(x=>x.type===t)?.value||0);const y=get('year'),m=get('month'),d=get('day'),hour=get('hour'),minute=get('minute');const baseHours=[2,5,8,11,14,17,20,23];const available=baseHours.filter(h=>hour>h||(hour===h&&minute>=15));if(available.length)return{date:`${y}${String(m).padStart(2,'0')}${String(d).padStart(2,'0')}`,time:`${String(available.at(-1)).padStart(2,'0')}00`};const previous=new Date(Date.UTC(y,m-1,d-1,12));const p=seoulParts(previous);return{date:`${p.year}${p.month}${p.day}`,time:'2300'}}
async function loadPublicData(){const cards=$('publicDataCards'),meta=$('publicDataMeta');if(!cards||!meta)return;await import('/shared/nexus-live-data-renderers.js?v=20260907');const base=kstForecastBase();await window.NexusLiveData.briefingWeatherAir({cards,meta,weatherParams:{base_date:base.date,base_time:base.time,nx:'60',ny:'127',numOfRows:'60'},airParams:{sidoName:'서울',numOfRows:'10'}})}
async function load()"""

INVESTMENT_REPLACEMENT = """(()=>{
  const host=document.getElementById('aptLiveGrid');
  const meta=document.getElementById('aptLiveMeta');
  if(!host||!meta)return;
  function previousMonth(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit'}).formatToParts(new Date());let y=Number(parts.find(x=>x.type==='year')?.value||0),m=Number(parts.find(x=>x.type==='month')?.value||1)-1;if(m===0){m=12;y--}return{query:`${y}${String(m).padStart(2,'0')}`,label:`${y}년 ${m}월`}}
  async function load(){const target=previousMonth();await import('/shared/nexus-live-data-renderers.js?v=20260907');return window.NexusLiveData.apartmentTrades({host,meta,params:{LAWD_CD:'11680',DEAL_YMD:target.query,numOfRows:'20'},label:target.label,limit:6})}
  load().catch(error=>{console.error('Apartment trade live data load failed:',error);host.replaceChildren();const card=document.createElement('article');card.className='card';const h3=document.createElement('h3');h3.textContent='실거래 데이터를 불러오지 못했습니다.';const p=document.createElement('p');p.textContent='기존 투자전략 자료는 그대로 유지되며 다음 자동 갱신에서 공통 데이터 계층을 다시 조회합니다.';const span=document.createElement('span');span.className='meta';span.textContent='API 확인 필요';card.append(h3,p,span);host.append(card);meta.textContent='국토교통부 실거래 API 응답을 확인하지 못했습니다.'});
})();"""

replace_once(
    "nexus/intelligence-briefing/index.html",
    re.compile(r"async function publicApi\(source,params\)\{.*?\nasync function load\(\)", re.S),
    BRIEFING_REPLACEMENT,
    "intelligence briefing",
)

replace_once(
    "nexus/investment-strategy/index.html",
    re.compile(r"\(\(\)=>\{\n  const host=document\.getElementById\('aptLiveGrid'\);.*?\n\}\)\(\);", re.S),
    INVESTMENT_REPLACEMENT,
    "investment strategy",
)

checks = {
    "nexus/intelligence-briefing/index.html": {
        "forbidden": ["function weatherItems", "async function publicApi"],
        "required": ["NexusLiveData.briefingWeatherAir"],
    },
    "nexus/investment-strategy/index.html": {
        "forbidden": ["new DOMParser"],
        "required": ["NexusLiveData.apartmentTrades"],
    },
}

for path, rules in checks.items():
    text = Path(path).read_text(encoding="utf-8")
    for marker in rules["forbidden"]:
        if marker in text:
            raise SystemExit(f"forbidden marker remains in {path}: {marker}")
    for marker in rules["required"]:
        if marker not in text:
            raise SystemExit(f"required marker missing in {path}: {marker}")

print("NEXUS page-owned public-data transforms were replaced with the shared layer.")
