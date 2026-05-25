import { describe, expect, it } from "vitest";
import {
  addResource,
  applyProduction,
  BASE_OFFLINE_REWARD_RATE,
  canSpendResource,
  createInitialIdols,
  createInitialState,
  gainManualTomorusa,
  getBondGainAmount,
  getIdolBond,
  getFacilityTomorusaPerSecond,
  getFacilityLevel,
  getItemCost,
  getJoinedIdolPassiveEffects,
  getManualTomorusaGain,
  getMeguriSettlementPreview,
  getOfflineRewardMultiplier,
  getOfflineTomorusa,
  getResourceAmount,
  getSongCost,
  getTomorusaPerSecond,
  isFacilityUnlocked,
  isIdolEventRead,
  isIdolEventUnlocked,
  isIdolJoined,
  isIdolUnlocked,
  isRecordRead,
  isRecordUnlocked,
  joinIdol,
  performManualLive,
  purchaseItem,
  purchaseSong,
  readIdolEvent,
  readRecord,
  SAVE_VERSION,
  selectActiveIdol,
  spendResource,
  TOMORUSA_RESOURCE_ID,
  upgradeFacility
} from "./game";
import {
  getBondRateMultiplierFromEffects,
  getFacilityProductionMultiplierFromEffects,
  getItemCostMultiplierFromEffects,
  getManualGainProductionRatio,
  getSongCostMultiplierFromEffects
} from "./engine/effects";
import { areRequirementsMet, isRequirementMet } from "./engine/requirements";
import { IDOL_ORDER, IdolId } from "./definitions";
import { validateRequirement } from "./contentValidation";
import { loadGame, SAVE_KEY } from "./storage";

describe("resource helpers", () => {
  it("adds, checks, and spends tomorusa without mutating the original state", () => {
    const initialState = createInitialState(1000);
    const stateWithResource = addResource(initialState, TOMORUSA_RESOURCE_ID, 25);
    const spentState = spendResource(stateWithResource, TOMORUSA_RESOURCE_ID, 10);

    expect(getResourceAmount(initialState, TOMORUSA_RESOURCE_ID)).toBe(0);
    expect(getResourceAmount(stateWithResource, TOMORUSA_RESOURCE_ID)).toBe(25);
    expect(canSpendResource(stateWithResource, TOMORUSA_RESOURCE_ID, 25)).toBe(true);
    expect(canSpendResource(stateWithResource, TOMORUSA_RESOURCE_ID, 26)).toBe(false);
    expect(getResourceAmount(spentState, TOMORUSA_RESOURCE_ID)).toBe(15);

    expect(addResource(spentState, TOMORUSA_RESOURCE_ID, 0)).toBe(spentState);
    expect(addResource(spentState, TOMORUSA_RESOURCE_ID, -5)).toBe(spentState);
  });
});

describe("requirement evaluation", () => {
  const state = {
    facilities: {
      alleyStage: { level: 5 }
    },
    resources: {
      tomorusa: 100
    },
    songs: {
      rojiuraIntro: { purchased: true }
    },
    idols: {
      otowaAkari: { bond: 5 },
      asagiriYui: { bond: 1 }
    }
  };

  it("evaluates facility, song, resource, and logical requirements", () => {
    expect(isRequirementMet(state, { type: "facility.level", facilityId: "alleyStage", level: 5 })).toBe(true);
    expect(isRequirementMet(state, { type: "facility.level", facilityId: "alleyStage", level: 6 })).toBe(false);
    expect(isRequirementMet(state, { type: "song.purchased", songId: "rojiuraIntro" })).toBe(true);
    expect(isRequirementMet(state, { type: "resource.amount", resourceId: "tomorusa", amount: 100 })).toBe(true);
    expect(isRequirementMet(state, { type: "idol.bond", idolId: "otowaAkari", amount: 5 })).toBe(true);
    expect(isRequirementMet(state, { type: "idol.bond", idolId: "otowaAkari", amount: 6 })).toBe(false);
    expect(isRequirementMet(state, {
      type: "all",
      requirements: [
        { type: "facility.level", facilityId: "alleyStage", level: 5 },
        { type: "song.purchased", songId: "rojiuraIntro" },
        { type: "idol.bond", idolId: "otowaAkari", amount: 5 }
      ]
    })).toBe(true);
    expect(isRequirementMet(state, {
      type: "any",
      requirements: [
        { type: "facility.level", facilityId: "alleyStage", level: 6 },
        { type: "idol.bond", idolId: "otowaAkari", amount: 6 },
        { type: "resource.amount", resourceId: "tomorusa", amount: 50 }
      ]
    })).toBe(true);
    expect(isRequirementMet(state, {
      type: "not",
      requirement: { type: "idol.bond", idolId: "otowaAkari", amount: 6 }
    })).toBe(true);
    expect(areRequirementsMet(state, [
      { type: "facility.level", facilityId: "alleyStage", level: 5 },
      { type: "resource.amount", resourceId: "tomorusa", amount: 100 },
      { type: "idol.bond", idolId: "otowaAkari", amount: 5 }
    ])).toBe(true);
  });
});

describe("content validation", () => {
  it("detects invalid idol bond requirement references", () => {
    expect(validateRequirement("test", { type: "idol.bond", idolId: "missingIdol", amount: 1 })).toContain(
      'test: requirement references missing idol "missingIdol".'
    );
    expect(validateRequirement("test", { type: "idol.bond", idolId: "otowaAkari", amount: 0 })).toContain(
      "test: requirement idol bond amount must be positive."
    );
  });
});

