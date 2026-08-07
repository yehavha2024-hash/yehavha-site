(function(){
  const item=(window.LEGAL_KNOWLEDGE||[]).find(x=>x.id==='ai-medical-professional-duty');
  if(!item||!Array.isArray(item.variationSolutions))return;
  item.variationSolutions.forEach(s=>{
    for(const k of ['issue','rule','application','evidence','counter','conclusion']){
      if(typeof s[k]==='string')s[k]=s[k].replace(/अस्पष्ट/g,'불명확');
    }
  });
})();