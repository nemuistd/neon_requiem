import { ItemDefinition, ItemId } from "./types.js";

export const ITEMS: Record<ItemId, ItemDefinition> = {
  oldNeonTube: {
    id: "oldNeonTube",
    name: "古いネオン管",
    description: "古いがまだ光るネオン管。路地裏ステージの輪郭を少しだけ強くする。",
    cost: 150,
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
  handwrittenPoster: {
    id: "handwrittenPoster",
    name: "手書きの告知ポスター",
    description: "名前を見える場所に残すためのポスター。ライブの予定を、通りの人にも分かるように書き留める。",
    cost: 300,
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
  recordedGreeting: {
    id: "recordedGreeting",
    name: "録音済みの短い挨拶",
    description: "不在の時間にも、誰かがその声を思い出せるようにする短い録音。",
    cost: 800,
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
  }
};

export const ITEM_ORDER: ItemId[] = ["oldNeonTube", "handwrittenPoster", "recordedGreeting"];
