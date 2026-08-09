(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const replacements=new Map([
    ['https://www.molit.go.kr/USR/I0204/m_45/dtl.jsp?idx=18882','https://www.molit.go.kr/USR/I0204/m_45/dtl.jsp?gubun=4&idx=18882&lcmspage=1&psize=10'],
    ['https://www.mfds.go.kr/brd/m_218/view.do?seq=33707','https://mfds.go.kr/brd/m_218/view.do?seq=33707']
  ]);

  const fields=['statuteSources','relatedCases','officialGuidance','sources'];
  data.forEach(item=>{
    fields.forEach(field=>{
      if(!Array.isArray(item[field])) return;
      item[field]=item[field].map(src=>{
        if(!src||!src.url) return src;
        const next=replacements.get(src.url);
        return next?{...src,url:next}:src;
      });
    });
  });
})();
