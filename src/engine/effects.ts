export type Effect =
  | { type: "manual.gain.add"; resourceId: string; amount: number }
  | { type: "facility.production.multiplier"; multiplier: number }
  | { type: "offline.reward.multiplier"; multiplier: number };

export function getManualGainBonus(effects: Effect[], resourceId: string): number {
  return effects.reduce((bonus, effect) => {
    if (effect.type !== "manual.gain.add" || effect.resourceId !== resourceId) {
      return bonus;
    }

    return bonus + effect.amount;
  }, 0);
}

export function getFacilityProductionMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "facility.production.multiplier") {
      return multiplier;
    }

    return multiplier * effect.multiplier;
  }, 1);
}

export function getOfflineRewardMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "offline.reward.multiplier") {
      return multiplier;
    }

    return multiplier * effect.multiplier;
  }, 1);
}
