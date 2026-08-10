(() => {
  'use strict';

  const current = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const baseLocalize = typeof current.localize === 'function'
    ? current.localize.bind(current)
    : value => String(value ?? '');

  const exactReplacements = [
    ['법원(source)', 'source of law (법원)'],
    ['법원 (source)', 'source of law (법원)']
  ];

  const extraTerms = [
    ['The Habermas–Rawls Debate', '하버마스-롤스 논쟁'],
    ['Reply to Habermas', '하버마스에 대한 답변'],
    ['AI as legal persons: past, patterns, and prospects', '법적 인격체로서의 AI: 과거, 유형, 전망'],
    ['Human to machine innovation: Does legal personhood and inventorship threshold offer any leeway?', '인간에서 기계로의 혁신: 법인격과 발명자성 기준은 여지를 제공하는가?'],
    ['AI and Responsibility: No Gap, but Abundance', 'AI와 책임: 공백이 아니라 다중·과잉'],
    ['Meaningful Human Control over Autonomous Systems', '자율시스템에 대한 의미 있는 인간 통제'],
    ['Konrad Hesse’s praktische Konkordanz as a method of balancing constitutional rights in the Lithuanian and Latvian legal systems', '리투아니아·라트비아 법체계에서 헌법적 권리 형량방법으로서 콘라트 헤세의 실제적 조화'],
    ['Kritik der praktischen Konkordanz', '실제적 조화 비판'],
    ['Kant’s Deductions of the Principles of Right', '칸트의 권리원리 연역'],
    ['What Is the Will Theory of Rights?', '권리의 의사설이란 무엇인가?'],
    ['Some Fundamental Legal Conceptions as Applied in Judicial Reasoning', '사법적 추론에 적용되는 몇 가지 기본적 법개념'],
    ['Rawls on Liberty and Its Priority', '자유와 그 우선성에 관한 롤스'],
    ['Rights as Trumps', '으뜸패로서의 권리'],
    ['Professor Dworkin’s Theory of Rights', '드워킨 교수의 권리이론'],
    ['Ronald Dworkin: In Memoriam', '로널드 드워킨 추모'],
    ['The Constitutional Structure of Proportionality', '비례성의 헌법적 구조'],
    ['Alexy and the ‘German’ Model of Proportionality', '알렉시와 ‘독일식’ 비례성 모델'],
    ['Resuscitation of a Phantom?', '유령의 부활?'],
    ['The Nature and Functions of Responsibility', '책임의 본질과 기능'],
    ['The Negligence Standard: Political Not Metaphysical', '과실기준: 형이상학적이 아니라 정치적인'],
    ['Equality, Luck, and Responsibility', '평등, 운, 책임'],
    ['The Cost of Accidents: A Legal and Economic Analysis', '사고비용: 법적·경제적 분석'],
    ['Secondary Accident Cost Avoidance: The Loss Spreading and Deep Pocket Methods', '2차 사고비용 회피: 손실분산과 딥포켓 방식'],
    ['Neil MacCormick’s Second Thoughts on Legal Reasoning and Legal Theory', '법적 추론과 법이론에 관한 닐 매코믹의 재고'],
    ['Legal Justification by Optimal Coherence', '최적 정합성에 의한 법적 정당화'],
    ['Who are Law’s Persons? From Cheshire Cats to Responsible Subjects', '법의 사람은 누구인가? 체셔 고양이에서 책임주체까지'],
    ['The Moral Basis of Strict Liability', '무과실책임의 도덕적 기초'],
    ['Being Responsible and Being a Victim of Circumstance', '책임지는 것과 상황의 희생자가 되는 것'],
    ['Responsibility and Luck', '책임과 운'],
    ['Responsibility in Negligence: Why the Duty of Care is not a Duty ‘To Try’', '과실에서의 책임: 주의의무가 ‘노력할 의무’가 아닌 이유'],
    ['Duty of Care: An Analytical Approach', '주의의무: 분석적 접근'],
    ['Positivism and Fidelity to Law', '법실증주의와 법에 대한 충실성'],
    ['On the Concept and the Nature of Law', '법의 개념과 본성에 관하여'],
    ['Positivism and the Separation of Law and Morals', '법실증주의와 법·도덕의 분리'],
    ['The Moral Limits of the Criminal Law', '형법의 도덕적 한계'],
    ['Harm to Others', '타인에 대한 해악'],
    ['The Model of Rules I', '규칙 모형 I'],
    ['Universal Principle of Right', '권리의 보편원리'],
    ['Theories of Rights', '권리이론들'],
    ['Responsibility Gaps', '책임공백들'],
    ['Wrongfulness', '잘못성'],
    ['social values', '사회적 가치'],
    ['responsibility as relational phenomenon', '관계적 현상으로서의 책임'],
    ['civil/criminal paradigms', '민사/형사 책임 패러다임'],
    ['assignable responsibility', '배분 가능한 책임'],
    ['patterned/distributive principles', '패턴형/분배적 원칙'],
    ['harm principle', '해악원칙'],
    ['paternalism', '온정주의'],
    ['civil law', '실정법'],
    ['pagination', '쪽수 체계'],
    ['pinpoint', '정확한 인용 위치'],
    ['second-order justification', '2차적 정당화'],
    ['under- and over-inclusiveness', '과소·과잉포섭'],
    ['rules/principles', '규칙/원칙'],
    ['legal discourse', '법적 담론'],
    ['special case', '특수사례'],
    ['source of law', '법원'],
    ['legality', '합법성'],
    ['human–robot collaborations', '인간-로봇 협업'],
    ['human–robot collaboration', '인간-로봇 협업'],
    ['human-robot collaborations', '인간-로봇 협업'],
    ['human-robot collaboration', '인간-로봇 협업'],
    ['human‑robot collaborations', '인간-로봇 협업'],
    ['human‑robot collaboration', '인간-로봇 협업'],
    ['human—robot collaborations', '인간-로봇 협업'],
    ['human—robot collaboration', '인간-로봇 협업'],
    ['Raz', '라즈'],
    ['Matthias', '마티아스'],
    ['Santoni de Sio', '산토니 데 시오'],
    ['van den Hoven', '판 덴 호벤'],
    ['Nyholm', '뉘홀름'],
    ['Kiener', '키너']
  ];

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ordered = extraTerms.slice().sort((a, b) => b[0].length - a[0].length);

  function localize(value) {
    let text = String(value ?? '');

    exactReplacements.forEach(([from, to]) => {
      text = text.split(from).join(to);
    });

    text = baseLocalize(text);

    const replacements = [];
    ordered.forEach(([foreign, korean]) => {
      const pattern = new RegExp(`(^|[^A-Za-z])(${escapeRegex(foreign)})(?![A-Za-z]|\\s*\\()`, 'gi');
      text = text.replace(pattern, (full, prefix, match) => {
        const index = replacements.length;
        replacements.push(`${match} (${korean})`);
        return `${prefix}\uE100${index}\uE101`;
      });
    });

    replacements.forEach((replacement, index) => {
      text = text.replace(`\uE100${index}\uE101`, replacement);
    });

    return text;
  }

  window.LEGAL_PHILOSOPHY_TERMINOLOGY = {
    ...current,
    extraTerms: Object.freeze(Object.fromEntries(extraTerms)),
    localize
  };
})();