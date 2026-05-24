import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { MeguriBuffDefinition } from "./types.js";

export const MEGURI_BUFF_DEFINITIONS = defineContent([
  {
    id: "footstepResonance",
    name: "足元に残る残響",
    description: "一度たたんだ街の足音が、次の復興で少しだけ先に響く。",
    cost: 3,
    effectDescription: "廻後の施設生産倍率 x1.08",
    effects: [
      {
        type: "rebirth.bonus.multiplier",
        multiplier: 1.08
      }
    ]
  },
  {
    id: "leftWorkMemo",
    name: "残された作業メモ",
    description: "誰かが残した手順が、不在の間の復旧をわずかに助ける。",
    cost: 3,
    effectDescription: "オフライン灯るさ報酬 x1.15",
    effects: [
      {
        type: "offline.reward.multiplier",
        multiplier: 1.15
      }
    ]
  },
  {
    id: "rememberedCallsign",
    name: "覚えのある呼び名",
    description: "名前を呼ぶ声の感触だけが残り、次の交流が少し近くなる。",
    cost: 4,
    effectDescription: "交流増加量 x1.15",
    effects: [
      {
        type: "bond.rate.multiplier",
        multiplier: 1.15
      }
    ]
  },
  {
    id: "fragmentIndex",
    name: "断片の索引",
    description: "記憶断片の輪郭を拾いやすくするための、短い索引。",
    cost: 5,
    effectDescription: "記憶断片の獲得見込み +20%",
    effects: [
      {
        type: "memory.fragment.production.add",
        ratio: 0.2
      }
    ]
  }
] as const satisfies readonly MeguriBuffDefinition[]);

export type MeguriBuffId = ContentId<typeof MEGURI_BUFF_DEFINITIONS>;

export const MEGURI_BUFFS: Record<MeguriBuffId, MeguriBuffDefinition> = toContentMap(MEGURI_BUFF_DEFINITIONS);

export const MEGURI_BUFF_ORDER: MeguriBuffId[] = toContentOrder(MEGURI_BUFF_DEFINITIONS);
