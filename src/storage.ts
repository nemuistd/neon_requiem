import { FACILITY_ORDER, FacilityId, ITEM_ORDER, ItemId, IdolId, IDOLS, RECORD_ORDER, RecordId, ResourceId, SONG_ORDER, SongId } from "./definitions";
import {
  applyProduction,
  createInitialFacilities,
  createInitialItems,
  createInitialRecords,
  createInitialResources,
  createInitialSongs,
  createInitialState,
  FacilityState,
  GameState,
  ItemState,
  getOfflineTomorusa,
  INITIAL_ACTIVE_IDOL_ID,
  isIdolUnlocked,
  RecordState,
  MAX_OFFLINE_SECONDS,
  resolveActiveIdolId,
  SAVE_VERSION,
  SongState,
  TOMORUSA_RESOURCE_ID
} from "./game";

export const SAVE_KEY = "neon-requiem-save-v1";

export type LoadResult = {
  state: GameState;
  offlineTomorusa: number;
  offlineSeconds: number;
};

type RawSaveData = {
  saveVersion?: unknown;
  version?: unknown;
  applause?: unknown;
  lights?: unknown;
  resources?: unknown;
  activeIdolId?: unknown;
  recordTabLastSeenContentVersion?: unknown;
  alleyStageLevel?: unknown;
  facilities?: unknown;
  songs?: unknown;
  records?: unknown;
  items?: unknown;
  lastSavedAt?: unknown;
};

export function loadGame(now = Date.now()): LoadResult {
  const rawSave = window.localStorage.getItem(SAVE_KEY);

  if (!rawSave) {
    return {
      state: createInitialState(now),
      offlineTomorusa: 0,
      offlineSeconds: 0
    };
  }

  const savedState = parseSave(rawSave, now);
  if (!savedState) {
    return {
      state: createInitialState(now),
      offlineTomorusa: 0,
      offlineSeconds: 0
    };
  }

  const offlineSeconds = Math.max(0, (now - savedState.lastSavedAt) / 1000);
  const offlineTomorusa = getOfflineTomorusa(savedState, offlineSeconds);
  const appliedOfflineSeconds = Math.min(offlineSeconds, MAX_OFFLINE_SECONDS);
  const state = {
    ...applyProduction(savedState, appliedOfflineSeconds),
    lastSavedAt: now
  };

  return { state, offlineTomorusa, offlineSeconds };
}

export function saveGame(state: GameState, now = Date.now()): GameState {
  const stateToSave: GameState = {
    ...state,
    saveVersion: SAVE_VERSION,
    activeIdolId: resolveActiveIdolId(state),
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

    if (
      saveVersion === 1 ||
      saveVersion === 2 ||
      saveVersion === 3 ||
      saveVersion === 4 ||
      saveVersion === 5 ||
      saveVersion === 6 ||
      saveVersion === 7 ||
      saveVersion === SAVE_VERSION ||
      saveVersion === null
    ) {
      return parseLatestSave(data, now);
    }

    return null;
  } catch {
    return null;
  }
}

function parseLatestSave(data: RawSaveData, now: number): GameState | null {
  const { applause, lights, resources, activeIdolId, recordTabLastSeenContentVersion, facilities, items, songs, records, lastSavedAt } = data;

  const state: GameState = {
    saveVersion: SAVE_VERSION,
    resources: normalizeResources(resources, lights ?? applause),
    activeIdolId: getSavedActiveIdolId(activeIdolId),
    recordTabLastSeenContentVersion: normalizeRecordTabLastSeenContentVersion(recordTabLastSeenContentVersion),
    facilities: normalizeFacilities(facilities, data.alleyStageLevel),
    items: normalizeItems(items),
    songs: normalizeSongs(songs),
    records: normalizeRecords(records),
    lastSavedAt: normalizeSavedAt(lastSavedAt, now)
  };

  return {
    ...state,
    activeIdolId: isIdolUnlocked(state, state.activeIdolId) ? state.activeIdolId : INITIAL_ACTIVE_IDOL_ID
  };
}

function normalizeResources(resources: unknown, fallbackTomorusa: unknown): Record<ResourceId, number> {
  return {
    ...createInitialResources(),
    [TOMORUSA_RESOURCE_ID]: getSavedResourceAmount(resources, TOMORUSA_RESOURCE_ID, fallbackTomorusa)
  };
}

function getSavedResourceAmount(resources: unknown, resourceId: ResourceId, fallback: unknown): number {
  if (!isRecord(resources)) {
    return normalizeAmount(fallback);
  }

  const rawAmount = (resources as Partial<Record<ResourceId, unknown>>)[resourceId];

  return normalizeAmount(rawAmount);
}

function normalizeRecordTabLastSeenContentVersion(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function normalizeFacilities(facilities: unknown, fallbackAlleyStageLevel?: unknown): Record<FacilityId, FacilityState> {
  return FACILITY_ORDER.reduce(
    (normalizedFacilities, facilityId) => ({
      ...normalizedFacilities,
      [facilityId]: {
        level: getSavedFacilityLevel(facilities, facilityId, fallbackAlleyStageLevel)
      }
    }),
    createInitialFacilities()
  );
}

function normalizeItems(items: unknown): Record<ItemId, ItemState> {
  return ITEM_ORDER.reduce(
    (normalizedItems, itemId) => ({
      ...normalizedItems,
      [itemId]: {
        purchased: getSavedItemPurchased(items, itemId)
      }
    }),
    createInitialItems()
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

function getSavedItemPurchased(items: unknown, itemId: ItemId): boolean {
  if (!isRecord(items)) {
    return false;
  }

  const item = (items as Partial<Record<ItemId, { purchased?: unknown }>>)[itemId];

  return item?.purchased === true;
}

function getSavedSongPurchased(songs: unknown, songId: SongId): boolean {
  if (!isRecord(songs)) {
    return false;
  }

  const song = (songs as Partial<Record<SongId, { purchased?: unknown }>>)[songId];

  return song?.purchased === true;
}

function getSavedFacilityLevel(facilities: unknown, facilityId: FacilityId, fallbackAlleyStageLevel?: unknown): number {
  if (!isRecord(facilities)) {
    if (facilityId === "alleyStage") {
      return normalizeLevel(fallbackAlleyStageLevel);
    }

    return 0;
  }

  const facility = (facilities as Partial<Record<FacilityId, { level?: unknown }>>)[facilityId];

  return normalizeLevel(facility?.level);
}

function getSavedActiveIdolId(activeIdolId: unknown): IdolId {
  if (typeof activeIdolId === "string" && Object.prototype.hasOwnProperty.call(IDOLS, activeIdolId)) {
    return activeIdolId as IdolId;
  }

  return INITIAL_ACTIVE_IDOL_ID;
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
