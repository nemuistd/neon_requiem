import { describe, expect, it } from "vitest";
import {
  applyProduction,
  calculateMeguriMemoryFragmentSettlement,
  closeMeguriSettlement,
  createInitialState,
  getMeguriSettlementPreview,
  getResourceAmount,
  isMeguriTabUnlocked,
  MEMORY_FRAGMENT_RESOURCE_ID,
  performManualLive,
  performMeguri,
  purchaseMeguriBuff,
  readRecord,
  SAVE_VERSION,
  TOMORUSA_RESOURCE_ID,
  upgradeFacility
} from "./game";
import { getMemoryFragmentMultiplierFromEffects, getRebirthBonusMultiplierFromEffects } from "./engine/effects";
import { isRequirementMet } from "./engine/requirements";
import { validateRequirement } from "./contentValidation";
import { renderMeguriPanel } from "./ui/renderMeguri";
import { renderRecordCards } from "./ui/renderRecords";
import { loadGame, SAVE_KEY } from "./storage";

describe("meguri state and requirements", () => {
  it("creates v10 state with memory fragments and empty meguri progress", () => {
    const state = createInitialState(1234);

    expect(state.saveVersion).toBe(SAVE_VERSION);
    expect(getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(0);
    expect(state.totalTomorusaEarned).toBe(0);
    expect(state.meguri).toMatchObject({
      count: 0,
      totalMemoryFragmentsEarned: 0,
      pendingSettlement: false
    });
    expect(state.meguri.buffs.footstepResonance.purchased).toBe(false);
    expect(state.meguri.idolRecognition.otowaAkari).toBe(false);
  });

  it("evaluates and validates meguri requirements", () => {
    const state = {
      facilities: {},
      resources: {},
      songs: {},
      meguri: {
        count: 2,
        buffs: {
          footstepResonance: { purchased: true }
        }
      }
    };

    expect(isRequirementMet(state, { type: "meguri.count", count: 2 })).toBe(true);
    expect(isRequirementMet(state, { type: "meguri.count", count: 3 })).toBe(false);
    expect(isRequirementMet(state, { type: "meguri.buff.purchased", buffId: "footstepResonance" })).toBe(true);
    expect(validateRequirement("test", { type: "meguri.buff.purchased", buffId: "missingBuff" })).toContain(
      'test: requirement references missing meguri buff "missingBuff".'
    );
  });

  it("exposes meguri after the core is unlocked or after the first loop", () => {
    const baseState = createInitialState();
    const unlockedState = createMeguriReadyState(baseState);
    const afterMeguriState = {
      ...baseState,
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    };

    expect(isMeguriTabUnlocked(baseState)).toBe(false);
    expect(isMeguriTabUnlocked(unlockedState)).toBe(true);
    expect(isMeguriTabUnlocked(afterMeguriState)).toBe(true);
    expect(renderMeguriPanel(unlockedState)).toContain("廻を実行");
  });
});

describe("meguri economy", () => {
  it("tracks total tomorusa earned from live, production, and offline rewards but not spending", () => {
    const liveState = performManualLive(createInitialState());
    expect(liveState.totalTomorusaEarned).toBeCloseTo(1);

    const productionState = applyProduction({
      ...liveState,
      facilities: {
        ...liveState.facilities,
        alleyStage: { level: 1 }
      }
    }, 10);
    expect(productionState.totalTomorusaEarned).toBeCloseTo(2.2);

    const fundedState = {
      ...createInitialState(),
      resources: {
        ...createInitialState().resources,
        tomorusa: 100
      },
      totalTomorusaEarned: 100
    };
    const upgradeResult = upgradeFacility(fundedState, "alleyStage");
    expect(upgradeResult.state.totalTomorusaEarned).toBe(100);

    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: SAVE_VERSION,
        resources: { tomorusa: 50 },
        totalTomorusaEarned: 250,
        facilities: {
          alleyStage: { level: 10 }
        },
        lastSavedAt: 1000
      })
    });
    const loadResult = loadGame(11000);
    expect(loadResult.offlineTomorusa).toBeCloseTo(6);
    expect(loadResult.state.totalTomorusaEarned).toBeCloseTo(256);
  });

  it("uses the same memory fragment settlement preview for display and execution without double claiming", () => {
    const readyState = createMeguriReadyState({
      ...createInitialState(),
      totalTomorusaEarned: 180000
    });
    const preview = getMeguriSettlementPreview(readyState);
    const result = performMeguri(readyState);

    expect(preview).toEqual(calculateMeguriMemoryFragmentSettlement(180000, 0, 1));
    expect(preview.memoryFragmentsAwarded).toBe(3);
    expect(result.performed).toBe(true);

    if (!result.performed) {
      return;
    }

    expect(getResourceAmount(result.state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(3);
    expect(result.preview).toEqual(preview);

    const secondReadyState = createMeguriReadyState(result.state);
    expect(getMeguriSettlementPreview(secondReadyState).memoryFragmentsAwarded).toBe(0);
  });

  it("applies meguri buff effect helpers", () => {
    expect(getMemoryFragmentMultiplierFromEffects([{ type: "memory.fragment.production.add", ratio: 0.15 }])).toBeCloseTo(1.15);
    expect(getRebirthBonusMultiplierFromEffects([{ type: "rebirth.bonus.multiplier", multiplier: 1.05 }])).toBeCloseTo(1.05);
  });

  it("allows buff purchases only during pending settlement", () => {
    const baseState = {
      ...createInitialState(),
      resources: {
        ...createInitialState().resources,
        memoryFragment: 10
      }
    };
    const blockedResult = purchaseMeguriBuff(baseState, "footstepResonance");
    const settlementState = {
      ...baseState,
      meguri: {
        ...baseState.meguri,
        pendingSettlement: true
      }
    };
    const purchaseResult = purchaseMeguriBuff(settlementState, "footstepResonance");

    expect(blockedResult.purchased).toBe(false);
    if (!blockedResult.purchased) {
      expect(blockedResult.reason).toBe("notInSettlement");
    }
    expect(purchaseResult.purchased).toBe(true);

    if (!purchaseResult.purchased) {
      return;
    }

    expect(getResourceAmount(purchaseResult.state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(5);
    expect(purchaseResult.state.meguri.buffs.footstepResonance.purchased).toBe(true);
    expect(purchaseMeguriBuff(closeMeguriSettlement(purchaseResult.state), "leftWorkMemo").purchased).toBe(false);
  });
});

describe("meguri reset and record annotations", () => {
  it("resets regular progress while preserving records, fragments, buffs, and recognition traces", () => {
    const baseState = createMeguriReadyState({
      ...createInitialState(),
      resources: {
        ...createInitialState().resources,
        tomorusa: 1000,
        memoryFragment: 1
      },
      totalTomorusaEarned: 80000,
      recordTabLastSeenContentVersion: 11,
      songs: {
        ...createInitialState().songs,
        rojiuraIntro: { purchased: true }
      },
      items: {
        ...createInitialState().items,
        oldNeonTube: { purchased: true }
      },
      idols: {
        ...createInitialState().idols,
        otowaAkari: {
          bond: 20,
          eventIdsRead: ["first"]
        }
      },
      records: {
        ...createInitialState().records,
        alleyStageRestorationMemo: {
          unlocked: true,
          read: true,
          annotationRead: true
        }
      },
      meguri: {
        ...createInitialState().meguri,
        buffs: {
          ...createInitialState().meguri.buffs,
          leftWorkMemo: { purchased: true }
        }
      }
    });

    const result = performMeguri(baseState);
    expect(result.performed).toBe(true);

    if (!result.performed) {
      return;
    }

    expect(getResourceAmount(result.state, TOMORUSA_RESOURCE_ID)).toBe(0);
    expect(getResourceAmount(result.state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(3);
    expect(result.state.facilities.restabilizationCore.level).toBe(0);
    expect(result.state.songs.rojiuraIntro.purchased).toBe(false);
    expect(result.state.items.oldNeonTube.purchased).toBe(false);
    expect(result.state.idols.otowaAkari.bond).toBe(0);
    expect(result.state.records.alleyStageRestorationMemo).toEqual({ unlocked: true, read: true, annotationRead: true });
    expect(result.state.meguri.buffs.leftWorkMemo.purchased).toBe(true);
    expect(result.state.meguri.idolRecognition.otowaAkari).toBe(true);
    expect(result.state.meguri.count).toBe(1);
    expect(result.state.meguri.pendingSettlement).toBe(true);
    expect(result.state.recordTabLastSeenContentVersion).toBe(0);
  });

  it("renders meguri-gated record annotations and marks annotation read state", () => {
    const state = {
      ...createInitialState(),
      facilities: {
        ...createInitialState().facilities,
        alleyStage: { level: 5 }
      },
      records: {
        ...createInitialState().records,
        lightResponseObservation: {
          unlocked: true,
          read: true,
          annotationRead: false
        }
      },
      meguri: {
        ...createInitialState().meguri,
        buffs: {
          ...createInitialState().meguri.buffs,
          footstepResonance: { purchased: true }
        }
      }
    };

    const html = renderRecordCards(state);
    expect(html).toContain("追記あり");
    expect(html).toContain("同じ反応が、別の日付の記録にも残っている。");

    const readState = readRecord(state, "lightResponseObservation");
    expect(readState.records.lightResponseObservation).toEqual({
      unlocked: true,
      read: true,
      annotationRead: true
    });
  });
});

describe("meguri save migration", () => {
  it("migrates older saves to v10 with estimated total tomorusa and meguri defaults", () => {
    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: 9,
        resources: { tomorusa: 100 },
        facilities: {
          alleyStage: { level: 2 }
        },
        records: {
          alleyStageRestorationMemo: { read: true }
        },
        lastSavedAt: 1000
      })
    });

    const result = loadGame(1000);

    expect(result.state.saveVersion).toBe(SAVE_VERSION);
    expect(getResourceAmount(result.state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(0);
    expect(result.state.meguri.count).toBe(0);
    expect(result.state.meguri.buffs.fragmentIndex.purchased).toBe(false);
    expect(result.state.records.alleyStageRestorationMemo).toEqual({
      unlocked: true,
      read: true,
      annotationRead: false
    });
    expect(result.state.totalTomorusaEarned).toBeGreaterThanOrEqual(121);
  });

  it("normalizes broken meguri save fields without losing valid purchased buffs", () => {
    setupLocalStorage({
      [SAVE_KEY]: JSON.stringify({
        saveVersion: SAVE_VERSION,
        resources: { tomorusa: 0, memoryFragment: 7 },
        totalTomorusaEarned: -10,
        meguri: {
          count: 1.8,
          totalMemoryFragmentsEarned: 2.7,
          pendingSettlement: "yes",
          buffs: {
            leftWorkMemo: { purchased: true },
            missing: { purchased: true }
          },
          idolRecognition: {
            otowaAkari: true,
            missing: true
          }
        },
        lastSavedAt: 2000
      })
    });

    const result = loadGame(2000);

    expect(result.state.meguri.count).toBe(1);
    expect(result.state.meguri.totalMemoryFragmentsEarned).toBe(2);
    expect(result.state.meguri.pendingSettlement).toBe(false);
    expect(result.state.meguri.buffs.leftWorkMemo.purchased).toBe(true);
    expect(result.state.meguri.buffs.footstepResonance.purchased).toBe(false);
    expect(result.state.meguri.idolRecognition.otowaAkari).toBe(true);
    expect(result.state.totalTomorusaEarned).toBe(0);
  });
});

function createMeguriReadyState<T extends ReturnType<typeof createInitialState>>(state: T): T {
  return {
    ...state,
    facilities: {
      ...state.facilities,
      undergroundPassageRepair: { level: 5 },
      restabilizationCore: { level: 1 }
    },
    songs: {
      ...state.songs,
      restorationHumming: { purchased: true }
    }
  };
}

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
