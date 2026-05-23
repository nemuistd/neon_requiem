import {
  FACILITIES,
  FACILITY_ORDER,
  FacilityId,
  ITEM_ORDER,
  ItemId,
  ITEMS,
  IdolId,
  IDOL_ORDER,
  IDOLS,
  RECORD_CONTENT_VERSION,
  RECORD_ORDER,
  RecordId,
  RECORDS,
  RESOURCE_ORDER,
  ResourceId,
  SONG_ORDER,
  SongId,
  SONGS
} from "./definitions";
import {
  Effect,
  getFacilityProductionMultiplierFromEffects,
  getManualGainBonus,
  getOfflineRewardMultiplierFromEffects
} from "./engine/effects";
import { areRequirementsMet, isRequirementMet } from "./engine/requirements";

export const SAVE_VERSION = 9;
export const INITIAL_ACTIVE_IDOL_ID: IdolId = "otowaAkari";
export const MAX_OFFLINE_SECONDS = 12 * 60 * 60;
export const BASE_OFFLINE_REWARD_RATE = 0.5;
export const TOMORUSA_RESOURCE_ID: ResourceId = "tomorusa";

export type FacilityState = {
  level: number;
};

export type SongState = {
  purchased: boolean;
};

export type ItemState = {
  purchased: boolean;
};

export type RecordState = {
  read: boolean;
};

export type IdolState = {
  bond: number;
  eventIdsRead: string[];
};

export type GameState = {
  saveVersion: typeof SAVE_VERSION;
  resources: Record<ResourceId, number>;
  activeIdolId: IdolId;
  recordTabLastSeenContentVersion: number;
  facilities: Record<FacilityId, FacilityState>;
  idols: Record<IdolId, IdolState>;
  items: Record<ItemId, ItemState>;
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

export type PurchaseItemResult =
  | { purchased: true; cost: number; itemId: ItemId; state: GameState }
  | { purchased: false; cost: number; itemId: ItemId; state: GameState; reason: "locked" | "notEnoughLights" | "alreadyPurchased" };

export type FacilityMultiplierEffect = {
  idolId: IdolId;
  multiplier: number;
};

export function createInitialState(now = Date.now()): GameState {
  return {
    saveVersion: SAVE_VERSION,
    resources: createInitialResources(),
    activeIdolId: INITIAL_ACTIVE_IDOL_ID,
    recordTabLastSeenContentVersion: 0,
    facilities: createInitialFacilities(),
    idols: createInitialIdols(),
    items: createInitialItems(),
    songs: createInitialSongs(),
    records: createInitialRecords(),
    lastSavedAt: now
  };
}

export function createInitialIdols(): Record<IdolId, IdolState> {
  return IDOL_ORDER.reduce(
    (idols, idolId) => ({
      ...idols,
      [idolId]: {
        bond: 0,
        eventIdsRead: []
      }
    }),
    {} as Record<IdolId, IdolState>
  );
}

export function createInitialItems(): Record<ItemId, ItemState> {
  return ITEM_ORDER.reduce(
    (items, itemId) => ({
      ...items,
      [itemId]: { purchased: false }
    }),
    {} as Record<ItemId, ItemState>
  );
}

export function createInitialResources(): Record<ResourceId, number> {
  return RESOURCE_ORDER.reduce(
    (resources, resourceId) => ({
      ...resources,
      [resourceId]: 0
    }),
    {} as Record<ResourceId, number>
  );
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

export function getResourceAmount(state: GameState, resourceId: ResourceId): number {
  return state.resources[resourceId] ?? 0;
}

export function addResource(state: GameState, resourceId: ResourceId, amount: number): GameState {
  if (amount <= 0) {
    return state;
  }

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceId]: getResourceAmount(state, resourceId) + amount
    }
  };
}

export function canSpendResource(state: GameState, resourceId: ResourceId, amount: number): boolean {
  return amount >= 0 && getResourceAmount(state, resourceId) >= amount;
}

export function spendResource(state: GameState, resourceId: ResourceId, amount: number): GameState {
  if (!canSpendResource(state, resourceId, amount)) {
    return state;
  }

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceId]: getResourceAmount(state, resourceId) - amount
    }
  };
}

export function isSongPurchased(state: GameState, songId: SongId): boolean {
  return state.songs[songId]?.purchased ?? false;
}

export function isItemPurchased(state: GameState, itemId: ItemId): boolean {
  return state.items[itemId]?.purchased ?? false;
}

