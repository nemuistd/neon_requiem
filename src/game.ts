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
  MEGURI_BUFF_ORDER,
  MEGURI_BUFFS,
  MeguriBuffId,
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
  getBondRateMultiplierFromEffects,
  getFacilityProductionMultiplierFromEffects,
  getItemCostMultiplierFromEffects,
  getManualGainBonus,
  getManualGainProductionRatio,
  getMemoryFragmentMultiplierFromEffects,
  getOfflineRewardMultiplierFromEffects,
  getRebirthBonusMultiplierFromEffects,
  getSongCostMultiplierFromEffects
} from "./engine/effects";
import { areRequirementsMet, isRequirementMet } from "./engine/requirements";

export const SAVE_VERSION = 10;
export const INITIAL_ACTIVE_IDOL_ID: IdolId = "otowaAkari";
export const MAX_OFFLINE_SECONDS = 12 * 60 * 60;
export const BASE_OFFLINE_REWARD_RATE = 0.5;
export const TOMORUSA_RESOURCE_ID: ResourceId = "tomorusa";
export const MEMORY_FRAGMENT_RESOURCE_ID: ResourceId = "memoryFragment";
export const MEGURI_MEMORY_FRAGMENT_TOMORUSA_SCALE = 20000;
export const MEGURI_RECOGNITION_BOND_THRESHOLD = 20;

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
  unlocked: boolean;
  read: boolean;
  annotationRead: boolean;
};

export type IdolState = {
  bond: number;
  eventIdsRead: string[];
};

export type MeguriBuffState = {
  purchased: boolean;
};

export type MeguriState = {
  count: number;
  totalMemoryFragmentsEarned: number;
  buffs: Record<MeguriBuffId, MeguriBuffState>;
  idolRecognition: Record<IdolId, boolean>;
  pendingSettlement: boolean;
};

