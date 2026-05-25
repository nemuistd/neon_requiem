import { describe, expect, it } from "vitest";
import { createInitialState } from "./game";
import { renderFacilityCards } from "./ui/renderFacilities";
import { renderIdolCards, renderIdolTabCards } from "./ui/renderIdols";
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
        undergroundPassageRepair: { level: 5 },
        restabilizationCore: { level: 3 },
        deepLayerObservatory: { level: 1 }
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
        deepLayerObservatory: { level: 5 },
        engineeringArchive: { level: 3 }
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
        prayerEngineeringRuins: { level: 3 },
        reobservationBase: { level: 3 },
        unnamedTheater: { level: 1 }
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

    expect(renderFacilityCards(ch9HiddenState)).not.toContain("再観測拠点");
    expect(renderFacilityCards(ch9HiddenState)).not.toContain("名前のない劇場");
    expect(renderIdolTabCards(ch9HiddenState)).not.toContain("白霧 燐");
    expect(renderFacilityCards(ch9VisibleState)).toContain("再観測拠点");
    expect(renderFacilityCards(ch9VisibleState)).toContain("名前のない劇場");
    expect(renderIdolTabCards(ch9VisibleState)).toContain("白霧 燐");
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
        nameRecordWall: { level: 3 },
        undergroundChapel: { level: 1 }
      }
    };

    expect(renderSongCards(baseState)).toContain("未確認の歌");
    expect(renderSongCards(baseState)).not.toContain("礼拝堂のハーモニー");
    expect(renderItemCards(baseState)).toContain("未確認の備品");
    expect(renderItemCards(baseState)).not.toContain("古いネオン管");
    expect(renderIdolTabCards(chapelVisibleState)).toContain("未確認のアイドル");
    expect(renderIdolTabCards(chapelVisibleState)).not.toContain("深月 詩乃");
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

    expect(renderIdolTabCards(baseState)).not.toContain("灯里・客席の灯");
    expect(renderIdolTabCards(eventReadyState)).toContain("灯里・客席の灯");
    expect(renderIdolTabCards(eventReadyState)).toContain("data-idol-event-id=\"otowaAkari.firstSeat\"");
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
    const tabHtml = renderIdolTabCards(twilightReadyState);
    const detailHtml = renderIdolCards(twilightReadyState, "otowaAkari", true);

    expect(renderIdolTabCards(renewedBondState)).not.toContain("灯里・一拍遅い返事");
    expect(tabHtml).toContain("灯里・一拍遅い返事");
    expect(tabHtml).toContain("薄明の記憶");
    expect(detailHtml).toContain("data-idol-event-id=\"otowaAkari.twilightFirstPause\"");
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

  it("shows unlocked idol events and idol bond records in the left detail panel", () => {
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
    const openHtml = renderIdolCards(detailReadyState, "otowaAkari", true);

    expect(closedHtml).not.toContain("class=\"idol-detail-panel\"");
    expect(openHtml).toContain("idol-detail-panel");
    expect(openHtml).toContain("data-idol-event-id=\"otowaAkari.firstSeat\"");
    expect(openHtml).toContain("data-record-id=\"idolBondAkariFirstVoice\"");
  });
});

function getButtonHtml(html: string, text: string): string {
  return Array.from(html.matchAll(/<button[\s\S]*?<\/button>/g)).find((match) => match[0].includes(text))?.[0] ?? "";
}
