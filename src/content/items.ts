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
      level: 6
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
      level: 3
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
      level: 2
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
      level: 1
    }
  },
  {
    id: "handwrittenListenerLog",
    name: "手書きのリスナー名簿",
    description:
      "配信を聞いていると思われる人の名前を書き留めたメモ。確認できていない名前がほとんどだが、書いた分だけ届いている可能性が残る。",
    cost: 4000,
    effectDescription: "施設の灯るさ生産 x1.06",
    effects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.06
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "temporaryBroadcastBooth",
      level: 3
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
      type: "facility.level",
      facilityId: "memoryLibrary",
      level: 2
    }
  }
] as const satisfies readonly ItemDefinition[]);

export type ItemId = ContentId<typeof ITEM_DEFINITIONS>;

export const ITEMS: Record<ItemId, ItemDefinition> = toContentMap(ITEM_DEFINITIONS);

export const ITEM_ORDER: ItemId[] = toContentOrder(ITEM_DEFINITIONS);