export type GameState = {
  saveVersion: typeof SAVE_VERSION;
  resources: Record<ResourceId, number>;
  totalTomorusaEarned: number;
  activeIdolId: IdolId;
  recordTabLastSeenContentVersion: number;
  facilities: Record<FacilityId, FacilityState>;
  idols: Record<IdolId, IdolState>;
  items: Record<ItemId, ItemState>;
  songs: Record<SongId, SongState>;
  records: Record<RecordId, RecordState>;
  meguri: MeguriState;
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

export type PurchaseMeguriBuffResult =
  | { purchased: true; cost: number; buffId: MeguriBuffId; state: GameState }
  | {
      purchased: false;
      cost: number;
      buffId: MeguriBuffId;
      state: GameState;
      reason: "notInSettlement" | "notEnoughFragments" | "alreadyPurchased";
    };

export type MeguriSettlementPreview = {
  totalEligibleMemoryFragments: number;
  memoryFragmentsAwarded: number;
  memoryFragmentMultiplier: number;
};

export type PerformMeguriResult =
  | { performed: true; preview: MeguriSettlementPreview; state: GameState }
  | { performed: false; preview: MeguriSettlementPreview; state: GameState; reason: "locked" };

export type FacilityMultiplierEffect = {
  idolId: IdolId;
  multiplier: number;
};

export function createInitialState(now = Date.now()): GameState {
  return {
    saveVersion: SAVE_VERSION,
    resources: createInitialResources(),
    totalTomorusaEarned: 0,
    activeIdolId: INITIAL_ACTIVE_IDOL_ID,
    recordTabLastSeenContentVersion: 0,
    facilities: createInitialFacilities(),
    idols: createInitialIdols(),
    items: createInitialItems(),
    songs: createInitialSongs(),
    records: createInitialRecords(),
    meguri: createInitialMeguri(),
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

export function createInitialMeguri(): MeguriState {
  return {
    count: 0,
    totalMemoryFragmentsEarned: 0,
    buffs: createInitialMeguriBuffs(),
    idolRecognition: createInitialIdolRecognition(),
    pendingSettlement: false
  };
}

export function createInitialMeguriBuffs(): Record<MeguriBuffId, MeguriBuffState> {
  return MEGURI_BUFF_ORDER.reduce(
    (buffs, buffId) => ({
      ...buffs,
      [buffId]: { purchased: false }
    }),
    {} as Record<MeguriBuffId, MeguriBuffState>
  );
}

export function createInitialIdolRecognition(): Record<IdolId, boolean> {
  return IDOL_ORDER.reduce(
    (recognition, idolId) => ({
      ...recognition,
      [idolId]: false
    }),
    {} as Record<IdolId, boolean>
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
      [recordId]: { unlocked: false, read: false, annotationRead: false }
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
    totalTomorusaEarned: resourceId === TOMORUSA_RESOURCE_ID
      ? state.totalTomorusaEarned + amount
      : state.totalTomorusaEarned,
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

function getDiscountedCost(baseCost: number, multiplier: number): number {
  return Math.max(1, Math.floor(baseCost * multiplier));
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

export function isRecordAnnotationUnlocked(state: GameState, recordId: RecordId): boolean {
  const record = RECORDS[recordId];

  return Boolean(record.bodyAnnotation && isRecordUnlocked(state, recordId) && isRequirementMet(state, record.annotationRequirement));
}

export function isRecordAnnotationRead(state: GameState, recordId: RecordId): boolean {
  return state.records[recordId]?.annotationRead ?? false;
}

export function hasUnreadRecordContent(state: GameState, recordId: RecordId): boolean {
  return isRecordUnlocked(state, recordId) && (
    !isRecordRead(state, recordId) ||
    (isRecordAnnotationUnlocked(state, recordId) && !isRecordAnnotationRead(state, recordId))
  );
}

export function getIdolBond(state: GameState, idolId: IdolId): number {
  return state.idols[idolId]?.bond ?? 0;
}

export function hasIdolRecognition(state: GameState, idolId: IdolId): boolean {
  return state.meguri.idolRecognition[idolId] === true;
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
  return state.records[recordId]?.unlocked === true || areRequirementsMet(state, RECORDS[recordId].unlockRequirements);
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

  return getFacilityBaseTomorusaPerSecond(state, facilityId) * getFacilityProductionMultiplier(state, facilityId);
}

export function getFacilityBaseTomorusaPerSecond(state: GameState, facilityId: FacilityId): number {
  return getFacilityLevel(state, facilityId) * (FACILITIES[facilityId].productionPerLevel ?? 0);
}

export function getFacilityProductionMultiplier(state: GameState, facilityId?: FacilityId): number {
  const facilityTags = facilityId ? FACILITIES[facilityId].tags ?? [] : [];

  return getFacilityProductionMultiplierFromEffects(getGameplayEffects(state), facilityTags) * getMeguriFacilityProductionMultiplier(state);
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
  const effects = getGameplayEffects(state);
  const flatBonus = getManualGainBonus(effects, TOMORUSA_RESOURCE_ID);
  const productionRatioBonus = getTomorusaPerSecond(state) * getManualGainProductionRatio(effects);

  return 1 + flatBonus + productionRatioBonus;
}

export function getOfflineRewardMultiplier(state: GameState): number {
  return getOfflineRewardMultiplierFromEffects(getGameplayEffects(state));
}

export function getSongCost(state: GameState, songId: SongId): number {
  return getDiscountedCost(SONGS[songId].cost, getSongCostMultiplierFromEffects(getGameplayEffects(state)));
}

export function getItemCost(state: GameState, itemId: ItemId): number {
  return getDiscountedCost(ITEMS[itemId].cost, getItemCostMultiplierFromEffects(getGameplayEffects(state)));
}

export function getBondGainAmount(state: GameState, baseAmount = 1): number {
  return baseAmount * getBondRateMultiplierFromEffects(getGameplayEffects(state));
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

export function getGameplayEffects(state: GameState): Effect[] {
  return [
    ...getUnlockedIdolPassiveEffects(state),
    ...getPurchasedContentEffects(state),
    ...getPurchasedMeguriBuffEffects(state)
  ];
}

export function getPurchasedMeguriBuffEffects(state: GameState): Effect[] {
  return MEGURI_BUFF_ORDER.flatMap((buffId) => (isMeguriBuffPurchased(state, buffId) ? MEGURI_BUFFS[buffId].effects : []));
}

export function isMeguriBuffPurchased(state: GameState, buffId: MeguriBuffId): boolean {
  return state.meguri.buffs[buffId]?.purchased ?? false;
}

export function getMeguriFacilityProductionMultiplier(state: GameState): number {
  if (state.meguri.count <= 0) {
    return 1;
  }

  const baseMultiplier = 1 + 0.05 * state.meguri.count;
  return baseMultiplier * getRebirthBonusMultiplierFromEffects(getPurchasedMeguriBuffEffects(state));
}

export function getMemoryFragmentMultiplier(state: GameState): number {
  return getMemoryFragmentMultiplierFromEffects(getPurchasedMeguriBuffEffects(state));
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
        bond: currentIdolState.bond + getBondGainAmount(state, amount)
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
  const cost = getSongCost(state, songId);

  if (!isSongUnlocked(state, songId)) {
    return { purchased: false, cost, songId, state, reason: "locked" };
  }

  if (isSongPurchased(state, songId)) {
    return { purchased: false, cost, songId, state, reason: "alreadyPurchased" };
  }

  if (!canSpendResource(state, TOMORUSA_RESOURCE_ID, cost)) {
    return { purchased: false, cost, songId, state, reason: "notEnoughLights" };
  }

  const paidState = spendResource(state, TOMORUSA_RESOURCE_ID, cost);

  return {
    purchased: true,
    cost,
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
  const cost = getItemCost(state, itemId);

  if (!isItemUnlocked(state, itemId)) {
    return { purchased: false, cost, itemId, state, reason: "locked" };
  }

  if (isItemPurchased(state, itemId)) {
    return { purchased: false, cost, itemId, state, reason: "alreadyPurchased" };
  }

  if (!canSpendResource(state, TOMORUSA_RESOURCE_ID, cost)) {
    return { purchased: false, cost, itemId, state, reason: "notEnoughLights" };
  }

  const paidState = spendResource(state, TOMORUSA_RESOURCE_ID, cost);

  return {
    purchased: true,
    cost,
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
  const annotationUnlocked = isRecordAnnotationUnlocked(state, recordId);

  if (!isRecordUnlocked(state, recordId) || (isRecordRead(state, recordId) && (!annotationUnlocked || isRecordAnnotationRead(state, recordId)))) {
    return state;
  }

  return {
    ...state,
    records: {
      ...state.records,
      [recordId]: {
        ...state.records[recordId],
        read: true,
        annotationRead: annotationUnlocked ? true : state.records[recordId]?.annotationRead ?? false
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

export function isMeguriTabUnlocked(state: GameState): boolean {
  return state.meguri.count > 0 || isFacilityUnlocked(state, "restabilizationCore");
}

export function isMeguriAvailable(state: GameState): boolean {
  return getFacilityLevel(state, "restabilizationCore") >= 1;
}

export function calculateMeguriMemoryFragmentSettlement(
  totalTomorusaEarned: number,
  totalMemoryFragmentsEarned: number,
  memoryFragmentMultiplier: number
): MeguriSettlementPreview {
  const safeTotalTomorusaEarned = Math.max(0, totalTomorusaEarned);
  const safeTotalMemoryFragmentsEarned = Math.max(0, Math.floor(totalMemoryFragmentsEarned));
  const safeMultiplier = Number.isFinite(memoryFragmentMultiplier) && memoryFragmentMultiplier > 0 ? memoryFragmentMultiplier : 1;
  const totalEligibleMemoryFragments = Math.max(
    0,
    Math.floor(Math.sqrt(safeTotalTomorusaEarned / MEGURI_MEMORY_FRAGMENT_TOMORUSA_SCALE) * safeMultiplier)
  );

  return {
    totalEligibleMemoryFragments,
    memoryFragmentsAwarded: Math.max(0, totalEligibleMemoryFragments - safeTotalMemoryFragmentsEarned),
    memoryFragmentMultiplier: safeMultiplier
  };
}

export function getMeguriSettlementPreview(state: GameState): MeguriSettlementPreview {
  return calculateMeguriMemoryFragmentSettlement(
    state.totalTomorusaEarned,
    state.meguri.totalMemoryFragmentsEarned,
    getMemoryFragmentMultiplier(state)
  );
}

export function performMeguri(state: GameState): PerformMeguriResult {
  const preview = getMeguriSettlementPreview(state);

  if (!isMeguriAvailable(state)) {
    return {
      performed: false,
      preview,
      state,
      reason: "locked"
    };
  }

  const nextMemoryFragments = getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID) + preview.memoryFragmentsAwarded;

  return {
    performed: true,
    preview,
    state: {
      ...state,
      resources: {
        ...createInitialResources(),
        [MEMORY_FRAGMENT_RESOURCE_ID]: nextMemoryFragments
      },
      activeIdolId: INITIAL_ACTIVE_IDOL_ID,
      recordTabLastSeenContentVersion: 0,
      facilities: createInitialFacilities(),
      idols: createInitialIdols(),
      items: createInitialItems(),
      songs: createInitialSongs(),
      records: createMeguriRecords(state),
      meguri: {
        ...state.meguri,
        count: state.meguri.count + 1,
        totalMemoryFragmentsEarned: state.meguri.totalMemoryFragmentsEarned + preview.memoryFragmentsAwarded,
        idolRecognition: createMeguriRecognition(state),
        pendingSettlement: true
      }
    }
  };
}

export function createMeguriRecords(state: GameState): Record<RecordId, RecordState> {
  return RECORD_ORDER.reduce(
    (records, recordId) => ({
      ...records,
      [recordId]: {
        ...state.records[recordId],
        unlocked: isRecordUnlocked(state, recordId)
      }
    }),
    createInitialRecords()
  );
}

export function createMeguriRecognition(state: GameState): Record<IdolId, boolean> {
  return IDOL_ORDER.reduce(
    (recognition, idolId) => ({
      ...recognition,
      [idolId]: state.meguri.idolRecognition[idolId] === true || getIdolBond(state, idolId) >= MEGURI_RECOGNITION_BOND_THRESHOLD
    }),
    createInitialIdolRecognition()
  );
}

export function closeMeguriSettlement(state: GameState): GameState {
  if (!state.meguri.pendingSettlement) {
    return state;
  }

  return {
    ...state,
    meguri: {
      ...state.meguri,
      pendingSettlement: false
    }
  };
}

export function purchaseMeguriBuff(state: GameState, buffId: MeguriBuffId): PurchaseMeguriBuffResult {
  const cost = MEGURI_BUFFS[buffId].cost;

  if (isMeguriBuffPurchased(state, buffId)) {
    return { purchased: false, cost, buffId, state, reason: "alreadyPurchased" };
  }

  if (!state.meguri.pendingSettlement) {
    return { purchased: false, cost, buffId, state, reason: "notInSettlement" };
  }

  if (!canSpendResource(state, MEMORY_FRAGMENT_RESOURCE_ID, cost)) {
    return { purchased: false, cost, buffId, state, reason: "notEnoughFragments" };
  }

  const paidState = spendResource(state, MEMORY_FRAGMENT_RESOURCE_ID, cost);

  return {
    purchased: true,
    cost,
    buffId,
    state: {
      ...paidState,
      meguri: {
        ...paidState.meguri,
        buffs: {
          ...paidState.meguri.buffs,
          [buffId]: { purchased: true }
        }
      }
    }
  };
}
