(()=>{
const data=window.COUNCIL_MEMBERS_2026;
if(!data)return;
const style=document.createElement('style');
style.textContent=`
.council-db{display:grid;gap:5px}.council-region,.council-unit{border:1px solid #d9dee5;border-radius:8px;background:#fff;overflow:hidden}.council-region>summary,.council-unit>summary{cursor:pointer;list-style:none;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center;padding:7px 8px;font-size:.68rem;font-weight:900;line-height:1.3}.council-region>summary::-webkit-details-marker,.council-unit>summary::-webkit-details-marker{display:none}.council-region>summary span,.council-unit>summary span{font-size:.59rem;color:#667085;text-align:right;overflow-wrap:anywhere}.council-region[open]>summary,.council-unit[open]>summary{background:#f6f8fa;border-bottom:1px solid #e4e7eb}.council-region-body{padding:5px;display:grid;gap:5px}.council-type-title{display:flex;justify-content:space-between;gap:6px;align-items:center;padding:4px 2px;font-size:.66rem;font-weight:900}.council-local-list{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.council-unit-body{padding:5px}.district-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.district-card{padding:5px;border:1px solid #e2e5e9;border-radius:7px;background:#fff;min-width:0}.district-card strong{display:block;margin-bottom:3px;font-size:.62rem;line-height:1.25}.member-list{display:flex;flex-wrap:wrap;gap:2px}.member-chip{padding:3px 4px;border-radius:5px;background:#f4f6f8;font-size:.59rem;line-height:1.2;white-space:normal}.member-chip b{font-size:.61rem}.council-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-bottom:6px}.council-stats span{padding:6px;border:1px solid #e0e3e8;border-radius:7px;font-size:.62rem;line-height:1.3}.council-stats b{display:block;font-size:.75rem}.council-source{margin-top:5px;font-size:.61rem;color:#667085;line-height:1.35}.council-empty{padding:8px;background:#f6f8fa;border-radius:7px;font-size:.66rem}
@media(max-width:900px){.district-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.council-local-list{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.council-stats,.district-grid,.council-local-list{grid-template-columns:repeat(2,minmax(0,1fr))}.council-region>summary,.council-unit>summary{grid-template-columns:minmax(0,1fr);gap:2px}.council-region>summary span,.council-unit>summary span{text-align:left}}
`;
document.head.append(style);
const partyShort={
'더불어민주당':'민','국민의힘':'국','조국혁신당':'혁','개혁신당':'개','진보당':'진','정의당':'정','기본소득당':'기','사회민주당':'사','무소속':'무','자유와혁신':'자','새미래민주당':'새','녹색당':'녹','노동당':'노'
};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const countDistricts=d=>Object.values(d||{}).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);
function districtHtml(districts){
 const entries=Object.entries(districts||{});
 if(!entries.length)return '<div class="council-empty">등록된 의원 데이터가 없습니다.</div>';
 return `<div class="district-grid">${entries.map(([district,members])=>`<div class="district-card"><strong>${esc(district)}</strong><div class="member-list">${members.map(m=>`<span class="member-chip" title="${esc(m.party)}"><b>${esc(m.name)}</b> · ${esc(partyShort[m.party]||m.party||'')}</span>`).join('')}</div></div>`).join('')}</div>`;
}
function localUnitHtml(name,unit){
 const cnt=countDistricts(unit.districts);
 return `<details class="council-unit"><summary><strong>${esc(unit.council||name+'의회')}</strong><span>${cnt}명 · ${Object.keys(unit.districts||{}).length}개 선거구</span></summary><div class="council-unit-body">${districtHtml(unit.districts)}</div></details>`;
}
const section=document.createElement('section');section.className='section';section.id='council-members-db';
const counts=data.counts||{metro:0,local:0,total:0};
section.innerHTML=`<div class="section-head"><p class="eyebrow">03 · ELECTED COUNCIL MEMBERS</p><h2>지방의회 의원 DB</h2><p>시·도 → 광역의회 → 선거구 → 의원, 시·군·구 → 기초의회 → 선거구 → 의원 순으로 2026년 지방선거 당선인을 표시합니다.</p></div><div class="council-stats"><span>광역의원<b>${Number(counts.metro||0).toLocaleString()}명</b></span><span>기초의원<b>${Number(counts.local||0).toLocaleString()}명</b></span><span>전체 의원<b>${Number(counts.total||0).toLocaleString()}명</b></span><span>기준<b>2026 지방선거</b></span></div><div class="council-db" id="councilDb"></div><div class="council-source">원본: ${esc(data.source?.primaryReference||data.source?.name||'중앙선거관리위원회 당선인 명부')} · 데이터 갱신 ${esc(data.generatedAt||'생성 대기')}</div>`;
const anchor=document.getElementById('elected-db');
if(anchor)anchor.insertAdjacentElement('afterend',section);else document.querySelector('main .manual-grid')?.prepend(section);
const host=section.querySelector('#councilDb');
const regions=data.regions||{};
const regionEntries=Object.entries(regions);
if(!regionEntries.length){host.innerHTML='<div class="council-empty">의원 실명 데이터 생성 전입니다. 데이터 파일을 확인하십시오.</div>';return;}
regionEntries.forEach(([region,reg],idx)=>{
 const metro=reg.metro||{council:region+'의회',districts:{}};
 const local=reg.local||{};
 const metroCount=countDistricts(metro.districts);
 const localCount=Object.values(local).reduce((n,u)=>n+countDistricts(u.districts),0);
 const d=document.createElement('details');d.className='council-region';if(idx===0)d.open=true;
 const locals=Object.entries(local);
 d.innerHTML=`<summary><strong>${esc(region)}</strong><span>${esc(metro.council)} ${metroCount}명 · 기초의원 ${localCount}명</span></summary><div class="council-region-body"><div class="council-type-title"><span>${esc(metro.council)}</span><span>${metroCount}명</span></div>${districtHtml(metro.districts)}${locals.length?`<div class="council-type-title"><span>기초의회</span><span>${locals.length}개 의회 · ${localCount}명</span></div><div class="council-local-list">${locals.map(([name,u])=>localUnitHtml(name,u)).join('')}</div>`:''}</div>`;
 host.append(d);
});
})();