export function isRecordRead(state: GameState, recordId: RecordId): boolean {
  return state.records[recordId]?.read ?? false;
}

export function getIdolBond(state: GameState, idolId: IdolId): number {
  return state.idols[idolId]?.bond ?? 0;
}

export function isFacilityUnlocked(state: GameState, facilityId: FacilityId): boolean {
  return isRequirementMet(state, FACILITIES[facilityId].unlockRequirement);
}

export function isIdolUnlocked(state: GameState, idolId: IdolId): boolean {
  return isRequirementMet(state, IDOLS[idolId].unlockRequirement);
}

export function resolveActiveIdolId(state: GameState): IdolId {
  return isIdolUnlocked(state, state.activeIdolId) ? state.activeIdolId : INITIAL_ACTIVE_IDOL_ID;
}

export function selectActiveIdol(state: GameState, idolId: IdolId): GameState {
  if (!isIdolUnlocked(state, idolId)) {
    return state;
  }

  return {
    ...state,
    activeIdolId: idolId
  };
}

export function markRecordTabSeen(state: GameState): GameState {
  if (state.recordTabLastSeenContentVersion >= RECORD_CONTENT_VERSION) {
    return state;
  }

  return {
    ...state,
    recordTabLastSeenContentVersion: RECORD_CONTENT_VERSION
  };
}

export function isSongUnlocked(state: GameState, songId: SongId): boolean {
  return isRequirementMet(state, SONGS[songId].unlockRequirement);
}

export function isItemUnlocked(state: GameState, itemId: ItemId): boolean {
  return isRequirementMet(state, ITEMS[itemId].unlockRequirement);
}

export function isRecordUnlocked(state: GameState, recordId: RecordId): boolean {
  return areRequirementsMet(state, RECORDS[recordId].unlockRequirements);
}

export function getFacilityUpgradeCost(state: GameState, facilityId: FacilityId): number {
  const facility = FACILITIES[facilityId];
  const level = getFacilityLevel(state, facilityId);

  return Math.floor(facility.baseCost * facility.costMultiplier ** level);
}

export function getFacilityTomorusaPerSecond(state: GameState, facilityId: FacilityId): number {
  if (!isFacilityUnlocked(state, facilityId)) {
    return 0;
  }

  return getFacilityBaseTomorusaPerSecond(state, facilityId) * getFacilityProductionMultiplier(state);
}

export function getFacilityBaseTomorusaPerSecond(state: GameState, facilityId: FacilityId): number {
  return getFacilityLevel(state, facilityId) * (FACILITIES[facilityId].productionPerLevel ?? 0);
}

export function getFacilityProductionMultiplier(state: GameState): number {
  const idolMultiplier = getFacilityProductionMultiplierFromEffects(getUnlockedIdolPassiveEffects(state));
  const contentMultiplier = getFacilityProductionMultiplierFromEffects(getPurchasedContentEffects(state));

  return idolMultiplier * contentMultiplier;
}

export function getFacilityMultiplierEffects(state: GameState, facilityId: FacilityId): FacilityMultiplierEffect[] {
  if (!isFacilityUnlocked(state, facilityId)) {
    return [];
  }

  return getGlobalMultiplierEffects(state);
}

export function getGlobalMultiplierEffects(state: GameState): FacilityMultiplierEffect[] {
  return IDOL_ORDER.flatMap((idolId) => {
    if (!isIdolUnlocked(state, idolId)) {
      return [];
    }

    return IDOLS[idolId].passiveEffects.flatMap((effect) => (
      effect.type === "facility.production.multiplier" ? [{ idolId, multiplier: effect.multiplier }] : []
    ));
  });
}

export function getTomorusaPerSecond(state: GameState): number {
  return FACILITY_ORDER.reduce((total, facilityId) => total + getFacilityTomorusaPerSecond(state, facilityId), 0);
}

export function getManualTomorusaGain(state: GameState): number {
  return 1 + getManualGainBonus(getPurchasedContentEffects(state), TOMORUSA_RESOURCE_ID);
}

export function getOfflineRewardMultiplier(state: GameState): number {
  return getOfflineRewardMultiplierFromEffects(getPurchasedContentEffects(state));
}

export function getPurchasedContentEffects(state: GameState): Effect[] {
  return [
    ...getPurchasedSongEffects(state),
    ...getPurchasedItemEffects(state)
  ];
}

export function getUnlockedIdolPassiveEffects(state: GameState): Effect[] {
  return IDOL_ORDER.flatMap((idolId) => (isIdolUnlocked(state, idolId) ? IDOLS[idolId].passiveEffects : []));
}

