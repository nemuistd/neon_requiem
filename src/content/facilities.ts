import { FacilityDefinition, FacilityId } from "./types.js";

export const FACILITIES: Record<FacilityId, FacilityDefinition> = {
  alleyStage: {
    id: "alleyStage",
    name: "路地裏ステージ",
    description:
      "古いスピーカー、拾い集めたネオン管、小規模な舞台で組まれた仮設ステージ。静まり返った地下へ歌を響かせる最初の拠点。",
    baseCost: 10,
    costMultiplier: 1.15,
    productionPerLevel: 0.1
  },
  undergroundChapel: {
    id: "undergroundChapel",
    name: "地下礼拝堂",
    description:
      "崩れかけた柱と古い聖印が残る小さな礼拝堂。魅力的な歌は、人々の熱に導かれて、灯りが集まり始める。",
    baseCost: 100,
    costMultiplier: 1.2,
    productionPerLevel: 0.5,
    unlockRequirement: {
      facilityId: "alleyStage",
      level: 10
    }
  }
};

export const FACILITY_ORDER: FacilityId[] = ["alleyStage", "undergroundChapel"];
