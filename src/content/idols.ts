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
      "どこまで届いているかを確認する方法はない。それでも遠子は今日も配信を続ける。曰く、続けていることこそが大事なのだという。",
    imageUrl: new URL("../../assets/idol/hibiki-tooko.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "ライブ1回の灯るさ獲得に、秒間施設清算の 5% を加算",
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
    id: "kaminoMeguri",
    name: "紙野 巡",
    reading: "かみの めぐり",
    title: "記憶図書館の整理係",
    description:
      "著者が不明の文書が多すぎますね。巡はそう呟きながら、それらをひとつずつ棚に戻す。名前の管理こそが彼女の仕事である。ある種の書物を前にして、特別長く行き先に悩んでいる時があるようだ。",
    imageUrl: new URL("../../assets/idol/kamino-meguri.png", import.meta.url).href,
    imagePosition: "center top",
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
      "朗らかによく笑い、出会った一人一人をよく記憶している。再会の度にファンを名前で呼んでいるのがその証拠だ。私には必要なことなの、と小春は言う。その言い方の中に、もっと理由があるようにも聞こえてしまう。",
    imageUrl: new URL("../../assets/idol/hinata-koharu.png", import.meta.url).href,
    imagePosition: "center top",
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
    id: "mizukiShino",
    name: "深月 詩乃",
    reading: "みづき しの",
    title: "地下礼拝堂の保管係",
    description:
      "詩乃は、閉ざされた地下礼拝堂で失われた響きを守っていた。その落ち着いた歌声は、まだ見ぬ区画に残された記録と歌の断片を呼び寄せているかのようだ。",
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
    id: "tsuginohataSakurako",
    name: "継ノ端 桜子",
    reading: "つぎのはた さくらこ",
    title: "地下通路の修復士",
    description:
      "壊れた訳でもないのに、使われなくなるものがある。桜子はそう言って、修理という言い方を避けている。何を復元しているのかを正確に知っているような手つきで、道も建物も道具もいつの間にか使えるようになっている。",
    imageUrl: new URL("../../assets/idol/tsuginohata-sakurako.png", import.meta.url).href,
    imagePosition: "center top",
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
  },
  {
    id: "kasumiyamaMio",
    name: "霞山 澪",
    reading: "かすみやま みお",
    title: "深層観測所の番人",
    description:
      "深層の観測所で、我々が辿り着くよりずっと前から過ごしていたようだ。霞の変化を淡々とした観測記録として残す習慣を続けている。彼女だけは、霞への不明な畏れとは無縁であるように見える。",
    imageUrl: new URL("../../assets/idol/kasumiyama-mio.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "deep施設の灯るさ生産 x1.35",
    passiveEffects: [
      {
        type: "facility.production.multiplier.tag",
        tag: "deep",
        multiplier: 1.35
      }
    ],
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 1
        },
        {
          type: "facility.level",
          facilityId: "deepLayerObservatory",
          level: 1
        }
      ]
    }
  },
  {
    id: "nanashiroSatsuki",
    name: "七城 皐月",
    reading: "ななしろ さつき",
    title: "工学記録の解読者",
    description:
      "祈念工学の文書を読める数少ない一人。当人は、読めることと理解できることは別だと言い続けている。危険な知識を怖がるより、分からないままでも丁寧に扱うことを選んでいる。",
    imageUrl: new URL("../../assets/idol/nanashiro-satsuki.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "歌・アイテム取得コスト x0.85",
    passiveEffects: [
      {
        type: "song.cost.multiplier",
        multiplier: 0.85
      },
      {
        type: "item.cost.multiplier",
        multiplier: 0.85
      }
    ],
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 1
        },
        {
          type: "facility.level",
          facilityId: "engineeringArchive",
          level: 3
        }
      ]
    }
  },
  {
    id: "shiragiriRin",
    name: "白霧 燐",
    reading: "しらぎり りん",
    title: "灯し直しの残響",
    description:
      "「また来たね」とはっきりと挨拶をくれたのは燐が初めてである。しかし覚えているという訳ではないらしい。何を感じ取っているのだろうか。",
    imageUrl: new URL("../../assets/idol/shiragiri-rin.png", import.meta.url).href,
    imagePosition: "center top",
    passiveDescription: "廻後の施設生産倍率 x1.15 / 記憶断片の獲得見込み +30%",
    passiveEffects: [
      {
        type: "rebirth.bonus.multiplier",
        multiplier: 1.15
      },
      {
        type: "memory.fragment.production.add",
        ratio: 0.3
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
          type: "facility.level",
          facilityId: "unnamedTheater",
          level: 1
        }
      ]
    }
  }
] as const satisfies readonly IdolDefinition[]);

export type IdolId = ContentId<typeof IDOL_DEFINITIONS>;

export const IDOLS: Record<IdolId, IdolDefinition> = toContentMap(IDOL_DEFINITIONS);

export const IDOL_ORDER: IdolId[] = toContentOrder(IDOL_DEFINITIONS);
