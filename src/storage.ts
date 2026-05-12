import { FACILITY_ORDER, FacilityId, RECORD_ORDER, RecordId, SONG_ORDER, SongId } from "./definitions";
import {
  applyProduction,
  createInitialFacilities,
  createInitialRecords,
  createInitialSongs,
  createInitialState,
  FacilityState,
  GameState,
  getOfflineLights,
  RecordState,
  SAVE_VERSION,
  SongState
} from "./game";

export const SAVE_KEY = "neon-requiem-save-v1";

export type LoadResult = {
  state: GameState;
  offlineLights: number;
  offlineSeconds: number;
};

type RawSaveData = {
  saveVersion?: unknown;
  version?: unknown;
  applause?: unknown;
  lights?: unknown;
  alleyStageLevel?: unknown;
  facilities?: unknown;
  songs?: unknown;
  records?: unknown;
  lastSavedAt?: unknown;
};

export function loadGame(now = Date.now()): LoadResult {
  const rawSave = window.localStorage.getItem(SAVE_KEY);

  if (!rawSave) {
    return {
      state: createInitialState(now),
      offlineLights: 0,
      offlineSeconds: 0
    };
  }

  const savedState = parseSave(rawSave, now);
  if (!savedState) {
    return {
      state: createInitialState(now),
      offlineLights: 0,
      offlineSeconds: 0
    };
  }

  const offlineSeconds = Math.max(0, (now - savedState.lastSavedAt) / 1000);
  const offlineLights = getOfflineLights(savedState, offlineSeconds);
  const state = {
    ...applyProduction(savedState, offlineSeconds),
    lastSavedAt: now
  };

  return { state, offlineLights, offlineSeconds };
}

export function saveGame(state: GameState, now = Date.now()): GameState {
  const stateToSave: GameState = {
    ...state,
    saveVersion: SAVE_VERSION,
    lastSavedAt: now
  };

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
  return stateToSave;
}

function parseSave(rawSave: string, now: number): GameState | null {
  try {
    const data = JSON.parse(rawSave);

    if (!isRecord(data)) {
      return null;
    }

    const saveVersion = getRawSaveVersion(data);

    if (saveVersion === 1) {
      return migrateV1Save(data, now);
    }

    if (saveVersion === 2 || saveVersion === 3 || saveVersion === 4 || saveVersion === SAVE_VERSION || saveVersion === null) {
      return parseV2Save(data, now);
    }

    return null;
  } catch {
    return null;
  }
}

function migrateV1Save(data: RawSaveData, now: number): GameState | null {
  const { applause, lights, alleyStageLevel, lastSavedAt } = data;

  return {
    saveVersion: SAVE_VERSION,
    lights: normalizeAmount(lights ?? applause),
    facilities: {
      ...createInitialFacilities(),
      alleyStage: {
        level: normalizeLevel(alleyStageLevel)
      }
    },
    songs: createInitialSongs(),
    records: createInitialRecords(),
    lastSavedAt: normalizeSavedAt(lastSavedAt, now)
  };
}

function parseV2Save(data: RawSaveData, now: number): GameState | null {
  const { applause, lights, facilities, songs, records, lastSavedAt } = data;

  return {
    saveVersion: SAVE_VERSION,
    lights: normalizeAmount(lights ?? applause),
    facilities: normalizeFacilities(facilities),
    songs: normalizeSongs(songs),
    records: normalizeRecords(records),
    lastSavedAt: normalizeSavedAt(lastSavedAt, now)
  };
}

function normalizeFacilities(facilities: unknown): Record<FacilityId, FacilityState> {
  return FACILITY_ORDER.reduce(
    (normalizedFacilities, facilityId) => ({
      ...normalizedFacilities,
      [facilityId]: {
        level: getSavedFacilityLevel(facilities, facilityId)
      }
    }),
    createInitialFacilities()
  );
}

function normalizeSongs(songs: unknown): Record<SongId, SongState> {
  return SONG_ORDER.reduce(
    (normalizedSongs, songId) => ({
      ...normalizedSongs,
      [songId]: {
        purchased: getSavedSongPurchased(songs, songId)
      }
    }),
    createInitialSongs()
  );
}

function normalizeRecords(records: unknown): Record<RecordId, RecordState> {
  return RECORD_ORDER.reduce(
    (normalizedRecords, recordId) => ({
      ...normalizedRecords,
      [recordId]: {
        read: getSavedRecordRead(records, recordId)
      }
    }),
    createInitialRecords()
  );
}

function getSavedRecordRead(records: unknown, recordId: RecordId): boolean {
  if (!isRecord(records)) {
    return false;
  }

  const record = (records as Partial<Record<RecordId, { read?: unknown }>>)[recordId];

  return record?.read === true;
}

function getSavedSongPurchased(songs: unknown, songId: SongId): boolean {
  if (!isRecord(songs)) {
    return false;
  }

  const song = (songs as Partial<Record<SongId, { purchased?: unknown }>>)[songId];

  return song?.purchased === true;
}

function getSavedFacilityLevel(facilities: unknown, facilityId: FacilityId): number {
  if (!isRecord(facilities)) {
    return 0;
  }

  const facility = (facilities as Partial<Record<FacilityId, { level?: unknown }>>)[facilityId];

  return normalizeLevel(facility?.level);
}

function getRawSaveVersion(data: RawSaveData): number | null {
  const rawVersion = data.saveVersion ?? data.version;

  if (typeof rawVersion !== "number" || !Number.isFinite(rawVersion)) {
    return null;
  }

  return Math.floor(rawVersion);
}

function normalizeAmount(amount: unknown): number {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return 0;
  }

  return Math.max(0, amount);
}

function normalizeLevel(level: unknown): number {
  if (typeof level !== "number" || !Number.isFinite(level)) {
    return 0;
  }

  return Math.max(0, Math.floor(level));
}

function normalizeSavedAt(savedAt: unknown, now: number): number {
  if (typeof savedAt !== "number" || !Number.isFinite(savedAt)) {
    return now;
  }

  return Math.min(now, Math.max(0, savedAt));
}

function isRecord(value: unknown): value is RawSaveData {
  return typeof value === "object" && value !== null;
}
