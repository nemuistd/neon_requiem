import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { SongDefinition } from "./types.js";

export const SONG_DEFINITIONS = defineContent([
  {
    id: "rojiuraIntro",
    name: "路地裏のイントロ",
    description: "よく耳に残る、馴染み深く短い旋律。灯里の歌に、街路の返す残響が少しだけ重なる。",
    cost: 80,
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
  {
    id: "prebroadcastAcapella",
    name: "配信前夜のアカペラ",
    description:
      "配信を始める前の声のテスト。マイクを通さない生声は思いのほか遠くまで届く。届いたことを、誰も教えてくれないけれど。",
    cost: 6000,
    effectDescription: "ライブ1回の灯るさ +8",
    effects: [
      {
        type: "manual.gain.add",
        resourceId: "tomorusa",
        amount: 8
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "temporaryBroadcastBooth",
      level: 2
    }
  },
  {
    id: "songOfRecords",
    name: "記録の歌",
    description:
      "書かれたものを声に出すと、文字が少しだけ鮮明になるという噂が図書館の利用者のあいだにある。巡は、そういうものかもしれないと言い、試す人をとめない。",
    cost: 20000,
    effectDescription: "施設の灯るさ生産 x1.15",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.15
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "memoryLibrary",
      level: 3
    }
  },
  {
    id: "plazaAnthem",
    name: "広場のアンセム",
    description:
      "広場に人が集まる時間に流れる、テンポの速い曲。小春が一番前で手拍子をとるので、初めて来た人もすぐ合わせられる。",
    cost: 30000,
    effectDescription: "ライブ1回の灯るさ獲得に、全施設合計の灯るさ/秒 x0.08 を加算",
    effects: [
      {
        type: "manual.gain.add.production.ratio",
        ratio: 0.08
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundPlaza",
      level: 3
    }
  },
  {
    id: "chapelHarmony",
    name: "礼拝堂のハーモニー",
    description: "地下礼拝堂に残されていた、遊び心満載の楽曲。古い区画の響きを、アイドルのステージに合う明るいハーモニーへ編み直している。",
    cost: 450,
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
  {
    id: "twilightChorus",
    name: "薄明のコーラス",
    description: "霞の濃い通路にもよく響く合唱。複数の区画にまたがって灯りの流れを整える作用がある。",
    cost: 1800,
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
] as const satisfies readonly SongDefinition[]);

export type SongId = ContentId<typeof SONG_DEFINITIONS>;

export const SONGS: Record<SongId, SongDefinition> = toContentMap(SONG_DEFINITIONS);

export const SONG_ORDER: SongId[] = toContentOrder(SONG_DEFINITIONS);
