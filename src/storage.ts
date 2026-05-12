import { applyProduction, createInitialState, GameState, getOfflineApplause, SAVE_VERSION } from "./game";

export const SAVE_KEY = "neon-requiem-save-v1";

export type LoadResult = {
  state: GameState;
  offlineApplause: number;
  offlineSeconds: number;
};

type SaveData = {
  version: number;
  applause: number;
  alleyStageLevel: number;
  lastSavedAt: number;
};

export function loadGame(now = Date.now()): LoadResult {
  const rawSave = window.localStorage.getItem(SAVE_KEY);

  if (!rawSave) {
    return {
      state: createInitialState(now),
      offlineApplause: 0,
      offlineSeconds: 0
    };
  }

  const savedState = parseSave(rawSave, now);
  if (!savedState) {
    return {
      state: createInitialState(now),
      offlineApplause: 0,
      offlineSeconds: 0
    };
  }

  const offlineSeconds = Math.max(0, (now - savedState.lastSavedAt) / 1000);
  const offlineApplause = getOfflineApplause(savedState, offlineSeconds);
  const state = {
    ...applyProduction(savedState, offlineSeconds),
    lastSavedAt: now
  };

  return { state, offlineApplause, offlineSeconds };
}

export function saveGame(state: GameState, now = Date.now()): GameState {
  const stateToSave = {
    ...state,
    lastSavedAt: now
  };

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
  return stateToSave;
}

function parseSave(rawSave: string, now: number): GameState | null {
  try {
    const data = JSON.parse(rawSave) as Partial<SaveData>;
    const { version, applause, alleyStageLevel, lastSavedAt } = data;

    if (
      version !== SAVE_VERSION ||
      typeof applause !== "number" ||
      typeof alleyStageLevel !== "number" ||
      typeof lastSavedAt !== "number" ||
      !Number.isFinite(applause) ||
      !Number.isFinite(alleyStageLevel) ||
      !Number.isFinite(lastSavedAt)
    ) {
      return null;
    }

    return {
      version: SAVE_VERSION,
      applause: Math.max(0, applause),
      alleyStageLevel: Math.max(0, Math.floor(alleyStageLevel)),
      lastSavedAt: Math.min(now, Math.max(0, lastSavedAt))
    };
  } catch {
    return null;
  }
}
