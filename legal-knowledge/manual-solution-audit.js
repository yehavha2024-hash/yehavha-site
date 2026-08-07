(function(){
  const data = window.LEGAL_KNOWLEDGE || [];
  const truthyAt = (arr, i) => Array.isArray(arr) && !!arr[i];
  const missing = [];
  let normalTotal = 0;
  let normalManual = 0;
  let hardTotal = 0;
  let hardManual = 0;
  let itemsWithCases = 0;
  let fullyManualItems = 0;

  data.forEach(item => {
    const variations = Array.isArray(item.variations) ? item.variations : [];
    const hardVariations = Array.isArray(item.hardVariations) ? item.hardVariations : [];
    if (!variations.length && !hardVariations.length) {
      item.manualSolutionAudit = {normalTotal:0,normalManual:0,hardTotal:0,hardManual:0,complete:true,missingNormal:[],missingHard:[]};
      item.manualSolutionsComplete = true;
      return;
    }

    itemsWithCases += 1;
    normalTotal += variations.length;
    hardTotal += hardVariations.length;

    const missingNormal = [];
    const missingHard = [];
    variations.forEach((_,i) => {
      if (truthyAt(item.variationSolutions,i)) normalManual += 1;
      else missingNormal.push(i + 1);
    });
    hardVariations.forEach((_,i) => {
      if (truthyAt(item.hardVariationSolutions,i)) hardManual += 1;
      else missingHard.push(i + 1);
    });

    const complete = missingNormal.length === 0 && missingHard.length === 0;
    if (complete) fullyManualItems += 1;
    else missing.push({id:item.id,title:item.title,missingNormal,missingHard});

    item.manualSolutionAudit = {
      normalTotal:variations.length,
      normalManual:variations.length - missingNormal.length,
      hardTotal:hardVariations.length,
      hardManual:hardVariations.length - missingHard.length,
      complete,
      missingNormal,
      missingHard
    };
    item.manualSolutionsComplete = complete;
  });

  window.MANUAL_SOLUTION_AUDIT = {
    generatedAt:'2026-08-07',
    itemsWithCases,
    fullyManualItems,
    incompleteItems:missing.length,
    normalTotal,
    normalManual,
    hardTotal,
    hardManual,
    missing
  };

  if (missing.length) console.warn('[Legal Knowledge] Manual case-answer coverage incomplete:', missing);
  else console.info('[Legal Knowledge] Manual case-answer coverage complete for all current case variations.');
})();