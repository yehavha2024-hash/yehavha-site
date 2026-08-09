(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  data.forEach(item=>{
    const text=[
      item.title,item.subfield,
      ...(item.keywords||[]),
      ...(item.relatedRules||[]),
      ...(item.statuteSources||[]).map(x=>x.label),
      ...(item.sources||[]).map(x=>x.label)
    ].filter(Boolean).join(' ');
    if(!/상표법/.test(text)) return;

    (item.currentLawVersions||[]).forEach(v=>{
      if(v.name==='상표법'){
        v.effective='2025.11.11';
        v.ref='법률 제21134호';
      }
    });
    item.lawDate='2025.11.11';
    item.currentnessStatus='2026-08-09 현행법 대조';
  });
})();