describe("game state and effects", () => {
  it("creates a complete initial state", () => {
    const state = createInitialState(1234);

    expect(state.saveVersion).toBe(SAVE_VERSION);
    expect(state.lastSavedAt).toBe(1234);
    expect(state.activeIdolId).toBe("otowaAkari");
    expect(getResourceAmount(state, TOMORUSA_RESOURCE_ID)).toBe(0);
    expect(state.facilities.alleyStage.level).toBe(0);
    expect(state.facilities.neonBoard.level).toBe(0);
    expect(state.facilities.twilightPathGuide.level).toBe(0);
    expect(state.facilities.temporaryBroadcastBooth.level).toBe(0);
    expect(state.facilities.memoryLibrary.level).toBe(0);
    expect(state.facilities.recordingStorage.level).toBe(0);
    expect(state.facilities.oldBroadcastRoom.level).toBe(0);
    expect(state.facilities.undergroundPlaza.level).toBe(0);
    expect(state.facilities.nameRecordWall.level).toBe(0);
    expect(state.facilities.undergroundChapel.level).toBe(0);
    expect(state.facilities.undergroundPassageRepair.level).toBe(0);
    expect(state.facilities.restabilizationCore.level).toBe(0);
    expect(state.facilities.deepLayerObservatory.level).toBe(0);
    expect(state.facilities.engineeringArchive.level).toBe(0);
    expect(state.facilities.prayerEngineeringRuins.level).toBe(0);
    expect(state.facilities.reobservationBase.level).toBe(0);
    expect(state.facilities.unnamedTheater.level).toBe(0);
    expect(state.items.oldNeonTube.purchased).toBe(false);
    expect(state.items.ticketStubBundle.purchased).toBe(false);
    expect(state.items.oldRadioTowerDebris.purchased).toBe(false);
    expect(state.items.fadedBookLabel.purchased).toBe(false);
    expect(state.items.broadcastEquipmentManual.purchased).toBe(false);
    expect(state.items.repairToolSet.purchased).toBe(false);
    expect(state.idols.otowaAkari.bond).toBe(0);
    expect(state.idols.otowaAkari.joined).toBe(true);
    expect(state.idols.hibikiTooko.bond).toBe(0);
    expect(state.idols.kaminoMeguri.bond).toBe(0);
    expect(state.idols.hinataKoharu.bond).toBe(0);
    expect(state.idols.tsuginohataSakurako.bond).toBe(0);
    expect(state.idols.kasumiyamaMio.bond).toBe(0);
    expect(state.idols.nanashiroSatsuki.bond).toBe(0);
    expect(state.idols.shiragiriRin.bond).toBe(0);
    expect(state.idols.otowaAkari.eventIdsRead).toEqual([]);
    expect(state.songs.rojiuraIntro.purchased).toBe(false);
    expect(state.songs.prebroadcastAcapella.purchased).toBe(false);
    expect(state.songs.songOfRecords.purchased).toBe(false);
    expect(state.songs.plazaAnthem.purchased).toBe(false);
    expect(state.songs.restorationHumming.purchased).toBe(false);
    expect(state.records.alleyStageRestorationMemo.read).toBe(false);
    expect(getTomorusaPerSecond(state)).toBe(0);
  });

  it("creates initial idol state for every idol", () => {
    const idols = createInitialIdols();

    expect(Object.keys(idols)).toEqual(IDOL_ORDER);
    for (const idolId of IDOL_ORDER) {
      expect(idols[idolId]).toEqual({
        bond: 0,
        eventIdsRead: [],
        joined: idolId === "otowaAkari"
      });
    }
  });

  it("calculates early production from alley stage level and applies elapsed production", () => {
    const baseState = createInitialState();
    const state = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 1 }
      }
    };

    expect(getFacilityTomorusaPerSecond(state, "alleyStage")).toBeCloseTo(0.12);
    expect(getTomorusaPerSecond(state)).toBeCloseTo(0.12);

    const producedState = applyProduction(state, 10);
    expect(getResourceAmount(producedState, TOMORUSA_RESOURCE_ID)).toBeCloseTo(1.2);
  });

  it("applies manual gain effects from purchased songs and items", () => {
    const baseState = createInitialState();
    const progressedState = {
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 500),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 5 }
      }
    };
    const songResult = purchaseSong(progressedState, "rojiuraIntro");
    const ticketResult = purchaseItem(songResult.state, "ticketStubBundle");
    const itemResult = purchaseItem(ticketResult.state, "handwrittenPoster");

    expect(songResult.purchased).toBe(true);
    expect(ticketResult.purchased).toBe(true);
    expect(itemResult.purchased).toBe(true);
    expect(getManualTomorusaGain(itemResult.state)).toBe(4);

    const gainedState = gainManualTomorusa(itemResult.state);
    expect(getResourceAmount(gainedState, TOMORUSA_RESOURCE_ID)).toBe(getResourceAmount(itemResult.state, TOMORUSA_RESOURCE_ID) + 4);
  });

  it("applies expanded effect helpers for future fiction content", () => {
    const effects = [
      { type: "manual.gain.add.production.ratio", ratio: 0.05 },
      { type: "facility.production.multiplier.tag", tag: "deep", multiplier: 1.25 },
      { type: "bond.rate.multiplier", multiplier: 1.1 },
      { type: "item.cost.multiplier", multiplier: 0.9 },
      { type: "song.cost.multiplier", multiplier: 0.85 }
    ] as const;

    expect(getManualGainProductionRatio([...effects])).toBeCloseTo(0.05);
    expect(getFacilityProductionMultiplierFromEffects([...effects], ["deep"])).toBeCloseTo(1.25);
    expect(getFacilityProductionMultiplierFromEffects([...effects], ["infra"])).toBeCloseTo(1);
    expect(getBondRateMultiplierFromEffects([...effects])).toBeCloseTo(1.1);
    expect(getItemCostMultiplierFromEffects([...effects])).toBeCloseTo(0.9);
    expect(getSongCostMultiplierFromEffects([...effects])).toBeCloseTo(0.85);
  });

  it("adds bond to Otowa Akari when performing a manual live from the initial state", () => {
    const baseState = createInitialState();
    const liveState = performManualLive(baseState);

    expect(getResourceAmount(liveState, TOMORUSA_RESOURCE_ID)).toBe(getResourceAmount(baseState, TOMORUSA_RESOURCE_ID) + getManualTomorusaGain(baseState));
    expect(getIdolBond(liveState, "otowaAkari")).toBe(1);
    expect(getIdolBond(liveState, "asagiriYui")).toBe(0);
    expect(getIdolBond(liveState, "mizukiShino")).toBe(0);
  });

  it("adds bond to the selected joined idol when performing a manual live", () => {
    const baseState = createInitialState();
    const unlockedState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };
    const joinedState = withJoinedIdols(unlockedState, ["asagiriYui"]);
    const selectedState = selectActiveIdol(joinedState, "asagiriYui");
    const liveState = performManualLive(selectedState);

    expect(selectedState.activeIdolId).toBe("asagiriYui");
    expect(getIdolBond(liveState, "otowaAkari")).toBe(0);
    expect(getIdolBond(liveState, "asagiriYui")).toBe(1);
    expect(getResourceAmount(liveState, TOMORUSA_RESOURCE_ID)).toBe(getResourceAmount(selectedState, TOMORUSA_RESOURCE_ID) + getManualTomorusaGain(selectedState));
  });

  it("requires an active join action before idol effects and selection apply", () => {
    const baseState = createInitialState();
    const yuiUnlockedState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };

    expect(isIdolUnlocked(yuiUnlockedState, "asagiriYui")).toBe(true);
    expect(isIdolJoined(yuiUnlockedState, "asagiriYui")).toBe(false);
    expect(getJoinedIdolPassiveEffects(yuiUnlockedState)).toEqual([
      { type: "facility.production.multiplier", multiplier: 1.2 }
    ]);
    expect(selectActiveIdol(yuiUnlockedState, "asagiriYui").activeIdolId).toBe("otowaAkari");

    const joinResult = joinIdol(yuiUnlockedState, "asagiriYui");

    expect(joinResult.joined).toBe(true);

    if (!joinResult.joined) {
      return;
    }

    expect(joinResult.state.activeIdolId).toBe("asagiriYui");
    expect(isIdolJoined(joinResult.state, "asagiriYui")).toBe(true);
    expect(getJoinedIdolPassiveEffects(joinResult.state)).toEqual([
      { type: "facility.production.multiplier", multiplier: 1.2 },
      { type: "facility.production.multiplier", multiplier: 1.15 }
    ]);
  });

  it("reports the default bond gain before bond multipliers are purchased or unlocked", () => {
    const baseState = createInitialState();

    expect(getBondGainAmount(baseState)).toBe(1);
  });

  it("resolves locked active idol before adding live bond", () => {
    const baseState = createInitialState();
    const invalidActiveState = {
      ...baseState,
      activeIdolId: "mizukiShino" as const
    };
    const liveState = performManualLive(invalidActiveState);

    expect(liveState.activeIdolId).toBe("otowaAkari");
    expect(getIdolBond(liveState, "otowaAkari")).toBe(1);
    expect(getIdolBond(liveState, "mizukiShino")).toBe(0);
  });

  it("calculates facility production with idol, song, and item multipliers", () => {
    const baseState = createInitialState();
    const state = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 3 }
      },
      songs: {
        ...baseState.songs,
        chapelHarmony: { purchased: true }
      },
      items: {
        ...baseState.items,
        oldNeonTube: { purchased: true },
        portableSpotlight: { purchased: true },
        recordedGreeting: { purchased: true }
      }
    };
    const expectedMultiplier = 1.2 * 1.1 * 1.05 * 1.04 * 1.03;

    expect(getFacilityTomorusaPerSecond(state, "alleyStage")).toBeCloseTo(1 * expectedMultiplier);
    expect(getFacilityTomorusaPerSecond(state, "neonBoard")).toBeCloseTo(1.05 * expectedMultiplier);
    expect(getTomorusaPerSecond(state)).toBeCloseTo(2.05 * expectedMultiplier);
  });

  it("collects passive effects only from joined idols", () => {
    const baseState = createInitialState();
    const yuiUnlockedState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };

    const yuiJoinedState = withJoinedIdols(yuiUnlockedState, ["asagiriYui"]);

    expect(getJoinedIdolPassiveEffects(baseState)).toEqual([
      { type: "facility.production.multiplier", multiplier: 1.2 }
    ]);
    expect(getJoinedIdolPassiveEffects(yuiUnlockedState)).toEqual([
      { type: "facility.production.multiplier", multiplier: 1.2 }
    ]);
    expect(getJoinedIdolPassiveEffects(yuiJoinedState)).toEqual([
      { type: "facility.production.multiplier", multiplier: 1.2 },
      { type: "facility.production.multiplier", multiplier: 1.15 }
    ]);
  });

  it("applies v0.2 item effects after purchase", () => {
    const baseState = createInitialState();
    const progressedState = {
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 1000),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 6 },
        neonBoard: { level: 2 }
      }
    };

    const ticketResult = purchaseItem(progressedState, "ticketStubBundle");
    const spotlightResult = purchaseItem(ticketResult.state, "portableSpotlight");
    const noticeBoardResult = purchaseItem(spotlightResult.state, "shiftNoticeBoard");

    expect(ticketResult.purchased).toBe(true);
    expect(spotlightResult.purchased).toBe(true);
    expect(noticeBoardResult.purchased).toBe(true);
    expect(getManualTomorusaGain(noticeBoardResult.state)).toBe(2);
    expect(getFacilityTomorusaPerSecond(noticeBoardResult.state, "alleyStage")).toBeCloseTo(0.6 * 1.2 * 1.04);
    expect(getOfflineRewardMultiplier(noticeBoardResult.state)).toBeCloseTo(1.1);
  });

  it("unlocks Ch.3 facilities and applies their first song and items", () => {
    const baseState = createInitialState();
    const neonProgressState = {
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 25000),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };
    const guideProgressState = withJoinedIdols({
      ...neonProgressState,
      facilities: {
        ...neonProgressState.facilities,
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 3 }
      }
    }, ["asagiriYui", "hibikiTooko"]);

    expect(isFacilityUnlocked(neonProgressState, "twilightPathGuide")).toBe(true);
    expect(isFacilityUnlocked(neonProgressState, "temporaryBroadcastBooth")).toBe(false);
    expect(isFacilityUnlocked(guideProgressState, "temporaryBroadcastBooth")).toBe(true);
    expect(isIdolUnlocked(guideProgressState, "hibikiTooko")).toBe(true);
    expect(getSongCost(guideProgressState, "prebroadcastAcapella")).toBe(6000);
    expect(getItemCost(guideProgressState, "oldRadioTowerDebris")).toBe(3000);

    const radioResult = purchaseItem(guideProgressState, "oldRadioTowerDebris");
    const listenerResult = purchaseItem(radioResult.state, "handwrittenListenerLog");
    const songResult = purchaseSong(listenerResult.state, "prebroadcastAcapella");

    expect(radioResult.purchased).toBe(true);
    expect(listenerResult.purchased).toBe(true);
    expect(songResult.purchased).toBe(true);
    expect(getManualTomorusaGain(songResult.state)).toBeCloseTo(14 + getTomorusaPerSecond(songResult.state) * 0.05);
    expect(getFacilityTomorusaPerSecond(listenerResult.state, "temporaryBroadcastBooth")).toBeCloseTo(12 * 1.2 * 1.15 * 1.06);
  });

  it("unlocks the memory library, Meguri, and the first Ch.4 bond and song effects", () => {
    const baseState = createInitialState();
    const boothProgressState = {
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 60000),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 }
      }
    };
    const libraryProgressState = withJoinedIdols({
      ...boothProgressState,
      facilities: {
        ...boothProgressState.facilities,
        memoryLibrary: { level: 3 }
      }
    }, ["asagiriYui", "kaminoMeguri"]);

    expect(isFacilityUnlocked(boothProgressState, "memoryLibrary")).toBe(true);
    expect(isIdolUnlocked(libraryProgressState, "kaminoMeguri")).toBe(true);
    expect(isRecordUnlocked(libraryProgressState, "memoryLibraryOpeningReport")).toBe(true);
    expect(isRecordUnlocked(libraryProgressState, "unidentifiedRecordBundle")).toBe(true);
    expect(getBondGainAmount(libraryProgressState)).toBeCloseTo(1.25);
    expect(getItemCost(libraryProgressState, "fadedBookLabel")).toBe(10000);
    expect(getSongCost(libraryProgressState, "songOfRecords")).toBe(20000);

    const selectedState = selectActiveIdol(libraryProgressState, "kaminoMeguri");
    const labelResult = purchaseItem(selectedState, "fadedBookLabel");
    const songResult = purchaseSong(labelResult.state, "songOfRecords");
    const liveState = performManualLive(songResult.state);

    expect(labelResult.purchased).toBe(true);
    expect(songResult.purchased).toBe(true);
    expect(getBondGainAmount(labelResult.state)).toBeCloseTo(1.25 * 1.1);
    expect(getIdolBond(liveState, "kaminoMeguri")).toBeCloseTo(1.25 * 1.1);
    expect(getFacilityTomorusaPerSecond(songResult.state, "memoryLibrary")).toBeCloseTo(24 * 1.2 * 1.15 * 1.15);
  });

  it("unlocks recording storage, the old broadcast room, and applies the broadcast equipment manual", () => {
    const baseState = createInitialState();
    const libraryState = withJoinedIdols({
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 80000),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 2 },
        recordingStorage: { level: 2 },
        oldBroadcastRoom: { level: 1 }
      }
    }, ["asagiriYui"]);

    expect(isFacilityUnlocked(libraryState, "recordingStorage")).toBe(true);
    expect(isFacilityUnlocked(libraryState, "oldBroadcastRoom")).toBe(true);
    expect(getFacilityTomorusaPerSecond(libraryState, "recordingStorage")).toBeCloseTo(12 * 1.2 * 1.15);
    expect(getFacilityTomorusaPerSecond(libraryState, "oldBroadcastRoom")).toBeCloseTo(11 * 1.2 * 1.15);
    expect(getItemCost(libraryState, "broadcastEquipmentManual")).toBe(15000);
    expect(isRecordUnlocked(libraryState, "oldBroadcastRoomEquipmentCheck")).toBe(true);

    const manualResult = purchaseItem(libraryState, "broadcastEquipmentManual");

    expect(manualResult.purchased).toBe(true);
    expect(getOfflineRewardMultiplier(manualResult.state)).toBeCloseTo(1.1);
  });

  it("unlocks the underground plaza, Koharu, and applies plaza anthem scaling", () => {
    const baseState = createInitialState();
    const plazaState = withJoinedIdols({
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 120000),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 3 },
        recordingStorage: { level: 2 },
        oldBroadcastRoom: { level: 1 },
        undergroundPlaza: { level: 4 }
      }
    }, ["asagiriYui", "hibikiTooko", "hinataKoharu"]);
    const plazaBlockedState = {
      ...plazaState,
      facilities: {
        ...plazaState.facilities,
        oldBroadcastRoom: { level: 0 }
      }
    };

    expect(isFacilityUnlocked(plazaBlockedState, "undergroundPlaza")).toBe(false);
    expect(isFacilityUnlocked(plazaState, "undergroundPlaza")).toBe(true);
    expect(isIdolUnlocked(plazaState, "hinataKoharu")).toBe(true);
    expect(getItemCost(plazaState, "oldNeonTube")).toBe(90);
    expect(getSongCost(plazaState, "plazaAnthem")).toBe(30000);
    expect(isRecordUnlocked(plazaState, "undergroundPlazaFirstDay")).toBe(true);
    expect(isRecordUnlocked(plazaState, "koharuNameEffect")).toBe(true);
    expect(getFacilityTomorusaPerSecond(plazaState, "undergroundPlaza")).toBeCloseTo(40 * 1.2 * 1.15 * 1.08);

    const songResult = purchaseSong(plazaState, "plazaAnthem");

    expect(songResult.purchased).toBe(true);
    expect(getManualTomorusaGain(songResult.state)).toBeCloseTo(1 + getTomorusaPerSecond(songResult.state) * 0.13);
  });

  it("unlocks the name record wall after the plaza and reveals name records", () => {
    const baseState = createInitialState();
    const wallState = withJoinedIdols({
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 3 },
        recordingStorage: { level: 2 },
        oldBroadcastRoom: { level: 1 },
        undergroundPlaza: { level: 4 },
        nameRecordWall: { level: 3 }
      }
    }, ["asagiriYui", "hinataKoharu"]);

    expect(isFacilityUnlocked(wallState, "nameRecordWall")).toBe(true);
    expect(isRecordUnlocked(wallState, "nameRecordWallOpeningLog")).toBe(true);
    expect(isRecordUnlocked(wallState, "wallNameStabilityLog")).toBe(true);
    expect(isRecordUnlocked(wallState, "nameFixationObservation")).toBe(true);
    expect(getFacilityTomorusaPerSecond(wallState, "nameRecordWall")).toBeCloseTo(42 * 1.2 * 1.15 * 1.08);
  });

  it("unlocks chapel records without entering the meguri system", () => {
    const baseState = createInitialState();
    const chapelLevelTwoState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        undergroundChapel: { level: 2 }
      }
    };
    const chapelLevelFourState = {
      ...chapelLevelTwoState,
      facilities: {
        ...chapelLevelTwoState.facilities,
        undergroundChapel: { level: 4 }
      }
    };
    const chapelLevelFiveState = {
      ...chapelLevelFourState,
      facilities: {
        ...chapelLevelFourState.facilities,
        undergroundChapel: { level: 5 }
      }
    };
    const chapelLevelEightState = {
      ...chapelLevelFiveState,
      facilities: {
        ...chapelLevelFiveState.facilities,
        undergroundChapel: { level: 8 }
      }
    };
    const chapelSongState = {
      ...chapelLevelEightState,
      songs: {
        ...chapelLevelEightState.songs,
        chapelHarmony: { purchased: true }
      }
    };

    expect(isRecordUnlocked(chapelLevelTwoState, "observerCountFragment")).toBe(true);
    expect(isRecordUnlocked(chapelLevelTwoState, "chapelSecondShelfInvestigation")).toBe(true);
    expect(isRecordUnlocked(chapelLevelTwoState, "shinoDeletedRecordTrace")).toBe(false);
    expect(isRecordUnlocked(chapelLevelFourState, "shinoDeletedRecordTrace")).toBe(true);
    expect(isRecordUnlocked(chapelLevelFiveState, "songAndHymnDistinction")).toBe(false);
    expect(isRecordUnlocked(chapelSongState, "songAndHymnDistinction")).toBe(true);
    expect(isRecordUnlocked(chapelLevelEightState, "binderSealedLetterOpening")).toBe(false);
    expect(isRecordUnlocked(chapelSongState, "binderSealedLetterOpening")).toBe(true);
  });

  it("unlocks the passage repair area and Sakurako before entering the meguri system", () => {
    const baseState = createInitialState();
    const repairState = withJoinedIdols({
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 200000),
      facilities: {
        ...baseState.facilities,
        undergroundChapel: { level: 8 },
        undergroundPassageRepair: { level: 3 }
      },
      songs: {
        ...baseState.songs,
        chapelHarmony: { purchased: true }
      }
    }, ["mizukiShino", "tsuginohataSakurako"]);

    expect(isFacilityUnlocked(repairState, "undergroundPassageRepair")).toBe(true);
    expect(isIdolUnlocked(repairState, "tsuginohataSakurako")).toBe(true);
    expect(isRecordUnlocked(repairState, "sakurakoRemovedPartsReport")).toBe(true);
    expect(getOfflineRewardMultiplier(repairState)).toBeCloseTo(1.15);
    expect(getItemCost(repairState, "repairToolSet")).toBe(50000);
    expect(getSongCost(repairState, "restorationHumming")).toBe(80000);

    const itemResult = purchaseItem(repairState, "repairToolSet");
    const songResult = purchaseSong(itemResult.state, "restorationHumming");

    expect(itemResult.purchased).toBe(true);
    expect(songResult.purchased).toBe(true);
    expect(getFacilityTomorusaPerSecond(itemResult.state, "undergroundPassageRepair")).toBeCloseTo(60 * 1.2 * 1.1 * 1.1 * 1.08);
    expect(getOfflineRewardMultiplier(songResult.state)).toBeCloseTo(1.15 * 1.1);
  });

  it("unlocks the Ch.7 observatory and Mio only after the first meguri", () => {
    const baseState = createInitialState();
    const coreLevelThreeState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        restabilizationCore: { level: 3 }
      }
    };
    const postMeguriCoreState = {
      ...coreLevelThreeState,
      meguri: {
        ...coreLevelThreeState.meguri,
        count: 1
      }
    };
    const observatoryLevelOneState = {
      ...postMeguriCoreState,
      facilities: {
        ...postMeguriCoreState.facilities,
        deepLayerObservatory: { level: 1 }
      }
    };
    const observatoryLevelTwoState = {
      ...observatoryLevelOneState,
      facilities: {
        ...observatoryLevelOneState.facilities,
        deepLayerObservatory: { level: 2 }
      }
    };

    expect(isFacilityUnlocked(coreLevelThreeState, "deepLayerObservatory")).toBe(false);
    expect(isFacilityUnlocked(postMeguriCoreState, "deepLayerObservatory")).toBe(true);
    expect(isIdolUnlocked(postMeguriCoreState, "kasumiyamaMio")).toBe(false);
    expect(isIdolUnlocked(observatoryLevelOneState, "kasumiyamaMio")).toBe(true);
    expect(isRecordUnlocked(observatoryLevelOneState, "deepLayerObservatoryAnteroomReport")).toBe(true);
    expect(isRecordUnlocked(observatoryLevelOneState, "mioMistObservationLog")).toBe(false);
    expect(isRecordUnlocked(observatoryLevelTwoState, "mioMistObservationLog")).toBe(true);
  });

  it("applies Mio's deep facility multiplier only to deep facilities", () => {
    const baseState = createInitialState();
    const productionState = withJoinedIdols({
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        restabilizationCore: { level: 3 },
        deepLayerObservatory: { level: 2 }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    }, ["kasumiyamaMio"]);

    expect(getFacilityTomorusaPerSecond(productionState, "deepLayerObservatory")).toBeCloseTo(120 * 1.2 * 1.35 * 1.05);
    expect(getFacilityTomorusaPerSecond(productionState, "alleyStage")).toBeCloseTo(1 * 1.2 * 1.05);
  });

  it("unlocks the Ch.8 engineering areas and Satsuki after the Ch.7 observatory", () => {
    const baseState = createInitialState();
    const observatoryLevelFiveState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        restabilizationCore: { level: 3 },
        deepLayerObservatory: { level: 5 }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    };
    const archiveLevelTwoState = {
      ...observatoryLevelFiveState,
      facilities: {
        ...observatoryLevelFiveState.facilities,
        engineeringArchive: { level: 2 }
      }
    };
    const archiveLevelThreeState = {
      ...archiveLevelTwoState,
      facilities: {
        ...archiveLevelTwoState.facilities,
        engineeringArchive: { level: 3 }
      }
    };
    const archiveLevelFiveState = {
      ...archiveLevelThreeState,
      facilities: {
        ...archiveLevelThreeState.facilities,
        engineeringArchive: { level: 5 }
      }
    };
    const ruinsLevelOneState = {
      ...archiveLevelFiveState,
      facilities: {
        ...archiveLevelFiveState.facilities,
        prayerEngineeringRuins: { level: 1 }
      }
    };

    expect(isFacilityUnlocked(baseState, "engineeringArchive")).toBe(false);
    expect(isFacilityUnlocked(observatoryLevelFiveState, "engineeringArchive")).toBe(true);
    expect(isRecordUnlocked(archiveLevelTwoState, "prayerEngineeringRecordFragment")).toBe(true);
    expect(isIdolUnlocked(archiveLevelTwoState, "nanashiroSatsuki")).toBe(false);
    expect(isIdolUnlocked(archiveLevelThreeState, "nanashiroSatsuki")).toBe(true);
    expect(isFacilityUnlocked(archiveLevelFiveState, "prayerEngineeringRuins")).toBe(true);
    expect(isRecordUnlocked(ruinsLevelOneState, "experimentalRuinsFieldReport")).toBe(true);
  });

  it("applies Satsuki's song and item cost multipliers after she joins", () => {
    const baseState = createInitialState();
    const satsukiJoinedState = withJoinedIdols({
      ...baseState,
      facilities: {
        ...baseState.facilities,
        deepLayerObservatory: { level: 5 },
        engineeringArchive: { level: 3 }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    }, ["nanashiroSatsuki"]);

    expect(getSongCost(satsukiJoinedState, "rojiuraIntro")).toBe(68);
    expect(getItemCost(satsukiJoinedState, "oldNeonTube")).toBe(85);
  });

  it("unlocks the Ch.9 facilities and Rin only after the second meguri", () => {
    const baseState = createInitialState();
    const ruinsLevelThreeMeguriOneState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        prayerEngineeringRuins: { level: 3 }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    };
    const reobservationState = {
      ...ruinsLevelThreeMeguriOneState,
      meguri: {
        ...ruinsLevelThreeMeguriOneState.meguri,
        count: 2
      }
    };
    const unnamedTheaterReadyState = {
      ...reobservationState,
      facilities: {
        ...reobservationState.facilities,
        reobservationBase: { level: 3 }
      }
    };
    const rinReadyState = {
      ...unnamedTheaterReadyState,
      facilities: {
        ...unnamedTheaterReadyState.facilities,
        unnamedTheater: { level: 1 }
      }
    };

    expect(isFacilityUnlocked(ruinsLevelThreeMeguriOneState, "reobservationBase")).toBe(false);
    expect(isFacilityUnlocked(reobservationState, "reobservationBase")).toBe(true);
    expect(isFacilityUnlocked(unnamedTheaterReadyState, "unnamedTheater")).toBe(true);
    expect(isIdolUnlocked(unnamedTheaterReadyState, "shiragiriRin")).toBe(false);
    expect(isIdolUnlocked(rinReadyState, "shiragiriRin")).toBe(true);
    expect(isRecordUnlocked(rinReadyState, "unnamedTheaterEchoRecord")).toBe(true);
    expect(isRecordUnlocked(rinReadyState, "rinFirstWords")).toBe(true);
  });

  it("applies Rin's rebirth and memory fragment effects after she joins", () => {
    const baseState = createInitialState();
    const rinJoinedState = withJoinedIdols({
      ...baseState,
      totalTomorusaEarned: 200000,
      facilities: {
        ...baseState.facilities,
        prayerEngineeringRuins: { level: 3 },
        reobservationBase: { level: 1 },
        unnamedTheater: { level: 1 }
      },
      meguri: {
        ...baseState.meguri,
        count: 2
      }
    }, ["shiragiriRin"]);
    const preview = getMeguriSettlementPreview(rinJoinedState);

    expect(getFacilityTomorusaPerSecond(rinJoinedState, "reobservationBase")).toBeCloseTo(400 * 1.2 * 1.1 * 1.15);
    expect(preview.memoryFragmentMultiplier).toBeCloseTo(1.3);
    expect(preview.totalEligibleMemoryFragments).toBe(4);
  });

  it("applies production and caps offline reward at 12 hours", () => {
    const baseState = createInitialState();
    const state = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 }
      },
      items: {
        ...baseState.items,
        shiftNoticeBoard: { purchased: true }
      }
    };

    expect(getTomorusaPerSecond(state)).toBeCloseTo(1.2);
    expect(getOfflineRewardMultiplier(state)).toBeCloseTo(1.1);
    expect(BASE_OFFLINE_REWARD_RATE).toBe(0.5);
    expect(getOfflineTomorusa(state, 10)).toBeCloseTo(12 * 0.5 * 1.1);
    expect(getOfflineTomorusa(state, 13 * 60 * 60)).toBeCloseTo(1.2 * 12 * 60 * 60 * 0.5 * 1.1);

    const producedState = applyProduction(state, 5);
    expect(getResourceAmount(producedState, TOMORUSA_RESOURCE_ID)).toBeCloseTo(6);
    expect(getIdolBond(producedState, "otowaAkari")).toBe(0);
  });

  it("spends tomorusa and upgrades unlocked facilities", () => {
    const baseState = createInitialState();
    const unfundedResult = upgradeFacility(baseState, "alleyStage");
    const fundedState = addResource(baseState, TOMORUSA_RESOURCE_ID, 10);
    const result = upgradeFacility(fundedState, "alleyStage");

    expect(unfundedResult.upgraded).toBe(false);
    if (!unfundedResult.upgraded) {
      expect(unfundedResult.reason).toBe("notEnoughLights");
    }
    expect(result.upgraded).toBe(true);
    expect(result.cost).toBe(10);
    expect(result.state.facilities.alleyStage.level).toBe(1);
    expect(getResourceAmount(result.state, TOMORUSA_RESOURCE_ID)).toBe(0);
  });

  it("spends tomorusa and marks songs and items as purchased", () => {
    const baseState = createInitialState();
    const progressedState = {
      ...addResource(baseState, TOMORUSA_RESOURCE_ID, 180),
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 5 }
      }
    };

    const songResult = purchaseSong(progressedState, "rojiuraIntro");
    const itemResult = purchaseItem(songResult.state, "oldNeonTube");

    expect(songResult.purchased).toBe(true);
    expect(songResult.cost).toBe(80);
    expect(songResult.state.songs.rojiuraIntro.purchased).toBe(true);
    expect(getResourceAmount(songResult.state, TOMORUSA_RESOURCE_ID)).toBe(100);

    expect(itemResult.purchased).toBe(true);
    expect(itemResult.cost).toBe(100);
    expect(itemResult.state.items.oldNeonTube.purchased).toBe(true);
    expect(getResourceAmount(itemResult.state, TOMORUSA_RESOURCE_ID)).toBe(0);
  });

  it("evaluates facility and record unlock progression", () => {
    const baseState = createInitialState();
    const alleyProgressState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 }
      }
    };
    const neonProgressState = {
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 10 }
      }
    };

    expect(isFacilityUnlocked(baseState, "neonBoard")).toBe(false);
    expect(isFacilityUnlocked(alleyProgressState, "neonBoard")).toBe(true);
    expect(isFacilityUnlocked(alleyProgressState, "twilightPathGuide")).toBe(false);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 }
      }
    }, "twilightPathGuide")).toBe(true);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 }
      }
    }, "memoryLibrary")).toBe(true);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 1 }
      }
    }, "recordingStorage")).toBe(true);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 1 },
        recordingStorage: { level: 2 }
      }
    }, "oldBroadcastRoom")).toBe(true);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 3 }
      }
    }, "undergroundPlaza")).toBe(false);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 3 },
        recordingStorage: { level: 2 },
        oldBroadcastRoom: { level: 1 }
      }
    }, "undergroundPlaza")).toBe(true);
    expect(isFacilityUnlocked({
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 3 },
        recordingStorage: { level: 2 },
        oldBroadcastRoom: { level: 1 },
        undergroundPlaza: { level: 4 }
      }
    }, "nameRecordWall")).toBe(true);
    const chapelPathState = {
      ...alleyProgressState,
      facilities: {
        ...alleyProgressState.facilities,
        neonBoard: { level: 5 },
        twilightPathGuide: { level: 1 },
        temporaryBroadcastBooth: { level: 5 },
        memoryLibrary: { level: 3 },
        recordingStorage: { level: 2 },
        oldBroadcastRoom: { level: 1 },
        undergroundPlaza: { level: 4 },
        nameRecordWall: { level: 3 }
      }
    };
    const chapelOpenedState = {
      ...chapelPathState,
      facilities: {
        ...chapelPathState.facilities,
        undergroundChapel: { level: 1 }
      }
    };
    const chapelExpandedState = {
      ...chapelPathState,
      facilities: {
        ...chapelPathState.facilities,
        undergroundChapel: { level: 8 }
      },
      songs: {
        ...chapelPathState.songs,
        chapelHarmony: { purchased: true }
      }
    };
    const repairOpenedState = {
      ...chapelExpandedState,
      facilities: {
        ...chapelExpandedState.facilities,
        undergroundPassageRepair: { level: 1 }
      }
    };

    expect(isFacilityUnlocked(alleyProgressState, "undergroundChapel")).toBe(false);
    expect(isFacilityUnlocked(neonProgressState, "undergroundChapel")).toBe(false);
    expect(isFacilityUnlocked(chapelPathState, "undergroundChapel")).toBe(true);
    expect(isFacilityUnlocked(chapelExpandedState, "undergroundPassageRepair")).toBe(true);
    expect(isRecordUnlocked(alleyProgressState, "firstAudienceNote")).toBe(true);
    expect(isRecordUnlocked(chapelPathState, "undergroundChapelRestorationReport")).toBe(false);
    expect(isRecordUnlocked(chapelOpenedState, "undergroundChapelRestorationReport")).toBe(true);
    expect(isRecordUnlocked(repairOpenedState, "sakurakoRemovedPartsReport")).toBe(true);
    expect(getFacilityLevel(neonProgressState, "neonBoard")).toBe(10);
  });

  it("unlocks initial bond records from idol bond and preserves read state", () => {
    const baseState = createInitialState();
    const almostUnlockedState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 4
        }
      }
    };
    const unlockedState = {
      ...almostUnlockedState,
      idols: {
        ...almostUnlockedState.idols,
        otowaAkari: {
          ...almostUnlockedState.idols.otowaAkari,
          bond: 5
        }
      }
    };
    const readState = readRecord(unlockedState, "idolBondAkariFirstVoice");

    expect(isRecordUnlocked(almostUnlockedState, "idolBondAkariFirstVoice")).toBe(false);
    expect(isRecordUnlocked(unlockedState, "idolBondAkariFirstVoice")).toBe(true);
    expect(isRecordRead(readState, "idolBondAkariFirstVoice")).toBe(true);
  });

  it("unlocks and reads the first idol event from bond without changing resources", () => {
    const baseState = createInitialState();
    const almostUnlockedState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 4
        }
      }
    };
    const unlockedState = {
      ...almostUnlockedState,
      idols: {
        ...almostUnlockedState.idols,
        otowaAkari: {
          ...almostUnlockedState.idols.otowaAkari,
          bond: 5
        }
      }
    };
    const readState = readIdolEvent(unlockedState, "otowaAkari.firstSeat");
    const rereadState = readIdolEvent(readState, "otowaAkari.firstSeat");

    expect(isIdolEventUnlocked(almostUnlockedState, "otowaAkari.firstSeat")).toBe(false);
    expect(isIdolEventUnlocked(unlockedState, "otowaAkari.firstSeat")).toBe(true);
    expect(isIdolEventRead(unlockedState, "otowaAkari.firstSeat")).toBe(false);
    expect(isIdolEventRead(readState, "otowaAkari.firstSeat")).toBe(true);
    expect(readState.idols.otowaAkari.eventIdsRead).toEqual(["otowaAkari.firstSeat"]);
    expect(rereadState).toBe(readState);
    expect(getResourceAmount(readState, TOMORUSA_RESOURCE_ID)).toBe(getResourceAmount(unlockedState, TOMORUSA_RESOURCE_ID));
    expect(getTomorusaPerSecond(readState)).toBe(getTomorusaPerSecond(unlockedState));
  });

  it("unlocks the first expanded normal idol events from joined idol bond", () => {
    const baseState = createInitialState();
    const eventCases = [
      {
        idolId: "asagiriYui",
        eventId: "asagiriYui.twilightStreetGuide"
      },
      {
        idolId: "mizukiShino",
        eventId: "mizukiShino.storageShelf"
      },
      {
        idolId: "hibikiTooko",
        eventId: "hibikiTooko.preBroadcastCheck"
      },
      {
        idolId: "kaminoMeguri",
        eventId: "kaminoMeguri.unknownAuthorProof"
      },
      {
        idolId: "kasumiyamaMio",
        eventId: "kasumiyamaMio.mistObservation"
      },
      {
        idolId: "nanashiroSatsuki",
        eventId: "nanashiroSatsuki.readableUnknown"
      },
      {
        idolId: "shiragiriRin",
        eventId: "shiragiriRin.notFirstMeeting"
      }
    ] as const;

    eventCases.forEach(({ idolId, eventId }) => {
      const eventBaseState = idolId === "shiragiriRin"
        ? {
            ...baseState,
            facilities: {
              ...baseState.facilities,
              unnamedTheater: { level: 1 }
            },
            meguri: {
              ...baseState.meguri,
              count: 2
            }
          }
        : baseState;
      const almostUnlockedState = {
        ...eventBaseState,
        idols: {
          ...eventBaseState.idols,
          [idolId]: {
            ...eventBaseState.idols[idolId],
            joined: true,
            bond: 4
          }
        }
      };
      const unlockedState = {
        ...almostUnlockedState,
        idols: {
          ...almostUnlockedState.idols,
          [idolId]: {
            ...almostUnlockedState.idols[idolId],
            bond: 5
          }
        }
      };
      const readState = readIdolEvent(unlockedState, eventId);

      expect(isIdolEventUnlocked(almostUnlockedState, eventId)).toBe(false);
      expect(isIdolEventUnlocked(unlockedState, eventId)).toBe(true);
      expect(isIdolEventRead(readState, eventId)).toBe(true);
      expect(readState.idols[idolId].eventIdsRead).toEqual([eventId]);
      expect(getResourceAmount(readState, TOMORUSA_RESOURCE_ID)).toBe(getResourceAmount(unlockedState, TOMORUSA_RESOURCE_ID));
      expect(getTomorusaPerSecond(readState)).toBe(getTomorusaPerSecond(unlockedState));
    });
  });
});

