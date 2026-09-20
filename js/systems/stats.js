import { bmiFrom, createRoster } from "../data/personas.js";

export function initialNational() {
  return {
    avgBmiWomen: 27.2,
    obesityRate: 42,
    morbidRate: 9,
    superObeseRate: 2.5,
    avgWeightGainMonthly: 0,
    furnitureStressIndex: 18,
    plusSizeRetailIndex: 100,
    womenTurnout: 52,
    infrastructureIncidents: 0,
    history: [{ month: 0, avgBmi: 27.2, obesity: 42 }],
  };
}

export function computeFromRoster(roster) {
  const bmis = roster.map(bmiFrom);
  const avg = bmis.reduce((a, b) => a + b, 0) / bmis.length;
  const obesity = (bmis.filter((b) => b >= 30).length / bmis.length) * 100;
  const morbid = (bmis.filter((b) => b >= 40).length / bmis.length) * 100;
  const superO = (bmis.filter((b) => b >= 50).length / bmis.length) * 100;
  const avgWeight = roster.reduce((a, p) => a + p.weightLb, 0) / roster.length;

  return {
    avgBmiWomen: avg,
    obesityRate: obesity,
    morbidRate: morbid,
    superObeseRate: superO,
    avgWeightWomen: avgWeight,
  };
}

/**
 * Apply policy + monthly drift to roster and national aggregates
 */
export function applyMonthlyPhysics(state, policy) {
  const bias = policy?.weightBias ?? 0.2;
  const roster = state.roster;

  for (const p of roster) {
    let drift = 0.15 + bias * 0.35;
    if (p.weightStance === "gainer") drift *= 1.45;
    if (p.weightStance === "opposed") drift *= 0.55;

    if (policy) {
      if (p.weightStance === "gainer") drift += bias * 0.4;
      if (p.weightStance === "opposed" && bias > 0.8) drift -= 0.1;
    }

    drift += (Math.random() - 0.35) * 0.3;
    drift = Math.max(-0.2, drift);
    p.weightLb = Math.round(p.weightLb + drift * 2.8);
  }

  const computed = computeFromRoster(roster);
  const national = state.national;

  const bmiDelta = computed.avgBmiWomen - national.avgBmiWomen;
  national.avgBmiWomen = computed.avgBmiWomen;
  national.obesityRate = computed.obesityRate;
  national.morbidRate = computed.morbidRate;
  national.superObeseRate = computed.superObeseRate;
  national.avgWeightGainMonthly = bmiDelta * 8;
  national.plusSizeRetailIndex = Math.min(
    220,
    national.plusSizeRetailIndex + bias * 2.5 + computed.obesityRate * 0.02,
  );
  national.furnitureStressIndex = Math.min(
    100,
    national.furnitureStressIndex + computed.morbidRate * 0.15 + bias * 1.2,
  );

  if (computed.morbidRate > 12 && Math.random() < 0.15 + bias * 0.08) {
    national.infrastructureIncidents += 1;
  }

  national.history.push({
    month: state.month,
    avgBmi: computed.avgBmiWomen,
    obesity: computed.obesityRate,
  });

  return computed;
}

export function newGameState() {
  const roster = createRoster(24);
  const national = initialNational();
  const fromRoster = computeFromRoster(roster);
  Object.assign(national, {
    avgBmiWomen: fromRoster.avgBmiWomen,
    obesityRate: fromRoster.obesityRate,
    morbidRate: fromRoster.morbidRate,
    superObeseRate: fromRoster.superObeseRate,
  });

  return {
    month: 1,
    maxMonth: 48,
    approval: 51,
    roster,
    national,
    manager: null,
    platform: "",
    lastPolicy: null,
    lastPoll: null,
    gameOver: false,
    wonElection: null,
  };
}
