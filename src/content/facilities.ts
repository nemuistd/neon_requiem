import { FacilityDefinition, FacilityId } from "./types.js";

export const FACILITIES: Record<FacilityId, FacilityDefinition> = {
  alleyStage: {
    id: "alleyStage",
    name: "路地裏ステージ",
    description:
      "古いスピーカー、拾い集めたネオン管、小さな聖印で組まれた仮設ステージ。強化するほど、地下の静寂に届く音が増えていく。",
    baseCost: 10,
    costMultiplier: 1.15,
    productionPerLevel: 0.1
  },
  undergroundChapel: {
    id: "undergroundChapel",
    name: "地下礼拝堂",
    description:
      "崩れかけた柱と古い聖印が残る小さな礼拝堂。響きを整えるほど、歌に導かれた灯りが静かに集まっていく。",
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
