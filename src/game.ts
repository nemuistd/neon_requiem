import {
  FACILITIES,
  FACILITY_ORDER,
  FacilityId,
  IdolId,
  IDOL_ORDER,
  IDOLS,
  RECORD_ORDER,
  RecordId,
  RECORDS,
  SONG_ORDER,
  SongId,
  SONGS,
  UnlockRequirement
} from "./definitions";

export const SAVE_VERSION = 5;

export type FacilityState = {
  level: number;
};

export type SongState = {
  purchased: boolean;
};

export type RecordState = {
  read: boolean;
};

export type GameState = {
  saveVersion: typeof SAVE_VERSION;
  lights: number;
  facilities: Record<FacilityId, FacilityState>;
  songs: Record<SongId, SongState>;
  records: Record<RecordId, RecordState>;
  lastSavedAt: number;
};

export type UpgradeResult =
  | { upgraded: true; cost: number; facilityId: FacilityId; state: GameState }
  | { upgraded: false; cost: number; facilityId: FacilityId; state: GameState; reason: "locked" | "notEnoughLights" };

export type PurchaseSongResult =
  | { purchased: true; cost: number; songId: SongId; state: GameState }
  | { purchased: false; cost: number; songId: SongId; state: GameState; reason: "locked" | "notEnoughLights" | "alreadyPurchased" };

export type FacilityMultiplierEffect = {
  idolId: IdolId;
  multiplier: number;
};

export function createInitialState(now = Date.now()): GameState {
  return {
    saveVersion: SAVE_VERSION,
    lights: 0,
    facilities: createInitialFacilities(),
    songs: createInitialSongs(),
    records: createInitialRecords(),
    lastSavedAt: now
  };
}

export function createInitialFacilities(): Record<FacilityId, FacilityState> {
  return FACILITY_ORDER.reduce(
    (facilities, facilityId) => ({
      ...facilities,
      [facilityId]: { level: 0 }
    }),
    {} as Record<FacilityId, FacilityState>
  );
}

export function createInitialRecords(): Record<RecordId, RecordState> {
  return RECORD_ORDER.reduce(
    (records, recordId) => ({
      ...records,
      [recordId]: { read: false }
    }),
    {} as Record<RecordId, RecordState>
  );
}

export function createInitialSongs(): Record<SongId, SongState> {
  return SONG_ORDER.reduce(
    (songs, songId) => ({
      ...songs,
      [songId]: { purchased: false }
    }),
    {} as Record<SongId, SongState>
  );
}

export function getFacilityLevel(state: GameState, facilityId: FacilityId): number {
  return state.facilities[facilityId]?.level ?? 0;
}

export function isSongPurchased(state: GameState, songId: SongId): boolean {
  return state.songs[songId]?.purchased ?? false;
}

export function isRecordRead(state: GameState, recordId: RecordId): boolean {
  return state.records[recordId]?.read ?? false;
}

export function isRequirementMet(state: GameState, requirement?: UnlockRequirement): boolean {
  if (!requirement) {
    return true;
  }

  if (requirement.type === "songPurchased") {
    return isSongPurchased(state, requirement.songId);
  }

  return getFacilityLevel(state, requirement.facilityId) >= requirement.level;
}

export function areRequirementsMet(state: GameState, requirements: UnlockRequirement[]): boolean {
  return requirements.every((requirement) => isRequirementMet(state, requirement));
}

export function isFacilityUnlocked(state: GameState, facilityId: FacilityId): boolean {
  return isRequirementMet(state, FACILITIES[facilityId].unlockRequirement);
}

export function isIdolUnlocked(state: GameState, idolId: IdolId): boolean {
  return isRequirementMet(state, IDOLS[idolId].unlockRequirement);
}

export function isSongUnlocked(state: GameState, songId: SongId): boolean {
  return isRequirementMet(state, SONGS[songId].unlockRequirement);
}

export function isRecordUnlocked(state: GameState, recordId: RecordId): boolean {
  return areRequirementsMet(state, RECORDS[recordId].unlockRequirements);
}

export function getFacilityUpgradeCost(state: GameState, facilityId: FacilityId): number {
  const facility = FACILITIES[facilityId];
  const level = getFacilityLevel(state, facilityId);

  return Math.floor(facility.baseCost * facility.costMultiplier ** level);
}

export function getFacilityLightsPerSecond(state: GameState, facilityId: FacilityId): number {
  if (!isFacilityUnlocked(state, facilityId)) {
    return 0;
  }

  return getFacilityBaseLightsPerSecond(state, facilityId) * getFacilityProductionMultiplier(state);
}

