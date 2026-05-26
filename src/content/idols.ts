import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { IdolDefinition } from "./types.js";

export const IDOL_DEFINITIONS = defineContent([
  {
    id: "otowaAkari",
    name: "音羽 灯里",
    reading: "おとは あかり",
    title: "路地裏の歌姫",
    description:
      "誰もいない路地裏で、灯里は一人で歌い続けていた。客がいなくても、曲が終わると次を始める。それが自然なことであるかのように。彼女の声が届く場所では、路地裏の空気が少し明るくなる気がする。",
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
  //こっちのフレーバーテキストも好きなので一旦アーカイブとして残しておく。「結のよく通る歌声は、霞の濃い通路で迷う人々の道標であった。彼女の笑顔は、足元の頼りない道を踏みしめる勇気をくれるのだ。」
  {
    id: "asagiriYui",
    name: "朝霧 結",
    reading: "あさぎり ゆい",
    title: "薄明通りの案内係",
    description:
      "霞の濃い通路でも、地図のない抜け道でも、結はほとんど迷わない。「前に誰かに教えてもらった気がする」と言う。でも誰に教わったのかは、自分でも分からないらしい。",
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
      "配信の届く先を確認する方法は、長い間なかった。施設に受信計が加わってから、針が振れた日と振れなかった日の区別がつくようになった。誰が聞いているかは分からないし、遠子は確かめずともよいという。",
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
      level: 5
    }
  },
  {
    id: "kaminoMeguri",
    name: "紙野 巡",
    reading: "かみの めぐり",
    title: "記憶図書館の整理係",
    description:
      "「著者が不明の文書が多すぎますね」と言いながら、巡はそれらをひとつずつ棚に戻す。名前のないものを正しく分類する方法を、彼女はまだ決めていない。一冊だけ、分類の手が長く止まった場所がある。",
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
      level: 5
    }
  },
  {
    id: "hinataKoharu",
    name: "陽向 小春",
    reading: "ひなた こはる",
    title: "地下広場の呼び込み",
    description:
      //"朗らかによく笑い、出会った一人一人をよく記憶している。再会の度にファンを名前で呼んでいるのがその証拠だ。私には必要なことなの、と小春は言う。その言い方の中に、もっと理由があるようにも聞こえてしまう。"
      "名前を呼ぶのは礼儀だと言って、再会するたびにファンの名前を呼ぶ。彼女が名前を呼ぶと相手の輪郭が鮮明になる気がする、と言う人がいる。本人はそれを気にしていないらしいが、そう言われると決まって話題が変わる。",
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
      level: 5
    }
  },
  {
    id: "mizukiShino",
    name: "深月 詩乃",
    reading: "みづき しの",
    title: "地下礼拝堂の保管係",
    description:
      "地下礼拝堂で、詩乃は声の届く場所を守っている。出所の分からない記録も捨てない。いつか誰かが意味を分かるかもしれないから、と言う。礼拝堂の記録には、後から削られた形跡のある箇所がある。",
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
      level: 5
    }
  },
  {
    id: "tsuginohataSakurako",
    name: "継ノ端 桜子",
    reading: "つぎのはた さくらこ",
    title: "地下通路の修復士",
    description:
      "壊れた訳でもないのに、使われなくなるものがある。桜子はそう言って、修理という言い方を避けている。手を触れれば、物が傷んでいるのか、それとも別の理由で用途を失っているのかは分かる、と言う。",
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
      level: 5
    }
  },
  {
    id: "kasumiyamaMio",
    name: "霞山 澪",
    reading: "かすみやま みお",
    title: "深層観測所の番人",
    description:
      "深層観測所に、誰かが辿り着くより先からいたようだ。霞の変化を記録する時、感情的な言葉を使わない。霞が増えた場所は廃れると人々は言うが、澪の記録にはその逆の順番で書かれている。",
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
          level: 5
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
      "祈念工学の文書を読める、数少ない人間のひとりだ。読めることと理解できることは別だと言い続けている。ある時から、彼女が訳した断片と夢の中の言葉が一致することがある——どちらが先にあったのかは、まだ分からない。",
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
          level: 5
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
      "二度、あるいはそれ以上の廻を経て、初めて彼女の元に辿りついた。「また来たね」が彼女の挨拶だ。覚えているわけではなくとも、分かるのだと言う。廻と廻のあいだで何かが引き継がれているという、その感覚だけが彼女には確かにある。",
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
          level: 5
        }
      ]
    }
  }
] as const satisfies readonly IdolDefinition[]);

export type IdolId = ContentId<typeof IDOL_DEFINITIONS>;

export const IDOLS: Record<IdolId, IdolDefinition> = toContentMap(IDOL_DEFINITIONS);

export const IDOL_ORDER: IdolId[] = toContentOrder(IDOL_DEFINITIONS);