describe("save normalization", () => {
  it("fills idol state when loading an old save without idols", () => {
    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: 8,
        resources: { tomorusa: 50 },
        activeIdolId: "otowaAkari",
        facilities: {
          alleyStage: { level: 1 }
        },
        lastSavedAt: 1000
      })
    });

    const result = loadGame(1000);

    expect(result.state.saveVersion).toBe(SAVE_VERSION);
    for (const idolId of IDOL_ORDER) {
      expect(result.state.idols[idolId]).toEqual({
        bond: 0,
        eventIdsRead: [],
        joined: idolId === "otowaAkari"
      });
    }
  });

  it("marks idols that were already unlocked in older saves as joined", () => {
    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: 10,
        resources: { tomorusa: 100 },
        activeIdolId: "asagiriYui",
        facilities: {
          alleyStage: { level: 10 },
          neonBoard: { level: 5 }
        },
        idols: {
          otowaAkari: { bond: 0, eventIdsRead: [] },
          asagiriYui: { bond: 3, eventIdsRead: [] }
        },
        lastSavedAt: 1000
      })
    });

    const result = loadGame(1000);

    expect(result.state.saveVersion).toBe(SAVE_VERSION);
    expect(result.state.activeIdolId).toBe("asagiriYui");
    expect(result.state.idols.otowaAkari.joined).toBe(true);
    expect(result.state.idols.asagiriYui.joined).toBe(true);
  });

  it("normalizes invalid idol save data without crashing", () => {
    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: SAVE_VERSION,
        resources: { tomorusa: 0 },
        activeIdolId: "otowaAkari",
        idols: {
          otowaAkari: {
            bond: -10,
            eventIdsRead: "not-array"
          },
          asagiriYui: {
            bond: 2.8,
            eventIdsRead: ["intro", 3, "intro", "notice"]
          },
          mizukiShino: null
        },
        lastSavedAt: 2000
      })
    });

    const result = loadGame(2000);

    expect(result.state.idols.otowaAkari).toEqual({
      bond: 0,
      eventIdsRead: [],
      joined: true
    });
    expect(result.state.idols.asagiriYui).toEqual({
      bond: 2.8,
      eventIdsRead: ["intro", "notice"],
      joined: false
    });
    expect(result.state.idols.mizukiShino).toEqual({
      bond: 0,
      eventIdsRead: [],
      joined: false
    });
    expect(result.state.idols.hibikiTooko).toEqual({
      bond: 0,
      eventIdsRead: [],
      joined: false
    });
    expect(result.state.idols.kaminoMeguri).toEqual({
      bond: 0,
      eventIdsRead: [],
      joined: false
    });
  });

  it("adds offline reward with the base rate and purchased offline multiplier", () => {
    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: SAVE_VERSION,
        resources: { tomorusa: 50 },
        activeIdolId: "otowaAkari",
        facilities: {
          alleyStage: { level: 10 }
        },
        idols: {
          otowaAkari: { bond: 0, eventIdsRead: [], joined: true },
          asagiriYui: { bond: 0, eventIdsRead: [], joined: false },
          mizukiShino: { bond: 0, eventIdsRead: [], joined: false }
        },
        songs: {},
        records: {},
        items: {
          shiftNoticeBoard: { purchased: true }
        },
        lastSavedAt: 1000
      })
    });

    const result = loadGame(11000);

    expect(result.offlineTomorusa).toBeCloseTo(1.2 * 10 * 0.5 * 1.1);
    expect(getResourceAmount(result.state, TOMORUSA_RESOURCE_ID)).toBeCloseTo(50 + 1.2 * 10 * 0.5 * 1.1);
  });

  it("falls back to a new state for broken saves", () => {
    setupLocalStorage({
      [SAVE_KEY]: "{"
    });

    const result = loadGame(3000);

    expect(result.state.saveVersion).toBe(SAVE_VERSION);
    expect(result.state.idols.otowaAkari.bond).toBe(0);
    expect(result.offlineTomorusa).toBe(0);
  });
});

function setupLocalStorage(entries: Record<string, string>): void {
  const store = new Map(Object.entries(entries));

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        }
      }
    }
  });
}

function withJoinedIdols<T extends ReturnType<typeof createInitialState>>(state: T, idolIds: IdolId[]): T {
  const joinedIdols = idolIds.reduce((idols, idolId) => ({
    ...idols,
    [idolId]: {
      ...state.idols[idolId],
      joined: true
    }
  }), {} as Partial<Record<IdolId, T["idols"][IdolId]>>);

  return {
    ...state,
    idols: {
      ...state.idols,
      ...joinedIdols
    }
  };
}
