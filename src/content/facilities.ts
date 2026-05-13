import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { FacilityDefinition } from "./types.js";

export const FACILITY_DEFINITIONS = defineContent([
  {
    id: "alleyStage",
    name: "路地裏ステージ",
    description:
      "古いスピーカー、拾い集めたネオン管、小規模な舞台で組まれた仮設ステージ。静まり返った地下へ歌を響かせる最初の拠点。",
    baseCost: 10,
    costMultiplier: 1.15,
    productionPerLevel: 0.1
  },
  {
    id: "neonBoard",
    name: "ネオン掲示板",
    description:
      "ライブ告知とアイドルの名前を掲げる古い電光掲示板。通りすがりの人々が名前を目にするたび、路地に少しずつ賑わいが戻っていく。",
    baseCost: 80,
    costMultiplier: 1.18,
    productionPerLevel: 0.35,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "alleyStage",
      level: 10
    }
  },
  {
    id: "undergroundChapel",
    name: "地下礼拝堂",
    description:
      "崩れかけた柱と古い紋章が残る小さな礼拝堂。地下深くに閉ざされていた響きを、後の復興段階で少しずつ調べていく場所。",
    baseCost: 900,
    costMultiplier: 1.25,
    productionPerLevel: 1,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "neonBoard",
      level: 10
    }
  }
] as const satisfies readonly FacilityDefinition[]);

export type FacilityId = ContentId<typeof FACILITY_DEFINITIONS>;

export const FACILITIES: Record<FacilityId, FacilityDefinition> = toContentMap(FACILITY_DEFINITIONS);

export const FACILITY_ORDER: FacilityId[] = toContentOrder(FACILITY_DEFINITIONS);
