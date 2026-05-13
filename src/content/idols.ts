import { IdolDefinition, IdolId } from "./types.js";

export const IDOLS: Record<IdolId, IdolDefinition> = {
  otowaAkari: {
    id: "otowaAkari",
    name: "音羽 灯里",
    reading: "おとは あかり",
    title: "路地裏の歌姫",
    description:
      "灯里は、寂れた路地裏でもなお歌い続けていた。澄んだ声が響くたび、ひび割れた街路に小さな灯りが戻っていく。",
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
      "詩乃は、閉ざされた地下礼拝堂で失われた歌を守っていた。聞く人々の安息を守り、心を守る最後の歌手として。",
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
      "結のよく通る歌声は、霞の濃い通路で迷う人々の道標であった。彼女の笑顔は、足元の頼りない道を踏みしめる勇気をくれるのだ。",
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
