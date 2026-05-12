import { SongDefinition, SongId } from "./types.js";

export const SONGS: Record<SongId, SongDefinition> = {
  rojiuraIntro: {
    id: "rojiuraIntro",
    name: "路地裏のイントロ",
    description: "最初に戻ってくる短い旋律。灯里のライブに、街路の残響が少しだけ重なる。",
    cost: 100,
    effectDescription: "ライブ1回の灯り +1",
    effect: {
      type: "manualLightGainBonus",
      amount: 1
    },
    unlockRequirement: {
      facilityId: "alleyStage",
      level: 5
    }
  },
  chapelHarmony: {
    id: "chapelHarmony",
    name: "礼拝堂のハーモニー",
    description: "地下礼拝堂に残る響きを整え、区画に灯りが集まりやすくする歌。",
    cost: 500,
    effectDescription: "施設の灯り生産 x1.10",
    effect: {
      type: "facilityProductionMultiplier",
      multiplier: 1.1
    },
    unlockRequirement: {
      facilityId: "undergroundChapel",
      level: 1
    }
  },
  twilightChorus: {
    id: "twilightChorus",
    name: "薄明のコーラス",
    description: "霞の濃い通路にも届く合唱。複数の区画にまたがって灯りの流れを強める。",
    cost: 2000,
    effectDescription: "施設の灯り生産 x1.25",
    effect: {
      type: "facilityProductionMultiplier",
      multiplier: 1.25
    },
    unlockRequirement: {
      facilityId: "undergroundChapel",
      level: 5
    }
  }
};

export const SONG_ORDER: SongId[] = ["rojiuraIntro", "chapelHarmony", "twilightChorus"];
