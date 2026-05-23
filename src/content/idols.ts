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
    id: "hibikiTooko",
    name: "響木 遠子",
    reading: "ひびき とおこ",
    title: "仮設配信ブースの届け手",
    description:
      "どこまで届いているかを確認する方法はない。それでも遠子は今日も配信を続ける。声が届くかどうかより、続けることの方が仕事だからと言う。",
    passiveDescription: "ライブ1回の灯るさ獲得に、全施設合計の秒間灯るさ x0.05 を加算",
    passiveEffects: [
      {
        type: "manual.gain.add.production.ratio",
        ratio: 0.05
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "temporaryBroadcastBooth",
      level: 3
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
  {
    id: "kaminoMeguri",
    name: "紙野 巡",
    reading: "かみの めぐり",
    title: "記憶図書館の整理係",
    description:
      "名前がないと、どこにも置けない。巡はそう言いながら、著者不明の文書をひとつずつ棚に戻す。名前を与えることが彼女の仕事で、その手が止まる記録は一つだけある。",
    passiveDescription: "全アイドルの交流増加量 x1.25",
    passiveEffects: [
      {
        type: "bond.rate.multiplier",
        multiplier: 1.25
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "memoryLibrary",
      level: 2
    }
  },
  {
    id: "hinataKoharu",
    name: "陽向 小春",
    reading: "ひなた こはる",
    title: "地下広場の呼び込み",
    description:
      "大声でよく笑い、会ったばかりの人の名前を必ず覚える。次に会った時には必ず呼ぶ。名前を呼ぶのは礼儀だから、と彼女は言う。それ以上の理由があるかどうか、本人は話さない。",
    passiveDescription: "全灯るさ生産 x1.08 / アイテム購入コスト x0.90",
    passiveEffects: [
      {
        type: "facility.production.multiplier",
        multiplier: 1.08
      },
      {
        type: "item.cost.multiplier",
        multiplier: 0.9
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundPlaza",
      level: 1
    }
  },
  {
    id: "tsuginohataSakurako",
    name: "継ノ端 桜子",
    reading: "つぎのはた さくらこ",
    title: "地下通路の修復士",
    description:
      "壊れたのではなく、外されていたものがある。桜子はそう言って修理という言葉を使うのをやめた。何を復元しているのかを正確に知っているような手つきで、通路を一本ずつつなぎ直す。",
    passiveDescription: "オフライン灯るさ報酬 x1.15",
    passiveEffects: [
      {
        type: "offline.reward.multiplier",
        multiplier: 1.15
      }
    ],
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundPassageRepair",
      level: 1
    }
  }
] as const satisfies readonly IdolDefinition[]);

export type IdolId = ContentId<typeof IDOL_DEFINITIONS>;

export const IDOLS: Record<IdolId, IdolDefinition> = toContentMap(IDOL_DEFINITIONS);

export const IDOL_ORDER: IdolId[] = toContentOrder(IDOL_DEFINITIONS);
