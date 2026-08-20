(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};const c=tb['CORE-101'];if(!c)return;
c.texts=[
 'John Dewey, How We Think, D.C. Heath, 1910.',
 'Stephen E. Toulmin, The Uses of Argument, 2nd ed., Cambridge University Press, 2003.',
 'Daniel Kahneman, Thinking, Fast and Slow, Farrar, Straus and Giroux, 2011.',
 'Anthony Weston, A Rulebook for Arguments, 5th ed., Hackett Publishing, 2018.'
];
// L01 Dewey: reflective thinking and inquiry
c.lessons[0][5]=['John Dewey, How We Think, D.C. Heath, 1910.'];
// L02 Weston: reasons, premises and conclusions
c.lessons[1][5]=['Anthony Weston, A Rulebook for Arguments, 5th ed., Hackett Publishing, 2018.'];
// L03 Ogden & Richards: meaning, language and definition
c.lessons[2][5]=['C. K. Ogden & I. A. Richards, The Meaning of Meaning, Kegan Paul / Harcourt Brace, 1923.'];
// L04 Copi et al.: formal validity and deduction
c.lessons[3][5]=['Irving M. Copi, Carl Cohen & Kenneth McMahon, Introduction to Logic, 14th ed., Routledge, 2011.'];
// L05: Hume supports the philosophical problem of induction; Hacking supports formal probability/Bayes.
c.lessons[4][3]='P(H|E)=P(E|H)P(H)/P(E)';
c.lessons[4][5]=['David Hume, An Enquiry Concerning Human Understanding, 1748, §§IV–VI.','Ian Hacking, An Introduction to Probability and Inductive Logic, Cambridge University Press, 2001, chs. 2–7.'];
// L06: Pearl supports causal reasoning/DAG intuition; ATE notation is anchored in potential-outcomes causal inference.
c.lessons[5][5]=['Judea Pearl & Dana Mackenzie, The Book of Why, Basic Books, 2018.','Donald B. Rubin, “Estimating Causal Effects of Treatments in Randomized and Nonrandomized Studies,” Journal of Educational Psychology 66(5), 1974, 688–701.','Miguel A. Hernán & James M. Robins, Causal Inference: What If, 2024 online edition.'];
// L07 Walton: fallacies and informal argument
c.lessons[6][5]=['Douglas Walton, Informal Logic: A Pragmatic Approach, 2nd ed., Cambridge University Press, 2008.'];
// L08 Kahneman: heuristics/bias and judgment
c.lessons[7][5]=['Daniel Kahneman, Thinking, Fast and Slow, Farrar, Straus and Giroux, 2011.'];
// L09 source evaluation/research practice
c.lessons[8][5]=['Wayne C. Booth, Gregory G. Colomb, Joseph M. Williams, Joseph Bizup & William T. FitzGerald, The Craft of Research, 5th ed., University of Chicago Press, 2024.'];
// L10: steelman is treated as a modern charitable-reconstruction practice, not a Toulmin technical term.
c.lessons[9][0]='반론·자비의 원칙·스틸맨';
c.lessons[9][1]='좋은 반론은 상대 주장을 약하게 왜곡하지 않고 가능한 한 강하고 합리적인 형태로 재구성한 뒤 핵심 전제와 warrant를 비판한다. 여기서 steelman은 현대적 논증 실천을 가리키며 Toulmin의 고유 전문용어와 동일시하지 않는다.';
c.lessons[9][2]=['principle of charity','steelman','rebuttal','burden of proof','warrant'];
c.lessons[9][5]=['Stephen E. Toulmin, The Uses of Argument, 2nd ed., Cambridge University Press, 2003, “The Layout of Arguments.”','Anthony Weston, A Rulebook for Arguments, 5th ed., Hackett Publishing, 2018.'];
// L11: Hacking supplies expected-value/decision-under-uncertainty foundations; Smart Choices supplies practical decision framing.
c.lessons[10][5]=['Ian Hacking, An Introduction to Probability and Inductive Logic, Cambridge University Press, 2001, chs. 8–10.','John S. Hammond, Ralph L. Keeney & Howard Raiffa, Smart Choices: A Practical Guide to Making Better Decisions, Harvard Business Review Press, rev. ed. 2015.'];
// L12 Toulmin argument layout and qualification/rebuttal
c.lessons[11][5]=['Stephen E. Toulmin, The Uses of Argument, 2nd ed., Cambridge University Press, 2003, ch. III “The Layout of Arguments.”'];
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};window.NEXUS_QA_CORRECTIONS['CORE-101']={date:'2026-08-20',status:'SOURCE_ALIGNMENT_REVISED',changes:['L05 Bayes 식의 형식출처 보강','L06 ATE의 potential-outcomes 원자료 보강','L10 steelman과 Toulmin 개념의 귀속 분리','CORE-101 전 Lesson 대표문헌 서지 상세화']};
})();