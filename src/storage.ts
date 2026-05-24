import {
  FACILITIES,
  FACILITY_ORDER,
  FacilityId,
  IDOL_ORDER,
  ITEM_ORDER,
  ITEMS,
  ItemId,
  IdolId,
  IDOLS,
  MEGURI_BUFF_ORDER,
  MeguriBuffId,
  RECORD_ORDER,
  RecordId,
  ResourceId,
  SONG_ORDER,
  SONGS,
  SongId
} from "./definitions";
import {
  addResource,
  createInitialFacilities,
  createInitialIdols,
  createInitialItems,
  createInitialMeguri,
  createInitialMeguriBuffs,
  createInitialRecords,
  createInitialResources,
  createInitialSongs,
  createInitialState,
  FacilityState,
  GameState,
  IdolState,
  ItemState,
  getOfflineTomorusa,
  INITIAL_ACTIVE_IDOL_ID,
  isIdolUnlocked,
  MEMORY_FRAGMENT_RESOURCE_ID,
  MeguriState,
  MeguriBuffState,
  RecordState,
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
  totalTomorusaEarned?: unknown;
  activeIdolId?: unknown;
  recordTabLastSeenContentVersion?: unknown;
  alleyStageLevel?: unknown;
  facilities?: unknown;
  idols?: unknown;
  songs?: unknown;
  records?: unknown;
  items?: unknown;
  meguri?: unknown;
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
  const state = {
    ...addResource(savedState, TOMORUSA_RESOURCE_ID, offlineTomorusa),
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
      saveVersion === 8 ||
      saveVersion === 9 ||
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
  const {
    applause,
    lights,
    resources,
    totalTomorusaEarned,
    activeIdolId,
    recordTabLastSeenContentVersion,
    facilities,
    idols,
    items,
    songs,
    records,
    meguri,
    lastSavedAt
  } = data;
  const normalizedResources = normalizeResources(resources, lights ?? applause);
  const normalizedFacilities = normalizeFacilities(facilities, data.alleyStageLevel);
  const normalizedItems = normalizeItems(items);
  const normalizedSongs = normalizeSongs(songs);
  const normalizedMeguri = normalizeMeguri(meguri);

  const state: GameState = {
    saveVersion: SAVE_VERSION,
    resources: normalizedResources,
    totalTomorusaEarned: normalizeTotalTomorusaEarned(
      totalTomorusaEarned,
      normalizedResources,
      normalizedFacilities,
      normalizedItems,
      normalizedSongs
    ),
    activeIdolId: getSavedActiveIdolId(activeIdolId),
    recordTabLastSeenContentVersion: normalizeRecordTabLastSeenContentVersion(recordTabLastSeenContentVersion),
    facilities: normalizedFacilities,
    idols: normalizeIdols(idols),
    items: normalizedItems,
    songs: normalizedSongs,
    records: normalizeRecords(records),
    meguri: normalizedMeguri,
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
    [TOMORUSA_RESOURCE_ID]: getSavedResourceAmount(resources, TOMORUSA_RESOURCE_ID, fallbackTomorusa),
    [MEMORY_FRAGMENT_RESOURCE_ID]: getSavedResourceAmount(resources, MEMORY_FRAGMENT_RESOURCE_ID, 0)
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

function normalizeIdols(idols: unknown): Record<IdolId, IdolState> {
  return IDOL_ORDER.reduce(
    (normalizedIdols, idolId) => ({
      ...normalizedIdols,
      [idolId]: getSavedIdolState(idols, idolId)
    }),
    createInitialIdols()
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
        unlocked: getSavedRecordUnlocked(records, recordId),
        read: getSavedRecordRead(records, recordId),
        annotationRead: getSavedRecordAnnotationRead(records, recordId)
      }
    }),
    createInitialRecords()
  );
}

function normalizeMeguri(meguri: unknown): MeguriState {
  if (!isRecord(meguri)) {
    return createInitialMeguri();
  }
  const savedMeguri = meguri as {
    count?: unknown;
    totalMemoryFragmentsEarned?: unknown;
    buffs?: unknown;
    idolRecognition?: unknown;
    pendingSettlement?: unknown;
  };

  return {
    count: normalizeLevel(savedMeguri.count),
    totalMemoryFragmentsEarned: normalizeLevel(savedMeguri.totalMemoryFragmentsEarned),
    buffs: normalizeMeguriBuffs(savedMeguri.buffs),
    idolRecognition: normalizeIdolRecognition(savedMeguri.idolRecognition),
    pendingSettlement: savedMeguri.pendingSettlement === true
  };
}

function normalizeMeguriBuffs(buffs: unknown): Record<MeguriBuffId, MeguriBuffState> {
  return MEGURI_BUFF_ORDER.reduce(
    (normalizedBuffs, buffId) => ({
      ...normalizedBuffs,
      [buffId]: {
        purchased: getSavedMeguriBuffPurchased(buffs, buffId)
      }
    }),
    createInitialMeguriBuffs()
  );
}

