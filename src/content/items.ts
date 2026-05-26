import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { ItemDefinition } from "./types.js";

export const ITEM_DEFINITIONS = defineContent([
  {
    id: "oldNeonTube",
    name: "古いネオン管",
    description: "古いがまだ光るネオン管。路地裏ステージの輪郭を少しだけ強くする。",
    cost: 100,
    effectDescription: "施設の灯るさ生産 x1.05",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.05
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "alleyStage",
      level: 3
    }
  },
  {
    id: "handwrittenPoster",
    name: "手書きの告知ポスター",
    description: "名前を見える場所に残すためのポスター。ライブの予定を、通りの人にも分かるように書き留める。",
    cost: 140,
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
      level: 4
    }
  },
  {
    id: "ticketStubBundle",
    name: "半券の束",
    description: "来てくれた人に渡す小さな半券。次のライブの予定を思い出しやすくするため、入口の箱にまとめて置いておく。",
    cost: 220,
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
    id: "portableSpotlight",
    name: "携帯スポットライト",
    description: "小さなステージでも使える持ち運び式の照明。足元と看板を照らし、復旧作業の手順を見つけやすくする。",
    cost: 260,
    effectDescription: "施設の灯るさ生産 x1.04",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.04
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "alleyStage",
      level: 8
    }
  },
  {
    id: "shiftNoticeBoard",
    name: "交代用連絡ボード",
    description: "片付けや見回りの予定を書き残すための小さなボード。不在の間も、できる作業が少しずつ進むようになる。",
    cost: 500,
    effectDescription: "オフライン灯るさ報酬 x1.10",
    effects: [
      {
        type: "offline.reward.multiplier",
        multiplier: 1.1
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "neonBoard",
      level: 5
    }
  },
  {
    id: "recordedGreeting",
    name: "録音済みの短い挨拶",
    description: "不在の時間にも、誰かがその声を思い出せるようにする短い録音。",
    cost: 600,
    effectDescription: "施設の灯るさ生産 x1.03",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.03
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "neonBoard",
      level: 8
    }
  },
  {
    id: "oldRadioTowerDebris",
    name: "古い電波塔の残骸",
    description:
      "配信ブースの回線を延ばすために使った、電波塔の部品。元の用途がなくなっても、信号を引く仕事はまだできる。",
    cost: 3000,
    effectDescription: "ライブ1回の灯るさ +5",
    effects: [
      {
        type: "manual.gain.add",
        resourceId: "tomorusa",
        amount: 5
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "temporaryBroadcastBooth",
      level: 3
    }
  },
  {
    id: "regularBroadcastTimetable",
    name: "定期配信の時刻表",
    description:
      "配信の時間を、決めていくことにした。受信計の針が振れる時間帯がある。聞いている人がいるなら、そこに合わせようと遠子は言う。時刻表の端には、針が振れた日に小さな印が増えていく。",
    cost: 4000,
    effectDescription: "施設の灯るさ生産 x1.06",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.06
      }
    ],
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "idol.joined",
          idolId: "hibikiTooko"
        },
        {
          type: "facility.level",
          facilityId: "temporaryBroadcastBooth",
          level: 10
        }
      ]
    }
  },
  {
    id: "fadedBookLabel",
    name: "色あせた書名ラベル",
    description:
      "棚から落ちた書名ラベル。文字が薄くて読めないものも含め、巡はすべてに鉛筆で著者不明か番号を書いて貼り直している。",
    cost: 10000,
    effectDescription: "交流増加量 x1.10",
    effects: [
      {
        type: "bond.rate.multiplier",
        multiplier: 1.1
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
          level: 8
        }
      ]
    }
  },
  {
    id: "broadcastEquipmentManual",
    name: "放送室の機材マニュアル",
    description:
      "かつての放送室で使われていた機材の説明書。機材そのものはほとんど残っていないが、音響の基礎から始まっており、今でも参考になる部分がある。",
    cost: 15000,
    effectDescription: "オフライン灯るさ報酬 x1.10",
    effects: [
      {
        type: "offline.reward.multiplier",
        multiplier: 1.1
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "recordingStorage",
      level: 5
    }
  },
  {
    id: "repairToolSet",
    name: "修復用の工具一式",
    description:
      "桜子がまとめた修復用具のセット。使い込まれた道具が多いが、どれも手入れが行き届いている。道具には名前をつけた方がいい、と桜子は言う。",
    cost: 50000,
    effectDescription: "施設の灯るさ生産 x1.08",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.08
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
          level: 8
        }
      ]
    }
  },
  {
    id: "coverlessObservationLog",
    name: "観測記録用の表紙のない日誌",
    description:
      "澪が使っている観測日誌。表紙がない。最初からないのか、取れたのか分からない。日付の書き方は、何日目ではなく何周目・何日目という形式になっている。",
    cost: 200000,
    effectDescription: "深層施設の灯るさ生産 x1.12",
    effects: [
      {
        type: "facility.production.multiplier.tag",
        tag: "deep",
        multiplier: 1.12
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "deepLayerObservatory",
      level: 8
    }
  },
  {
    id: "sortedEngineeringFragment",
    name: "工学文書の断片（整理済み）",
    description:
      "皐月が翻訳・整理した工学文書の断片。難解な用語は残されているが、文脈は少しだけ追いやすくなっている。",
    cost: 500000,
    effectDescription: "歌取得コスト x0.85",
    effects: [
      {
        type: "song.cost.multiplier",
        multiplier: 0.85
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "engineeringArchive",
      level: 8
    }
  }
] as const satisfies readonly ItemDefinition[]);

export type ItemId = ContentId<typeof ITEM_DEFINITIONS>;

export const ITEMS: Record<ItemId, ItemDefinition> = toContentMap(ITEM_DEFINITIONS);

export const ITEM_ORDER: ItemId[] = toContentOrder(ITEM_DEFINITIONS);
