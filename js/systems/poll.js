import { avatarFor, bmiClass, bmiFrom, bmiLabel, leanLabel, stanceLabel } from "../data/personas.js";
import { quoteForPersona } from "./dialogue.js";

/**
 * @param {import('./stats.js').newGameState extends Function ? ReturnType<import('./stats.js').newGameState> : any} state
 * @param {import('../data/policies.js').PRESET_POLICIES[0]} policy
 */
export function runWomenPoll(state, policy) {
  const results = state.roster.map((persona) => {
    let score = 50 + (policy.approvalBase || 0);

    if (persona.weightStance === "gainer") score += policy.gainerBoost || 0;
    else if (persona.weightStance === "opposed") score += policy.opposedPenalty || 0;
    else score += (policy.gainerBoost + policy.opposedPenalty) / 4;

    const leanMod = policy.leanMod?.[persona.lean] ?? 1;
    score *= leanMod;

    const bmi = bmiFrom(persona);
    if (bmi >= 32 && policy.weightBias > 0.5) score += 4;
    if (bmi < 26 && persona.weightStance === "opposed") score += 6;

    score += (Math.random() - 0.5) * 14;
    score = Math.max(5, Math.min(98, Math.round(score)));

    const quote = quoteForPersona(persona, score, policy);

    persona.approval = score;
    return {
      persona,
      score,
      quote,
      bmi,
      bmiLabel: bmiLabel(bmi),
      bmiClass: bmiClass(bmi),
      avatar: avatarFor(persona),
      lean: leanLabel(persona.lean),
      stance: stanceLabel(persona.weightStance),
    };
  });

  const avg =
    results.reduce((a, r) => a + r.score, 0) / results.length;

  const byStance = {
    gainer: average(results.filter((r) => r.persona.weightStance === "gainer")),
    neutral: average(results.filter((r) => r.persona.weightStance === "neutral")),
    opposed: average(results.filter((r) => r.persona.weightStance === "opposed")),
  };

  return {
    results,
    avgApproval: Math.round(avg),
    byStance,
    policyTitle: policy.title,
  };
}

function average(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, r) => a + r.score, 0) / arr.length);
}

export function updateGlobalApproval(state, poll) {
  const swing = (poll.avgApproval - 50) * 0.35;
  state.approval = Math.max(22, Math.min(78, Math.round(state.approval + swing)));
}
