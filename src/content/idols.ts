import { IdolDefinition, IdolId } from "./types.js";

export const IDOLS: Record<IdolId, IdolDefinition> = {
  otowaAkari: {
    id: "otowaAkari",
    name: "音羽 灯里",
    reading: "おとは あかり",
    title: "路地裏の歌姫",
    description:
      "灯里は、明かりの消えた路地裏で歌い続けていた。澄んだ声が響くたび、ひび割れた街路に小さな灯りが戻っていく。",
    imageUrl: new URL("../../assets/idol/ComfyUI_00021_.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "全灯り生産 +20%",
    passiveEffect: {
      type: "globalProductionMultiplier",
      multiplier: 1.2
    }
  },
  mizukiShino: {
    id: "mizukiShino",
    name: "深月 詩乃",
    reading: "みづき しの",
    title: "地下礼拝堂の聖歌係",
    description:
      "詩乃は、閉ざされた地下礼拝堂で失われた歌を守っていた。路地裏の歌が十分に響くと、その声は灯りの残響にそっと重なり始める。",
    imageUrl: new URL("../../assets/idol/ComfyUI_00022_.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "全灯り生産 +10%",
    passiveEffect: {
      type: "globalProductionMultiplier",
      multiplier: 1.1
    },
    unlockRequirement: {
      facilityId: "alleyStage",
      level: 10
    }
  },
  asagiriYui: {
    id: "asagiriYui",
    name: "朝霧 結",
    reading: "あさぎり ゆい",
    title: "薄明通りの案内係",
    description:
      "結は、霞の濃い通路で迷う人々を舞台の灯りへ導いてきた。彼女が笑うと、足元の小さな道しるべがもう一度だけ光を帯びる。",
    imageUrl: new URL("../../assets/idol/ComfyUI_00027_.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "全灯り生産 +15%",
    passiveEffect: {
      type: "globalProductionMultiplier",
      multiplier: 1.15
    },
    unlockRequirement: {
      facilityId: "undergroundChapel",
      level: 5
    }
  }
};

export const IDOL_ORDER: IdolId[] = ["otowaAkari", "mizukiShino", "asagiriYui"];