function getPurchasedSongEffects(state: GameState): Effect[] {
  return SONG_ORDER.flatMap((songId) => (isSongPurchased(state, songId) ? SONGS[songId].effects : []));
}

function getPurchasedItemEffects(state: GameState): Effect[] {
  return ITEM_ORDER.flatMap((itemId) => (isItemPurchased(state, itemId) ? ITEMS[itemId].effects : []));
}

export function getOfflineTomorusa(state: GameState, offlineSeconds: number): number {
  return getTomorusaPerSecond(state) * getCappedOfflineSeconds(offlineSeconds) * getEffectiveOfflineRewardRate(state);
}

export function getEffectiveOfflineRewardRate(state: GameState): number {
  return BASE_OFFLINE_REWARD_RATE * getOfflineRewardMultiplier(state);
}

export function gainManualTomorusa(state: GameState): GameState {
  return addResource(state, TOMORUSA_RESOURCE_ID, getManualTomorusaGain(state));
}

export function gainActiveIdolBond(state: GameState, amount = 1): GameState {
  if (!Number.isFinite(amount) || amount <= 0) {
    return state;
  }

  const activeIdolId = resolveActiveIdolId(state);
  const currentIdolState = state.idols[activeIdolId] ?? {
    bond: 0,
    eventIdsRead: []
  };

  return {
    ...state,
    activeIdolId,
    idols: {
      ...state.idols,
      [activeIdolId]: {
        ...currentIdolState,
        bond: currentIdolState.bond + Math.floor(amount)
      }
    }
  };
}

export function performManualLive(state: GameState): GameState {
  return gainActiveIdolBond(gainManualTomorusa(state));
}

export function applyProduction(state: GameState, elapsedSeconds: number): GameState {
  if (elapsedSeconds <= 0) {
    return state;
  }

  return addResource(state, TOMORUSA_RESOURCE_ID, getTomorusaPerSecond(state) * elapsedSeconds);
}

export function getCappedOfflineSeconds(offlineSeconds: number): number {
  return Math.max(0, Math.min(offlineSeconds, MAX_OFFLINE_SECONDS));
}

export function purchaseSong(state: GameState, songId: SongId): PurchaseSongResult {
  const song = SONGS[songId];

  if (!isSongUnlocked(state, songId)) {
    return { purchased: false, cost: song.cost, songId, state, reason: "locked" };
  }

  if (isSongPurchased(state, songId)) {
    return { purchased: false, cost: song.cost, songId, state, reason: "alreadyPurchased" };
  }

  if (!canSpendResource(state, TOMORUSA_RESOURCE_ID, song.cost)) {
    return { purchased: false, cost: song.cost, songId, state, reason: "notEnoughLights" };
  }

  const paidState = spendResource(state, TOMORUSA_RESOURCE_ID, song.cost);

  return {
    purchased: true,
    cost: song.cost,
    songId,
    state: {
      ...paidState,
      songs: {
        ...paidState.songs,
        [songId]: {
          purchased: true
        }
      }
    }
  };
}

export function purchaseItem(state: GameState, itemId: ItemId): PurchaseItemResult {
  const item = ITEMS[itemId];

  if (!isItemUnlocked(state, itemId)) {
    return { purchased: false, cost: item.cost, itemId, state, reason: "locked" };
  }

  if (isItemPurchased(state, itemId)) {
    return { purchased: false, cost: item.cost, itemId, state, reason: "alreadyPurchased" };
  }

  if (!canSpendResource(state, TOMORUSA_RESOURCE_ID, item.cost)) {
    return { purchased: false, cost: item.cost, itemId, state, reason: "notEnoughLights" };
  }

  const paidState = spendResource(state, TOMORUSA_RESOURCE_ID, item.cost);

  return {
    purchased: true,
    cost: item.cost,
    itemId,
    state: {
      ...paidState,
      items: {
        ...paidState.items,
        [itemId]: {
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

  if (!canSpendResource(state, TOMORUSA_RESOURCE_ID, cost)) {
    return { upgraded: false, cost, facilityId, state, reason: "notEnoughLights" };
  }

  const paidState = spendResource(state, TOMORUSA_RESOURCE_ID, cost);

  return {
    upgraded: true,
    cost,
    facilityId,
    state: {
      ...paidState,
      facilities: {
        ...paidState.facilities,
        [facilityId]: {
          level: getFacilityLevel(state, facilityId) + 1
        }
      }
    }
  };
}