function normalizeIdolRecognition(idolRecognition: unknown): Record<IdolId, boolean> {
  return IDOL_ORDER.reduce(
    (normalizedRecognition, idolId) => ({
      ...normalizedRecognition,
      [idolId]: getSavedIdolRecognition(idolRecognition, idolId)
    }),
    createInitialMeguri().idolRecognition
  );
}

function getSavedIdolState(idols: unknown, idolId: IdolId): IdolState {
  if (!isRecord(idols)) {
    return {
      bond: 0,
      eventIdsRead: []
    };
  }

  const idol = (idols as Partial<Record<IdolId, { bond?: unknown; eventIdsRead?: unknown }>>)[idolId];

  if (!isRecord(idol)) {
    return {
      bond: 0,
      eventIdsRead: []
    };
  }

  return {
    bond: normalizeBond(idol.bond),
    eventIdsRead: normalizeEventIdsRead(idol.eventIdsRead)
  };
}

function getSavedRecordRead(records: unknown, recordId: RecordId): boolean {
  if (!isRecord(records)) {
    return false;
  }

  const record = (records as Partial<Record<RecordId, { read?: unknown }>>)[recordId];

  return record?.read === true;
}

function getSavedRecordUnlocked(records: unknown, recordId: RecordId): boolean {
  if (!isRecord(records)) {
    return false;
  }

  const record = (records as Partial<Record<RecordId, { annotationRead?: unknown; read?: unknown; unlocked?: unknown }>>)[recordId];

  return record?.unlocked === true || record?.read === true || record?.annotationRead === true;
}

function getSavedRecordAnnotationRead(records: unknown, recordId: RecordId): boolean {
  if (!isRecord(records)) {
    return false;
  }

  const record = (records as Partial<Record<RecordId, { annotationRead?: unknown }>>)[recordId];

  return record?.annotationRead === true;
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

function getSavedMeguriBuffPurchased(buffs: unknown, buffId: MeguriBuffId): boolean {
  if (!isRecord(buffs)) {
    return false;
  }

  const buff = (buffs as Partial<Record<MeguriBuffId, { purchased?: unknown }>>)[buffId];

  return buff?.purchased === true;
}

function getSavedIdolRecognition(idolRecognition: unknown, idolId: IdolId): boolean {
  if (!isRecord(idolRecognition)) {
    return false;
  }

  return (idolRecognition as Partial<Record<IdolId, unknown>>)[idolId] === true;
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

function normalizeTotalTomorusaEarned(
  amount: unknown,
  resources: Record<ResourceId, number>,
  facilities: Record<FacilityId, FacilityState>,
  items: Record<ItemId, ItemState>,
  songs: Record<SongId, SongState>
): number {
  const savedAmount = normalizeAmount(amount);
  const estimatedAmount = estimateTotalTomorusaEarned(resources, facilities, items, songs);

  return Math.max(savedAmount, estimatedAmount);
}

function estimateTotalTomorusaEarned(
  resources: Record<ResourceId, number>,
  facilities: Record<FacilityId, FacilityState>,
  items: Record<ItemId, ItemState>,
  songs: Record<SongId, SongState>
): number {
  return (
    resources[TOMORUSA_RESOURCE_ID] +
    estimateFacilityInvestment(facilities) +
    estimatePurchasedItemCost(items) +
    estimatePurchasedSongCost(songs)
  );
}

function estimateFacilityInvestment(facilities: Record<FacilityId, FacilityState>): number {
  return FACILITY_ORDER.reduce((total, facilityId) => {
    const facility = FACILITIES[facilityId];
    const level = facilities[facilityId]?.level ?? 0;

    let costTotal = 0;
    for (let currentLevel = 0; currentLevel < level; currentLevel += 1) {
      costTotal += Math.floor(facility.baseCost * facility.costMultiplier ** currentLevel);
    }

    return total + costTotal;
  }, 0);
}

function estimatePurchasedItemCost(items: Record<ItemId, ItemState>): number {
  return ITEM_ORDER.reduce((total, itemId) => {
    if (!items[itemId]?.purchased) {
      return total;
    }

    return total + Math.max(1, Math.floor(ITEMS[itemId].cost * 0.9));
  }, 0);
}

function estimatePurchasedSongCost(songs: Record<SongId, SongState>): number {
  return SONG_ORDER.reduce((total, songId) => {
    if (!songs[songId]?.purchased) {
      return total;
    }

    return total + SONGS[songId].cost;
  }, 0);
}

function normalizeLevel(level: unknown): number {
  if (typeof level !== "number" || !Number.isFinite(level)) {
    return 0;
  }

  return Math.max(0, Math.floor(level));
}

function normalizeBond(bond: unknown): number {
  if (typeof bond !== "number" || !Number.isFinite(bond) || bond < 0) {
    return 0;
  }

  return bond;
}

function normalizeEventIdsRead(eventIdsRead: unknown): string[] {
  if (!Array.isArray(eventIdsRead)) {
    return [];
  }

  return Array.from(new Set(eventIdsRead.filter((eventId): eventId is string => typeof eventId === "string")));
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
