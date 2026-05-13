import { SongDefinition, SongId } from "./types.js";

export const SONGS: Record<SongId, SongDefinition> = {
  rojiuraIntro: {
    id: "rojiuraIntro",
    name: "路地裏のイントロ",
    description: "よく耳に残る、馴染み深く短い旋律。灯里の歌に、街路の返す残響が少しだけ重なる。",
    cost: 100,
    effectDescription: "ライブ1回の灯るさ +1",
    effects: [
      {
        type: "manual.gain.add",
        resourceId: "tomorusa",
        amount: 1
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "alleyStage",
      level: 5
    }
  },
  chapelHarmony: {
    id: "chapelHarmony",
    name: "礼拝堂のハーモニー",
    description: "地下礼拝堂に残されていた、遊び心満載の楽曲。古い区画の響きを、アイドルのステージに合う明るいハーモニーへ編み直している。",
    cost: 500,
    effectDescription: "施設の灯るさ生産 x1.10",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.1
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundChapel",
      level: 1
    }
  },
  twilightChorus: {
    id: "twilightChorus",
    name: "薄明のコーラス",
    description: "霞の濃い通路にもよく響く合唱。複数の区画にまたがって灯りの流れを整える作用がある。",
    cost: 2000,
    effectDescription: "施設の灯るさ生産 x1.25",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.25
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundChapel",
      level: 5
    }
  }
};

export const SONG_ORDER: SongId[] = ["rojiuraIntro", "chapelHarmony", "twilightChorus"];