export function getFacilityBaseLightsPerSecond(state: GameState, facilityId: FacilityId): number {
  return getFacilityLevel(state, facilityId) * (FACILITIES[facilityId].productionPerLevel ?? 0);
}

export function getFacilityProductionMultiplier(state: GameState): number {
  const idolMultiplier = getGlobalMultiplierEffects(state).reduce((multiplier, effect) => multiplier * effect.multiplier, 1);
  const songMultiplier = SONG_ORDER.reduce((multiplier, songId) => {
    const effect = SONGS[songId].effect;

    if (!isSongPurchased(state, songId) || effect.type !== "facilityProductionMultiplier") {
      return multiplier;
    }

    return multiplier * effect.multiplier;
  }, 1);

  return idolMultiplier * songMultiplier;
}

export function getFacilityMultiplierEffects(state: GameState, facilityId: FacilityId): FacilityMultiplierEffect[] {
  if (!isFacilityUnlocked(state, facilityId)) {
    return [];
  }

  return getGlobalMultiplierEffects(state);
}

export function getGlobalMultiplierEffects(state: GameState): FacilityMultiplierEffect[] {
  return IDOL_ORDER.flatMap((idolId) => {
    const passiveEffect = IDOLS[idolId].passiveEffect;

    if (passiveEffect.type !== "globalProductionMultiplier" || !isIdolUnlocked(state, idolId)) {
      return [];
    }

    return [{ idolId, multiplier: passiveEffect.multiplier }];
  });
}

export function getLightsPerSecond(state: GameState): number {
  return FACILITY_ORDER.reduce((total, facilityId) => total + getFacilityLightsPerSecond(state, facilityId), 0);
}

export function getManualLightGain(state: GameState): number {
  return SONG_ORDER.reduce((gain, songId) => {
    const effect = SONGS[songId].effect;

    if (!isSongPurchased(state, songId) || effect.type !== "manualLightGainBonus") {
      return gain;
    }

    return gain + effect.amount;
  }, 1);
}

export function getOfflineLights(state: GameState, offlineSeconds: number): number {
  return getLightsPerSecond(state) * Math.max(0, offlineSeconds);
}

export function gainManualLights(state: GameState): GameState {
  return {
    ...state,
    lights: state.lights + getManualLightGain(state)
  };
}

export function applyProduction(state: GameState, elapsedSeconds: number): GameState {
  if (elapsedSeconds <= 0) {
    return state;
  }

  return {
    ...state,
    lights: state.lights + getLightsPerSecond(state) * elapsedSeconds
  };
}

export function purchaseSong(state: GameState, songId: SongId): PurchaseSongResult {
  const song = SONGS[songId];

  if (!isSongUnlocked(state, songId)) {
    return { purchased: false, cost: song.cost, songId, state, reason: "locked" };
  }

  if (isSongPurchased(state, songId)) {
    return { purchased: false, cost: song.cost, songId, state, reason: "alreadyPurchased" };
  }

  if (state.lights < song.cost) {
    return { purchased: false, cost: song.cost, songId, state, reason: "notEnoughLights" };
  }

  return {
    purchased: true,
    cost: song.cost,
    songId,
    state: {
      ...state,
      lights: state.lights - song.cost,
      songs: {
        ...state.songs,
        [songId]: {
          purchased: true
        }
      }
    }
  };
}

export function readRecord(state: GameState, recordId: RecordId): GameState {
  if (!isRecordUnlocked(state, recordId) || isRecordRead(state, recordId)) {
    return state;
  }

  return {
    ...state,
    records: {
      ...state.records,
      [recordId]: {
        read: true
      }
    }
  };
}

export function upgradeFacility(state: GameState, facilityId: FacilityId): UpgradeResult {
  const cost = getFacilityUpgradeCost(state, facilityId);

  if (!isFacilityUnlocked(state, facilityId)) {
    return { upgraded: false, cost, facilityId, state, reason: "locked" };
  }

  if (state.lights < cost) {
    return { upgraded: false, cost, facilityId, state, reason: "notEnoughLights" };
  }

  return {
    upgraded: true,
    cost,
    facilityId,
    state: {
      ...state,
      lights: state.lights - cost,
      facilities: {
        ...state.facilities,
        [facilityId]: {
          level: getFacilityLevel(state, facilityId) + 1
        }
      }
    }
  };
}
