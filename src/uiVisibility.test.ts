import { describe, expect, it } from "vitest";
import {
  FACILITY_ORDER,
  IDOL_ORDER
} from "./definitions";
import { UI_TEXT } from "./data";
import { createInitialState } from "./game";
import { renderFacilityCards } from "./ui/renderFacilities";
import { renderIdolCards, renderIdolDetailModal, renderIdolTabCards } from "./ui/renderIdols";
import { renderItemCards } from "./ui/renderItems";
import { renderRecordCards } from "./ui/renderRecords";
import { renderSongCards } from "./ui/renderSongs";

describe("locked content visibility", () => {
  it("hides future facility names and shows only the next unknown district", () => {
    const html = renderFacilityCards(createInitialState());

    expect(html).toContain("路地裏ステージ");
    expect(html).toContain("未確認区画");
    expect(html).not.toContain("ネオン掲示板");
    expect(html).not.toContain("地下礼拝堂");
  });

  it("hides post-meguri Ch.7 content before the first meguri", () => {
    const baseState = createInitialState();
    const coreReadyState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        undergroundPassageRepair: { level: 15 },
        restabilizationCore: { level: 15 },
        deepLayerObservatory: { level: 5 }
      },
      songs: {
        ...baseState.songs,
        restorationHumming: { purchased: true }
      }
    };
    const postMeguriState = {
      ...coreReadyState,
      meguri: {
        ...coreReadyState.meguri,
        count: 1
      }
    };

    expect(renderFacilityCards(coreReadyState)).not.toContain("deepLayerObservatory");
    expect(renderFacilityCards(coreReadyState)).not.toContain("深層観測所");
    expect(renderIdolTabCards(coreReadyState)).not.toContain("霞山 澪");
    expect(renderFacilityCards(postMeguriState)).toContain("深層観測所");
    expect(renderIdolTabCards(postMeguriState)).toContain("霞山 澪");
  });

  it("reveals Ch.8 content only after the observatory path is open", () => {
    const baseState = createInitialState();
    const observatoryHiddenState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        deepLayerObservatory: { level: 15 },
        engineeringArchive: { level: 5 }
      }
    };
    const archiveVisibleState = {
      ...observatoryHiddenState,
      meguri: {
        ...observatoryHiddenState.meguri,
        count: 1
      }
    };

    expect(renderFacilityCards(observatoryHiddenState)).not.toContain("工学記録保管区");
    expect(renderIdolTabCards(observatoryHiddenState)).not.toContain("七城 皐月");
    expect(renderFacilityCards(archiveVisibleState)).toContain("工学記録保管区");
    expect(renderIdolTabCards(archiveVisibleState)).toContain("七城 皐月");
  });

  it("reveals Ch.9 content only after the second meguri", () => {
    const baseState = createInitialState();
    const ch9HiddenState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        prayerEngineeringRuins: { level: 15 },
        reobservationBase: { level: 15 },
        unnamedTheater: { level: 5 }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    };
    const ch9VisibleState = {
      ...ch9HiddenState,
      meguri: {
        ...ch9HiddenState.meguri,
        count: 2
      }
    };
    const ch9SongReadyState = {
      ...ch9VisibleState,
      facilities: {
        ...ch9VisibleState.facilities,
        unnamedTheater: { level: 10 }
      },
      idols: {
        ...ch9VisibleState.idols,
        shiragiriRin: {
          ...ch9VisibleState.idols.shiragiriRin,
          joined: true
        }
      }
    };

    expect(renderFacilityCards(ch9HiddenState)).not.toContain("再観測拠点");
    expect(renderFacilityCards(ch9HiddenState)).not.toContain("名前のない劇場");
    expect(renderIdolTabCards(ch9HiddenState)).not.toContain("白霧 燐");
    expect(renderSongCards(ch9HiddenState)).not.toContain("最後の名前");
    expect(renderFacilityCards(ch9VisibleState)).toContain("再観測拠点");
    expect(renderFacilityCards(ch9VisibleState)).toContain("名前のない劇場");
    expect(renderIdolTabCards(ch9VisibleState)).toContain("白霧 燐");
    expect(renderSongCards(ch9VisibleState)).not.toContain("最後の名前");
    expect(renderSongCards(ch9VisibleState)).toContain("未確認の歌");
    expect(renderSongCards(ch9SongReadyState)).toContain("最後の名前");
  });

  it("hides locked record titles and requirements", () => {
    const html = renderRecordCards(createInitialState());

    expect(html).toContain("路地裏ステージの復興");
    expect(html).not.toContain("バインダー封書・開封");
    expect(html).not.toContain("地下礼拝堂復旧報告");
  });

  it("uses generic locked labels for related songs, items, and idols", () => {
    const baseState = createInitialState();
    const chapelVisibleState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        nameRecordWall: { level: 15 },
        undergroundChapel: { level: 1 }
      }
    };

    expect(renderSongCards(baseState)).toContain("未確認の歌");
    expect(renderSongCards(baseState)).not.toContain("礼拝堂のハーモニー");
    expect(renderItemCards(baseState)).toContain("未確認の備品");
    expect(renderItemCards(baseState)).not.toContain("古いネオン管");
    expect(renderIdolTabCards(chapelVisibleState)).toContain("？？？");
    expect(renderIdolTabCards(chapelVisibleState)).not.toContain("深月 詩乃");
  });

  it("keeps idol-gated song and item requirements hidden until the idol can be met", () => {
    const baseState = createInitialState();
    const libraryRelatedState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        temporaryBroadcastBooth: { level: 15 },
        memoryLibrary: { level: 3 }
      }
    };
    const meguriVisibleState = {
      ...libraryRelatedState,
      facilities: {
        ...libraryRelatedState.facilities,
        memoryLibrary: { level: 5 }
      }
    };

    expect(renderItemCards(libraryRelatedState)).not.toContain("紙野 巡");
    expect(renderSongCards(libraryRelatedState)).not.toContain("紙野 巡");
    expect(renderItemCards(meguriVisibleState)).toContain("未確認の備品");
    expect(renderItemCards(meguriVisibleState)).toContain("紙野 巡 合流済み");
    expect(renderSongCards(meguriVisibleState)).toContain("未確認の歌");
    expect(renderSongCards(meguriVisibleState)).toContain("紙野 巡 合流済み");
  });

  it("does not show a bottom status while a locked candidate is already visible", () => {
    const baseState = createInitialState();
    const chapelVisibleState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        nameRecordWall: { level: 15 },
        undergroundChapel: { level: 1 }
      }
    };

    expect(renderFacilityCards(baseState)).toContain("未確認区画");
    expect(renderFacilityCards(baseState)).not.toContain("data-progress-status");
    expect(renderSongCards(baseState)).toContain("未確認の歌");
    expect(renderSongCards(baseState)).not.toContain("data-progress-status");
    expect(renderItemCards(baseState)).toContain("未確認の備品");
    expect(renderItemCards(baseState)).not.toContain("data-progress-status");
    expect(renderIdolTabCards(chapelVisibleState)).toContain("？？？");
    expect(renderIdolTabCards(chapelVisibleState)).not.toContain("data-progress-status");
  });

  it("shows a bottom hint when further implemented content is still hidden", () => {
    const baseState = createInitialState();
    const postCoreState = {
      ...createAllProgressVisibleState(),
      meguri: {
        ...baseState.meguri,
        count: 0
      }
    };
    const firstSongVisibleState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 5 }
      }
    };
    const earlyItemsVisibleState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 8 }
      }
    };
    const yuiVisibleState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };
    const preMeguriHiddenText = "復興や加入を進めると、新たな発見があります。";
    const meguriHiddenText = "復興・加入・廻を進めると、新たな発見があります。";

    expect(renderFacilityCards(postCoreState)).toContain("data-progress-status=\"hidden\"");
    expect(renderFacilityCards(postCoreState)).toContain(meguriHiddenText);
    expect(renderFacilityCards(postCoreState)).not.toContain("まだ見つけられることがあります。");
    expect(renderSongCards(firstSongVisibleState)).toContain("data-progress-status=\"hidden\"");
    expect(renderSongCards(firstSongVisibleState)).toContain(preMeguriHiddenText);
    expect(renderSongCards(firstSongVisibleState)).not.toContain(meguriHiddenText);
    expect(renderSongCards(firstSongVisibleState)).not.toContain("まだ見つけられることがあります。");
    expect(renderItemCards(earlyItemsVisibleState)).toContain("data-progress-status=\"hidden\"");
    expect(renderItemCards(earlyItemsVisibleState)).toContain(preMeguriHiddenText);
    expect(renderItemCards(earlyItemsVisibleState)).not.toContain(meguriHiddenText);
    expect(renderItemCards(earlyItemsVisibleState)).not.toContain("まだ見つけられることがあります。");
    expect(renderIdolTabCards(yuiVisibleState)).toContain("data-progress-status=\"hidden\"");
    expect(renderIdolTabCards(yuiVisibleState)).toContain(preMeguriHiddenText);
    expect(renderIdolTabCards(yuiVisibleState)).not.toContain(meguriHiddenText);
    expect(renderIdolTabCards(yuiVisibleState)).not.toContain("まだ見つけられることがあります。");
  });

  it("shows a bottom completion status after all implemented candidates are visible", () => {
    const allProgressVisibleState = createAllProgressVisibleState();

    expect(renderFacilityCards(allProgressVisibleState)).toContain("data-progress-status=\"complete\"");
    expect(renderFacilityCards(allProgressVisibleState)).toContain("現在確認できるものは以上です");
    expect(renderSongCards(allProgressVisibleState)).toContain("data-progress-status=\"complete\"");
    expect(renderSongCards(allProgressVisibleState)).toContain("現在確認できるものは以上です");
    expect(renderItemCards(allProgressVisibleState)).toContain("data-progress-status=\"complete\"");
    expect(renderItemCards(allProgressVisibleState)).toContain("現在確認できるものは以上です");
    expect(renderIdolTabCards(allProgressVisibleState)).toContain("data-progress-status=\"complete\"");
    expect(renderIdolTabCards(allProgressVisibleState)).toContain("現在確認できるものは以上です");
  });

  it("shows unlocked idol events only after their bond requirement is met", () => {
    const baseState = createInitialState();
    const eventReadyState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 5
        }
      }
    };

    expect(renderIdolDetailModal(baseState, "otowaAkari")).not.toContain("灯里・客席の灯");
    expect(renderIdolDetailModal(eventReadyState, "otowaAkari")).toContain("灯里・客席の灯");
    expect(renderIdolDetailModal(eventReadyState, "otowaAkari")).toContain("data-idol-event-id=\"otowaAkari.firstSeat\"");
  });

  it("renders idol bond as progress toward the next visible event unlock", () => {
    const html = renderIdolTabCards(createInitialState());

    expect(html).toContain("data-idol-bond-progress=\"otowaAkari\"");
    expect(html).toContain("data-bond-current=\"0\"");
    expect(html).toContain("data-bond-goal=\"5\"");
    expect(html).toContain("0 / 5");
  });

  it("does not use idol bond records as the next bond progress goal", () => {
    const baseState = createInitialState();
    const recordReadyState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 5
        }
      }
    };
    const tabHtml = renderIdolTabCards(recordReadyState);
    const leftHtml = renderIdolCards(recordReadyState, "otowaAkari");

    expect(tabHtml).toContain("data-idol-bond-progress=\"otowaAkari\"");
    expect(tabHtml).toContain("data-bond-goal=\"5\"");
    expect(tabHtml).not.toContain("data-bond-goal=\"20\"");
    expect(leftHtml).toContain("data-idol-bond-progress=\"otowaAkari\"");
    expect(leftHtml).toContain("data-bond-goal=\"5\"");
    expect(leftHtml).not.toContain("data-bond-goal=\"20\"");
  });

  it("keeps later gated bond goals hidden until their prerequisites are visible", () => {
    const baseState = createInitialState();
    const routeHiddenHtml = renderIdolTabCards(baseState);
    const mioVisibleState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        restabilizationCore: { level: 15 },
        deepLayerObservatory: { level: 8 }
      },
      idols: {
        ...baseState.idols,
        kasumiyamaMio: {
          ...baseState.idols.kasumiyamaMio,
          joined: true,
          bond: 5
        }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    };

    expect(routeHiddenHtml).not.toContain("data-idol-bond-progress=\"kasumiyamaMio\"");
    expect(routeHiddenHtml).not.toContain("data-bond-goal=\"20\"");
    expect(renderIdolTabCards(mioVisibleState)).toContain("data-idol-bond-progress=\"kasumiyamaMio\"");
    expect(renderIdolTabCards(mioVisibleState)).toContain("data-bond-goal=\"20\"");
    expect(renderIdolTabCards(mioVisibleState)).toContain("5 / 20");
  });

  it("splits joined idol tab actions into focus and detail controls", () => {
    const html = renderIdolTabCards(createInitialState());

    expect(html).toContain("class=\"idol-tab-action-row\"");
    expect(html).toContain("data-idol-id=\"otowaAkari\"");
    expect(html).toContain("data-idol-detail-id=\"otowaAkari\"");
    expect(html).toContain(UI_TEXT.focusedIdolLabel);
    expect(html).toContain(UI_TEXT.detailButtonLabel);
  });

  it("keeps joinable idol tab cards on the single join action", () => {
    const baseState = createInitialState();
    const yuiReadyState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };
    const yuiButtonHtml = getButtonHtml(renderIdolTabCards(yuiReadyState), "asagiriYui");

    expect(yuiButtonHtml).toContain("data-idol-join-id=\"asagiriYui\"");
    expect(yuiButtonHtml).not.toContain("data-idol-detail-id=\"asagiriYui\"");
  });

  it("renders idol detail modal with bond-unlocked records without changing focus", () => {
    const baseState = createInitialState();
    const detailReadyState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 5
        }
      }
    };
    const closedHtml = renderIdolTabCards(detailReadyState);
    const openHtml = renderIdolDetailModal(detailReadyState, "otowaAkari");

    expect(closedHtml).not.toContain("class=\"idol-detail-modal\"");
    expect(openHtml).toContain("class=\"idol-detail-modal\"");
    expect(openHtml).toContain("role=\"dialog\"");
    expect(openHtml).toContain("aria-modal=\"true\"");
    expect(openHtml).toContain("data-idol-detail-action=\"close\"");
    expect(openHtml).toContain("data-idol-event-id=\"otowaAkari.firstSeat\"");
    expect(openHtml).toContain("data-record-id=\"idolBondAkariFirstVoice\"");
  });

  it("shows twilight memory events only after meguri recognition and renewed bond", () => {
    const baseState = createInitialState();
    const renewedBondState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 5
        }
      },
      meguri: {
        ...baseState.meguri,
        count: 1
      }
    };
    const twilightReadyState = {
      ...renewedBondState,
      meguri: {
        ...renewedBondState.meguri,
        idolRecognition: {
          ...renewedBondState.meguri.idolRecognition,
          otowaAkari: true
        }
      }
    };
    const tabHtml = renderIdolDetailModal(twilightReadyState, "otowaAkari");
    const detailHtml = renderIdolDetailModal(twilightReadyState, "otowaAkari");

    expect(renderIdolDetailModal(renewedBondState, "otowaAkari")).not.toContain("灯里・一拍遅い返事");
    expect(tabHtml).toContain("灯里・一拍遅い返事");
    expect(tabHtml).toContain("薄明の記憶");
    expect(detailHtml).toContain("data-idol-event-id=\"otowaAkari.twilightFirstPause\"");
  });

  it("shows meguri recognition as a quiet bond label", () => {
    const baseState = createInitialState();
    const recognizedState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 5
        }
      },
      meguri: {
        ...baseState.meguri,
        count: 1,
        idolRecognition: {
          ...baseState.meguri.idolRecognition,
          otowaAkari: true
        }
      }
    };
    const leftHtml = renderIdolCards(recognizedState, "otowaAkari");
    const tabHtml = renderIdolTabCards(recognizedState);

    expect(leftHtml).toContain("交流（既視感）");
    expect(leftHtml).not.toContain("class=\"recognition-trace\"");
    expect(tabHtml).toContain("交流（既視感）");
    expect(tabHtml).not.toContain("class=\"recognition-trace\"");
  });

  it("lets the left idol switcher join idols that are ready to be invited", () => {
    const baseState = createInitialState();
    const yuiReadyState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        alleyStage: { level: 10 },
        neonBoard: { level: 5 }
      }
    };
    const html = renderIdolCards(yuiReadyState, "otowaAkari");
    const yuiButtonHtml = getButtonHtml(html, "asagiriYui");

    expect(yuiButtonHtml).toContain("data-idol-join-id=\"asagiriYui\"");
    expect(yuiButtonHtml).not.toContain("data-idol-id=\"asagiriYui\"");
    expect(yuiButtonHtml).not.toContain("disabled");
  });

  it("opens left idol details through the shared detail modal", () => {
    const baseState = createInitialState();
    const detailReadyState = {
      ...baseState,
      idols: {
        ...baseState.idols,
        otowaAkari: {
          ...baseState.idols.otowaAkari,
          bond: 5
        }
      }
    };
    const closedHtml = renderIdolCards(detailReadyState, "otowaAkari");
    const openHtml = renderIdolDetailModal(detailReadyState, "otowaAkari");

    expect(closedHtml).not.toContain("class=\"idol-detail-panel\"");
    expect(closedHtml).toContain("data-idol-detail-id=\"otowaAkari\"");
    expect(openHtml).toContain("idol-detail-panel");
    expect(openHtml).toContain("class=\"idol-detail-modal\"");
    expect(openHtml).toContain("data-idol-event-id=\"otowaAkari.firstSeat\"");
    expect(openHtml).toContain("data-record-id=\"idolBondAkariFirstVoice\"");
  });

  it("shows idol scene records in the left detail panel even when they unlock from facility progress", () => {
    const baseState = createInitialState();
    const detailReadyState = {
      ...baseState,
      facilities: {
        ...baseState.facilities,
        temporaryBroadcastBooth: { level: 8 }
      },
      idols: {
        ...baseState.idols,
        hibikiTooko: {
          ...baseState.idols.hibikiTooko,
          joined: true
        }
      }
    };
    const openHtml = renderIdolDetailModal(detailReadyState, "hibikiTooko");

    expect(openHtml).toContain("data-record-id=\"tookoFirstBroadcast\"");
  });
});

function createAllProgressVisibleState(): ReturnType<typeof createInitialState> {
  const baseState = createInitialState();

  return {
    ...baseState,
    facilities: FACILITY_ORDER.reduce(
      (facilities, facilityId) => ({
        ...facilities,
        [facilityId]: { level: 18 }
      }),
      baseState.facilities
    ),
    idols: IDOL_ORDER.reduce(
      (idols, idolId) => ({
        ...idols,
        [idolId]: {
          ...baseState.idols[idolId],
          joined: true
        }
      }),
      baseState.idols
    ),
    songs: {
      ...baseState.songs,
      chapelHarmony: { purchased: true },
      restorationHumming: { purchased: true }
    },
    meguri: {
      ...baseState.meguri,
      count: 2
    }
  };
}

function getButtonHtml(html: string, text: string): string {
  return Array.from(html.matchAll(/<button[\s\S]*?<\/button>/g)).find((match) => match[0].includes(text))?.[0] ?? "";
}
