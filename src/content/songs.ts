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
      level: 8
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
      type: "all",
      requirements: [
        {
          type: "idol.joined",
          idolId: "kaminoMeguri"
        },
        {
          type: "facility.level",
          facilityId: "memoryLibrary",
          level: 10
        }
      ]
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
      type: "all",
      requirements: [
        {
          type: "idol.joined",
          idolId: "hinataKoharu"
        },
        {
          type: "facility.level",
          facilityId: "undergroundPlaza",
          level: 10
        }
      ]
    }
  },
  {
    id: "chapelHarmony",
    name: "礼拝堂のハーモニー",
    description: "地下礼拝堂に残されていた、遊び心満載の楽曲。古い区画の響きを、アイドルのステージに合う明るいハーモニーへ編み直している。",
    cost: 25000,
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
      level: 8
    }
  },
  {
    id: "twilightChorus",
    name: "薄明のコーラス",
    description: "霞の濃い通路にもよく響く合唱。複数の区画にまたがって灯りの流れを整える作用がある。",
    cost: 90000,
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
      level: 15
    }
  },
  {
    id: "restorationHumming",
    name: "修復の仮歌",
    description:
      "桜子が作業しながら口ずさんでいるのを誰かが録音した。本人は歌っているつもりはなかったと言ったが、次の日も同じ旋律を繰り返していた。",
    cost: 80000,
    effectDescription: "オフライン灯るさ報酬 x1.10",
    effects: [
      {
        type: "offline.reward.multiplier",
        multiplier: 1.1
      }
    ],
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "idol.joined",
          idolId: "tsuginohataSakurako"
        },
        {
          type: "facility.level",
          facilityId: "undergroundPassageRepair",
          level: 10
        }
      ]
    }
  },
  {
    id: "deepLayerSilence",
    name: "深層の静謐",
    description:
      "音が少ない場所ほど、音は遠くまで届く。澪はそう言って、深層観測所で毎日一曲だけ歌う。それ以上は歌わない。それ以上必要ないのだと言う。",
    cost: 400000,
    effectDescription: "深層施設の灯るさ生産 x1.25",
    effects: [
      {
        type: "facility.production.multiplier.tag",
        tag: "deep",
        multiplier: 1.25
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "deepLayerObservatory",
      level: 10
    }
  },
  {
    id: "fragmentMelody",
    name: "断片の旋律",
    description:
      "工学記録の端に残っていた楽譜の断片。皐月は、歌うためのものとは限らないと言いながら、静かに声に出して読んだ。",
    cost: 1000000,
    effectDescription: "歌・アイテム取得コスト x0.80",
    effects: [
      {
        type: "song.cost.multiplier",
        multiplier: 0.8
      },
      {
        type: "item.cost.multiplier",
        multiplier: 0.8
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "engineeringArchive",
      level: 10
    }
  },
  {
    id: "theLastName",
    name: "最後の名前",
    description:
      "かつての名前を失って霞に沈んだ場所を、ここまで灯し直してきた。名前のない劇場は、別の話だ。最初から名前を持たなかった何かに初めて名前が与えられる場所として、燐が歌う。",
    cost: 20000000,
    effectDescription: "施設の灯るさ生産 x1.30 / 記憶断片の獲得見込み +20%",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.3
      },
      {
        type: "memory.fragment.production.add",
        ratio: 0.2
      }
    ],
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 2
        },
        {
          type: "idol.joined",
          idolId: "shiragiriRin"
        },
        {
          type: "facility.level",
          facilityId: "unnamedTheater",
          level: 10
        }
      ]
    }
  }
] as const satisfies readonly SongDefinition[]);

export type SongId = ContentId<typeof SONG_DEFINITIONS>;

export const SONGS: Record<SongId, SongDefinition> = toContentMap(SONG_DEFINITIONS);

export const SONG_ORDER: SongId[] = toContentOrder(SONG_DEFINITIONS);
