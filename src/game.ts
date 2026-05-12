import { ALLEY_STAGE } from "./data";

export const SAVE_VERSION = 1;

export type GameState = {
  version: typeof SAVE_VERSION;
  applause: number;
  alleyStageLevel: number;
  lastSavedAt: number;
};

export type UpgradeResult =
  | { upgraded: true; cost: number; state: GameState }
  | { upgraded: false; cost: number; state: GameState };

export function createInitialState(now = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    applause: 0,
    alleyStageLevel: 0,
    lastSavedAt: now
  };
}

export function getAlleyStageUpgradeCost(level: number): number {
  return Math.floor(ALLEY_STAGE.baseCost * ALLEY_STAGE.costMultiplier ** level);
}

export function getApplausePerSecond(state: GameState): number {
  return state.alleyStageLevel * ALLEY_STAGE.productionPerLevel;
}

export function getOfflineApplause(state: GameState, offlineSeconds: number): number {
  return getApplausePerSecond(state) * Math.max(0, offlineSeconds);
}

export function gainManualApplause(state: GameState): GameState {
  return {
    ...state,
    applause: state.applause + 1
  };
}

export function applyProduction(state: GameState, elapsedSeconds: number): GameState {
  if (elapsedSeconds <= 0) {
    return state;
  }

  return {
    ...state,
    applause: state.applause + getApplausePerSecond(state) * elapsedSeconds
  };
}

export function upgradeAlleyStage(state: GameState): UpgradeResult {
  const cost = getAlleyStageUpgradeCost(state.alleyStageLevel);

  if (state.applause < cost) {
    return { upgraded: false, cost, state };
  }

  return {
    upgraded: true,
    cost,
    state: {
      ...state,
      applause: state.applause - cost,
      alleyStageLevel: state.alleyStageLevel + 1
    }
  };
}
