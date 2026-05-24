import { describe, expect, it } from "vitest";
import { createInitialState } from "./game";
import { renderFacilityCards } from "./ui/renderFacilities";
import { renderIdolTabCards } from "./ui/renderIdols";
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
});
