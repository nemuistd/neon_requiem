import { describe, expect, it } from "vitest";
import {
  addResource,
  applyProduction,
  canSpendResource,
  createInitialState,
  gainManualTomorusa,
  getFacilityTomorusaPerSecond,
  getFacilityLevel,
  getManualTomorusaGain,
  getOfflineRewardMultiplier,
  getOfflineTomorusa,
  getResourceAmount,
  getTomorusaPerSecond,
  isFacilityUnlocked,
  isRecordUnlocked,
  purchaseItem,
  purchaseSong,
  spendResource,
  TOMORUSA_RESOURCE_ID,
  upgradeFacility
} from "./game";
import { areRequirementsMet, isRequirementMet } from "./engine/requirements";

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
    }
  };

  it("evaluates facility, song, resource, and logical requirements", () => {
    expect(isRequirementMet(state, { type: "facility.level", facilityId: "alleyStage", level: 5 })).toBe(true);
    expect(isRequirementMet(state, { type: "facility.level", facilityId: "alleyStage", level: 6 })).toBe(false);
    expect(isRequirementMet(state, { type: "song.purchased", songId: "rojiuraIntro" })).toBe(true);
    expect(isRequirementMet(state, { type: "resource.amount", resourceId: "tomorusa", amount: 100 })).toBe(true);
    expect(isRequirementMet(state, {
      type: "all",
      requirements: [
        { type: "facility.level", facilityId: "alleyStage", level: 5 },
        { type: "song.purchased", songId: "rojiuraIntro" }
      ]
    })).toBe(true);
    expect(isRequirementMet(state, {
      type: "any",
      requirements: [
        { type: "facility.level", facilityId: "alleyStage", level: 6 },
        { type: "resource.amount", resourceId: "tomorusa", amount: 50 }
      ]
    })).toBe(true);
    expect(isRequirementMet(state, {
      type: "not",
      requirement: { type: "facility.level", facilityId: "alleyStage", level: 6 }
    })).toBe(true);
    expect(areRequirementsMet(state, [
      { type: "facility.level", facilityId: "alleyStage", level: 5 },
      { type: "resource.amount", resourceId: "tomorusa", amount: 100 }
    ])).toBe(true);
  });
});

describe("game state and effects", () => {
  it("creates a complete initial state", () => {
    const state = createInitialState(1234);

    expect(state.saveVersion).toBe(8);
    expect(state.lastSavedAt).toBe(1234);
    expect(state.activeIdolId).toBe("otowaAkari");
    expect(getResourceAmount(state, TOMORUSA_RESOURCE_ID)).toBe(0);
    expect(state.facilities.alleyStage.level).toBe(0);
    expect(state.facilities.neonBoard.level).toBe(0);
    expect(state.facilities.undergroundChapel.level).toBe(0);
    expect(state.items.oldNeonTube.purchased).toBe(false);
    expect(state.items.ticketStubBundle.purchased).toBe(false);
    expect(state.songs.rojiuraIntro.purchased).toBe(false);
    expect(state.records.alleyStageRestorationMemo.read).toBe(false);
    expect(getTomorusaPerSecond(state)).toBe(0);
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
    expect(getOfflineTomorusa(state, 10)).toBeCloseTo(12 * 1.1);
    expect(getOfflineTomorusa(state, 13 * 60 * 60)).toBeCloseTo(1.2 * 12 * 60 * 60 * 1.1);

    const producedState = applyProduction(state, 5);
    expect(getResourceAmount(producedState, TOMORUSA_RESOURCE_ID)).toBeCloseTo(6);
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
    expect(isFacilityUnlocked(alleyProgressState, "undergroundChapel")).toBe(false);
    expect(isFacilityUnlocked(neonProgressState, "undergroundChapel")).toBe(true);
    expect(isRecordUnlocked(alleyProgressState, "firstAudienceNote")).toBe(true);
    expect(isRecordUnlocked(neonProgressState, "undergroundChapelRestorationReport")).toBe(true);
    expect(getFacilityLevel(neonProgressState, "neonBoard")).toBe(10);
  });
});
