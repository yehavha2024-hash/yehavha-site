(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const item=data.find(x=>x.id==='ip-trademark-similarity');
  if(!item)return;
  item.statuteSources=[{label:'상표법 제34조 · 국가법령정보센터',url:'https://www.law.go.kr/법령/상표법'}];
})();