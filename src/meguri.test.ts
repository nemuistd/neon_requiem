import { describe, expect, it } from "vitest";
import {
  applyProduction,
  calculateMeguriMemoryFragmentSettlement,
  closeMeguriSettlement,
  createInitialState,
  getMeguriSettlementPreview,
  getRequiredTomorusaForEligibleMemoryFragments,
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
import { UI_TEXT } from "./data";
import { MEGURI_BUFFS, RECORDS } from "./definitions";
import { renderMeguriPanel } from "./ui/renderMeguri";
import { renderRecordCards } from "./ui/renderRecords";
import { getUnreadRecordNotificationCount } from "./ui/renderTabs";
import { loadGame, SAVE_KEY } from "./storage";

describe("meguri state and requirements", () => {
  it("creates v11 state with memory fragments and empty meguri progress", () => {
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
        },
        idolRecognition: {
          otowaAkari: true
        }
      }
    };

    expect(isRequirementMet(state, { type: "meguri.count", count: 2 })).toBe(true);
    expect(isRequirementMet(state, { type: "meguri.count", count: 3 })).toBe(false);
    expect(isRequirementMet(state, { type: "meguri.buff.purchased", buffId: "footstepResonance" })).toBe(true);
    expect(isRequirementMet(state, { type: "meguri.idolRecognition", idolId: "otowaAkari" })).toBe(true);
    expect(isRequirementMet(state, { type: "meguri.idolRecognition", idolId: "asagiriYui" })).toBe(false);
    expect(validateRequirement("test", { type: "meguri.buff.purchased", buffId: "missingBuff" })).toContain(
      'test: requirement references missing meguri buff "missingBuff".'
    );
    expect(validateRequirement("test", { type: "meguri.idolRecognition", idolId: "missingIdol" })).toContain(
      'test: requirement references missing idol "missingIdol".'
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
      totalTomorusaEarned: 200000
    });
    const preview = getMeguriSettlementPreview(readyState);
    const result = performMeguri(readyState);

    expect(preview).toEqual(calculateMeguriMemoryFragmentSettlement(200000, 0, 1));
    expect(preview.memoryFragmentsAwarded).toBe(3);
    expect(preview.nextMemoryFragmentTotalTomorusa).toBe(getRequiredTomorusaForEligibleMemoryFragments(4, 1));
    expect(preview.tomorusaUntilNextMemoryFragment).toBe(120000);
    expect(preview.memoryFragmentProgressRatio).toBeGreaterThan(0);
    expect(result.performed).toBe(true);

    if (!result.performed) {
      return;
    }

    expect(getResourceAmount(result.state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(3);
    expect(result.preview).toEqual(preview);

    const secondReadyState = createMeguriReadyState(result.state);
    expect(getMeguriSettlementPreview(secondReadyState).memoryFragmentsAwarded).toBe(0);
  });

  it("renders the next memory fragment gauge from the settlement preview", () => {
    const readyState = createMeguriReadyState({
      ...createInitialState(),
      totalTomorusaEarned: 200000
    });
    const html = renderMeguriPanel(readyState);

    expect(html).toContain("次の記憶断片");
    expect(html).toContain("あと 120,000 灯るさで +1 記憶断片");
    expect(html).toContain("meguri-progress-track");
  });

  it("applies meguri buff effect helpers", () => {
    expect(getMemoryFragmentMultiplierFromEffects([{ type: "memory.fragment.production.add", ratio: 0.2 }])).toBeCloseTo(1.2);
    expect(getRebirthBonusMultiplierFromEffects([{ type: "rebirth.bonus.multiplier", multiplier: 1.08 }])).toBeCloseTo(1.08);
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

    expect(getResourceAmount(purchaseResult.state, MEMORY_FRAGMENT_RESOURCE_ID)).toBe(7);
    expect(purchaseResult.state.meguri.buffs.footstepResonance.purchased).toBe(true);
    expect(purchaseMeguriBuff(closeMeguriSettlement(purchaseResult.state), "leftWorkMemo").purchased).toBe(false);
  });

  it("renders pending settlement as a dedicated screen state", () => {
    const settlementState = {
      ...createInitialState(),
      meguri: {
        ...createInitialState().meguri,
        count: 1,
        pendingSettlement: true
      }
    };
    const html = renderMeguriPanel(settlementState);

    expect(html).toContain("廻後清算中");
    expect(html).toContain("通常進行へ戻る");
    expect(html).toContain('data-meguri-action="closeSettlement"');
    expect(html).not.toContain('data-meguri-action="openRecords"');
  });

  it("shows records with unread annotations on the settlement screen", () => {
    const settlementState = {
      ...createInitialState(),
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
        count: 1,
        pendingSettlement: true,
        buffs: {
          ...createInitialState().meguri.buffs,
          footstepResonance: {
            purchased: true
          }
        }
      }
    };
    const html = renderMeguriPanel(settlementState);

    expect(html).toContain(UI_TEXT.meguriSettlementRecordNotesLabel);
    expect(html).toContain(UI_TEXT.meguriSettlementRecordNotesCloseText);
    expect(html).toContain(UI_TEXT.meguriSettlementOpenRecordsButtonLabel);
    expect(html).toContain("観測記録・灯り反応");
    expect(html).toContain("meguri-settlement-records-action");
    expect(html.match(/data-meguri-action="closeSettlement"/g)).toHaveLength(1);
    expect(html.match(/data-meguri-action="openRecords"/g)).toHaveLength(1);
    expect(html).toContain('data-meguri-action="openRecords"');
  });

  it("renders a compact post-meguri dashboard during regular progress", () => {
    const preMeguriHtml = renderMeguriPanel(createMeguriReadyState(createInitialState()));
    expect(preMeguriHtml).not.toContain('data-meguri-dashboard="true"');

    const initialState = createInitialState();
    const postMeguriState = {
      ...initialState,
      resources: {
        ...initialState.resources,
        memoryFragment: 6
      },
      records: {
        ...initialState.records,
        lightResponseObservation: {
          unlocked: true,
          read: true,
          annotationRead: false
        }
      },
      meguri: {
        ...initialState.meguri,
        count: 1,
        buffs: {
          ...initialState.meguri.buffs,
          footstepResonance: {
            purchased: true
          }
        },
        idolRecognition: {
          ...initialState.meguri.idolRecognition,
          otowaAkari: true
        }
      }
    };
    const html = renderMeguriPanel(postMeguriState);

    expect(html).toContain('data-meguri-dashboard="true"');
    expect(html).toContain(UI_TEXT.meguriDashboardLabel);
    expect(html).toContain("data-meguri-dashboard-loop>第1廻</strong>");
    expect(html).toContain("data-meguri-dashboard-memory-fragments>6</strong>");
    expect(html).toContain("data-meguri-dashboard-purchased-buffs>1 / 4</strong>");
    expect(html).toContain("data-meguri-dashboard-annotations>1</strong>");
    expect(html).toContain("data-meguri-dashboard-recognition>1</strong>");
    expect(html).toContain(UI_TEXT.meguriDashboardNextGoalReadAnnotations);
    expect(postMeguriState.meguri).not.toHaveProperty("dashboard");
  });

  it("shows the Ch.9 open-end guide after the final song is added", () => {
    const initialState = createInitialState();
    const ch9OpenState = createMeguriReadyState({
      ...initialState,
      facilities: {
        ...initialState.facilities,
        unnamedTheater: { level: 3 }
      },
      songs: {
        ...initialState.songs,
        theLastName: { purchased: true }
      },
      meguri: {
        ...initialState.meguri,
        count: 2
      }
    });
    const html = renderMeguriPanel(ch9OpenState);

    expect(html).toContain('data-ch9-open-end="true"');
    expect(html).toContain(UI_TEXT.ch9OpenEndTitle);
    expect(html).toContain('data-tab-id="restoration"');
    expect(html.match(/data-meguri-action="perform"/g)).toHaveLength(2);
  });

  it("shows a post-meguri annotation index without duplicating annotation body text", () => {
    const preMeguriHtml = renderMeguriPanel(createMeguriReadyState(createInitialState()));
    expect(preMeguriHtml).not.toContain('data-meguri-annotation-index="true"');

    const initialState = createInitialState();
    const unreadState = {
      ...initialState,
      records: {
        ...initialState.records,
        lightResponseObservation: {
          unlocked: true,
          read: true,
          annotationRead: false
        }
      },
      meguri: {
        ...initialState.meguri,
        count: 1,
        buffs: {
          ...initialState.meguri.buffs,
          footstepResonance: {
            purchased: true
          }
        }
      }
    };
    const unreadHtml = renderMeguriPanel(unreadState);
    const annotationBody = RECORDS.lightResponseObservation.bodyAnnotation ?? "";

    expect(unreadHtml).toContain('data-meguri-annotation-index="true"');
    expect(unreadHtml).toContain(UI_TEXT.meguriAnnotationIndexLabel);
    expect(unreadHtml).toContain(RECORDS.lightResponseObservation.title);
    expect(unreadHtml).toContain(MEGURI_BUFFS.footstepResonance.name);
    expect(unreadHtml).toContain(UI_TEXT.meguriAnnotationIndexUnreadLabel);
    expect(unreadHtml).toContain('data-meguri-action="openRecords"');
    expect(annotationBody.length).toBeGreaterThan(0);
    expect(unreadHtml).not.toContain(annotationBody);

    const readHtml = renderMeguriPanel({
      ...unreadState,
      records: {
        ...unreadState.records,
        lightResponseObservation: {
          unlocked: true,
          read: true,
          annotationRead: true
        }
      }
    });
    expect(readHtml).toContain(UI_TEXT.meguriAnnotationIndexReadLabel);
    expect(readHtml).not.toContain(UI_TEXT.meguriAnnotationIndexUnreadLabel);
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
          eventIdsRead: ["first"],
          joined: true
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
    expect(result.state.idols.otowaAkari.joined).toBe(true);
    expect(result.state.records.alleyStageRestorationMemo).toEqual({ unlocked: true, read: true, annotationRead: true });
    expect(result.state.meguri.buffs.leftWorkMemo.purchased).toBe(true);
    expect(result.state.meguri.idolRecognition.otowaAkari).toBe(true);
    expect(result.state.meguri.count).toBe(1);
    expect(result.state.meguri.pendingSettlement).toBe(true);
    expect(result.state.recordTabLastSeenContentVersion).toBe(11);
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

  it("notifies record tab for unread annotations without resetting all carried records after meguri", () => {
    const baseState = createMeguriReadyState({
      ...createInitialState(),
      recordTabLastSeenContentVersion: 11,
      totalTomorusaEarned: 80000,
      records: {
        ...createInitialState().records,
        alleyStageRestorationMemo: {
          unlocked: true,
          read: true,
          annotationRead: false
        },
        lightResponseObservation: {
          unlocked: true,
          read: true,
          annotationRead: false
        }
      }
    });
    const meguriResult = performMeguri(baseState);

    expect(meguriResult.performed).toBe(true);

    if (!meguriResult.performed) {
      return;
    }

    expect(getUnreadRecordNotificationCount(meguriResult.state, "restoration")).toBe(0);

    const buffResult = purchaseMeguriBuff({
      ...meguriResult.state,
      resources: {
        ...meguriResult.state.resources,
        memoryFragment: 10
      }
    }, "footstepResonance");

    expect(buffResult.purchased).toBe(true);

    if (!buffResult.purchased) {
      return;
    }

    expect(getUnreadRecordNotificationCount(buffResult.state, "restoration")).toBe(1);

    const readState = readRecord(buffResult.state, "lightResponseObservation");
    expect(getUnreadRecordNotificationCount(readState, "restoration")).toBe(0);
  });
});

describe("meguri save migration", () => {
  it("migrates older saves to v11 with estimated total tomorusa and meguri defaults", () => {
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
