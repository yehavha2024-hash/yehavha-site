(() => {
  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];
  const counterIds = new Set([
    "thesis-lee-tort-2021",
    "article-bryson-persons-2017",
    "article-wachter-explanation-2017",
    "kr-civil-shin-jihye-2026",
    "kr-crim-lee-sangsoo-2025",
    "os-civil-bertolini-2013",
    "os-civil-seng-tan-2024",
    "os-civil-low-yee-wu-2024",
    "os-public-kroll-2018",
    "os-privacy-edwards-veale-2017",
    "os-crim-gless-2016",
    "os-crim-sarch-abbott-2019",
    "os-crim-simmler-2024",
    "os-crim-hrw-2012",
    "os-ip-thaler-perlmutter-2025",
    "os-ip-thaler-vidal-2022",
    "os-ip-uksc-thaler-2023",
    "os-ip-epo-j8-20"
  ]);

  records.forEach(record => {
    const roles = new Set(Array.isArray(record.evidenceRoles) ? record.evidenceRoles : []);
    if (record.priority === "A") roles.add("직접 인용 핵심문헌");
    if (record.stage === "비교법" || /EU|미국|국제|비교법|유럽|영국|중국|일본/.test(record.jurisdiction || "")) roles.add("비교법");
    if ((record.year || 0) >= 2025) roles.add("최신문헌");
    if (counterIds.has(record.id)) roles.add("반대학설");
    record.evidenceRoles = [...roles];
  });
})();
