export type Effect =
  | { type: "manual.gain.add"; resourceId: string; amount: number }
  | { type: "manual.gain.add.production.ratio"; ratio: number }
  | { type: "facility.production.multiplier"; multiplier: number }
  | { type: "facility.production.multiplier.tag"; tag: string; multiplier: number }
  | { type: "offline.reward.multiplier"; multiplier: number }
  | { type: "bond.rate.multiplier"; multiplier: number }
  | { type: "record.unlock.cost.multiplier"; multiplier: number }
  | { type: "item.cost.multiplier"; multiplier: number }
  | { type: "song.cost.multiplier"; multiplier: number }
  | { type: "memory.fragment.production.add"; ratio: number }
  | { type: "rebirth.bonus.multiplier"; multiplier: number };

export function getManualGainBonus(effects: Effect[], resourceId: string): number {
  return effects.reduce((bonus, effect) => {
    if (effect.type !== "manual.gain.add" || effect.resourceId !== resourceId) {
      return bonus;
    }

    return bonus + effect.amount;
  }, 0);
}

export function getManualGainProductionRatio(effects: Effect[]): number {
  return effects.reduce((ratio, effect) => {
    if (effect.type !== "manual.gain.add.production.ratio") {
      return ratio;
    }

    return ratio + effect.ratio;
  }, 0);
}

export function getFacilityProductionMultiplierFromEffects(effects: Effect[], facilityTags: readonly string[] = []): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type === "facility.production.multiplier") {
      return multiplier * effect.multiplier;
    }

    if (effect.type === "facility.production.multiplier.tag" && facilityTags.includes(effect.tag)) {
      return multiplier * effect.multiplier;
    }

    return multiplier;
  }, 1);
}

export function getBondRateMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "bond.rate.multiplier") {
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

export function getItemCostMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "item.cost.multiplier") {
      return multiplier;
    }

    return multiplier * effect.multiplier;
  }, 1);
}

export function getSongCostMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "song.cost.multiplier") {
      return multiplier;
    }

    return multiplier * effect.multiplier;
  }, 1);
}

export function getMemoryFragmentMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "memory.fragment.production.add") {
      return multiplier;
    }

    return multiplier + effect.ratio;
  }, 1);
}

export function getRebirthBonusMultiplierFromEffects(effects: Effect[]): number {
  return effects.reduce((multiplier, effect) => {
    if (effect.type !== "rebirth.bonus.multiplier") {
      return multiplier;
    }

    return multiplier * effect.multiplier;
  }, 1);
}
