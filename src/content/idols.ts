import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { IdolDefinition } from "./types.js";

export const IDOL_DEFINITIONS = defineContent([
  {
    id: "otowaAkari",
    name: "音羽 灯里",
    reading: "おとは あかり",
    title: "路地裏の歌姫",
    description:
      "灯里は、寂れた路地裏でもなお歌い続けていた。澄んだ声が響くたび、ひび割れた街路に小さな灯りが戻っていく。",
    imageUrl: new URL("../../assets/idol/ComfyUI_00021_.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "全灯るさ生産 +20%",
    passiveEffects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.2
      }
    ]
  },
  {
    id: "asagiriYui",
    name: "朝霧 結",
    reading: "あさぎり ゆい",
    title: "薄明通りの案内係",
    description:
      "結のよく通る歌声は、霞の濃い通路で迷う人々の道標であった。彼女の笑顔は、足元の頼りない道を踏みしめる勇気をくれるのだ。",
    imageUrl: new URL("../../assets/idol/ComfyUI_00027_.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "全灯るさ生産 +15%",
    passiveEffects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.15
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "neonBoard",
      level: 5
    }
  },
  {
    id: "mizukiShino",
    name: "深月 詩乃",
    reading: "みづき しの",
    title: "地下礼拝堂の保管係",
    description:
      "詩乃は、閉ざされた地下礼拝堂で失われた響きを守っていた。静かな声で、深い区画に残された記録と歌の断片をたぐり寄せる。",
    imageUrl: new URL("../../assets/idol/ComfyUI_00022_.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "全灯るさ生産 +10%",
    passiveEffects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.1
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundChapel",
      level: 3
    }
  },

] as const satisfies readonly IdolDefinition[]);

export type IdolId = ContentId<typeof IDOL_DEFINITIONS>;

export const IDOLS: Record<IdolId, IdolDefinition> = toContentMap(IDOL_DEFINITIONS);

export const IDOL_ORDER: IdolId[] = toContentOrder(IDOL_DEFINITIONS);
