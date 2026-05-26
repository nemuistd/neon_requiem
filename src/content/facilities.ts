import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { FacilityDefinition } from "./types.js";

export const FACILITY_DEFINITIONS = defineContent([
  {
    id: "alleyStage",
    name: "路地裏ステージ",
    description:
      "古いスピーカー、拾い集めたネオン管、小規模な舞台で組まれた仮設ステージ。静まり返った地下へ歌を響かせる最初の拠点。",
    baseCost: 10,
    costMultiplier: 1.15,
    productionPerLevel: 0.1
  },
  {
    id: "neonBoard",
    name: "ネオン掲示板",
    description:
      "ライブ告知とアイドルの名前を掲げる古い電光掲示板。通りすがりの人々が名前を目にするたび、路地に少しずつ賑わいが戻っていく。",
    baseCost: 80,
    costMultiplier: 1.18,
    productionPerLevel: 0.35,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "alleyStage",
      level: 10
    }
  },
  {
    id: "twilightPathGuide",
    name: "薄明通り案内所",
    description:
      "霞の濃い通路の入口に設けられた小さな案内所。貼り替えられる告知と手書きの地図が、薄明通りへ踏み出す人の足元を支える。",
    tags: ["infra"],
    baseCost: 3000,
    costMultiplier: 1.22,
    productionPerLevel: 3,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "neonBoard",
      level: 15
    }
  },
  {
    id: "temporaryBroadcastBooth",
    name: "仮設配信ブース",
    description:
      "電波塔の残骸から引いた細い回線と、防音とは言えない仮囲い。どこまで届いているかは分からないが、今日の公演を外へ向けて送り出す。",
    baseCost: 55000,
    costMultiplier: 1.2,
    productionPerLevel: 18,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "twilightPathGuide",
      level: 15
    }
  },
  {
    id: "memoryLibrary",
    name: "記憶図書館",
    description:
      "地下区画の一角に残されていた文書保管施設。棚の多くは空だが、整理されたものと放置されたものが混在している。著者不明の背表紙が、どの棚にも何冊かある。",
    baseCost: 120000,
    costMultiplier: 1.2,
    productionPerLevel: 55,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "temporaryBroadcastBooth",
      level: 15
    }
  },
  {
    id: "recordingStorage",
    name: "録音保管庫",
    description:
      "磁気テープと録音媒体をまとめた保管庫。劣化した媒体が多いが、再生可能なものは今でも誰かの声を返す。何度も再生されたと分かる媒体が、棚の前の方に並んでいる。",
    baseCost: 450000,
    costMultiplier: 1.18,
    productionPerLevel: 140,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "memoryLibrary",
      level: 15
    }
  },
  {
    id: "oldBroadcastRoom",
    name: "古い放送室",
    description:
      "録音保管庫の奥で見つかった旧式の放送設備。古いマイクとスピーカーの一部はまだ動き、公演情報や短い挨拶を区画の奥へ送り直せる。",
    baseCost: 500000,
    costMultiplier: 1.18,
    productionPerLevel: 170,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "recordingStorage",
      level: 15
    }
  },
  {
    id: "undergroundPlaza",
    name: "地下広場",
    description:
      "かつて市場として使われていたと思われる広い空間。人が多く集まる場所だが、何もない時間は奇妙に静かだ。小春が告知を貼り始めてから、立ち止まる時間が少しずつ長くなった。",
    baseCost: 900000,
    costMultiplier: 1.18,
    productionPerLevel: 320,
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "facility.level",
          facilityId: "memoryLibrary",
          level: 18
        },
        {
          type: "facility.level",
          facilityId: "oldBroadcastRoom",
          level: 15
        }
      ]
    }
  },
  {
    id: "nameRecordWall",
    name: "名前の記録壁",
    description:
      "地下広場の奥に設けた、来場者や公演名を書いた紙片を残すための壁。呼ばれた名前、戻ってきた名前、まだ確認できない名前が、消えないように一枚ずつ貼られている。",
    tags: ["memory"],
    baseCost: 1100000,
    costMultiplier: 1.17,
    productionPerLevel: 380,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundPlaza",
      level: 15
    }
  },
  {
    id: "undergroundChapel",
    name: "地下礼拝堂",
    description:
      "崩れかけた柱と古い紋章が残る小さな礼拝堂。地下深くに閉ざされていた響きを、後の復興段階で少しずつ調べていく場所。",
    baseCost: 1800000,
    costMultiplier: 1.17,
    productionPerLevel: 650,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "nameRecordWall",
      level: 15
    }
  },
  {
    id: "undergroundPassageRepair",
    name: "地下通路修復区画",
    description:
      "倒壊した柱と塞がれた通路を復元する作業場。桜子が修理ではなく復元と呼ぶようになった区画でもある。意図的に取り外されたと思われる部品の痕跡が、一部の壁から見つかっている。",
    tags: ["infra"],
    baseCost: 3500000,
    costMultiplier: 1.16,
    productionPerLevel: 1200,
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "facility.level",
          facilityId: "undergroundChapel",
          level: 18
        },
        {
          type: "song.purchased",
          songId: "chapelHarmony"
        }
      ]
    }
  },
  {
    id: "restabilizationCore",
    name: "再固定中枢",
    description:
      "復興した街の状態を一時的に固定し、次の廻へ持ち越せる痕跡へ圧縮するための中枢。稼働そのものは通常施設に近いが、廻を選ぶ瞬間にだけ本来の意味を持つ。",
    tags: ["infra"],
    baseCost: 4200000,
    costMultiplier: 1.16,
    productionPerLevel: 1500,
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "facility.level",
          facilityId: "undergroundPassageRepair",
          level: 15
        },
        {
          type: "song.purchased",
          songId: "restorationHumming"
        }
      ]
    }
  },
  {
    id: "deepLayerObservatory",
    name: "深層観測所",
    description:
      "深層への降路の傍らに建てられた観測所。霞の濃度、発光周期、記録が消えるタイミングを淡々と記録するための前室が残っている。窓の外に何が見えているのかは、まだ分からない。",
    tags: ["deep"],
    baseCost: 8000000,
    costMultiplier: 1.16,
    productionPerLevel: 4000,
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 1
        },
        {
          type: "facility.level",
          facilityId: "restabilizationCore",
          level: 15
        }
      ]
    }
  },
  {
    id: "engineeringArchive",
    name: "工学記録保管区",
    description:
      "旧時代の工学記録を収めた保管区。閉ざされた棚には、読めるが理解できたとは言い切れない文書束が並ぶ。皐月は一冊ずつ、断定を避けるようにラベルを貼り直している。",
    tags: ["deep"],
    baseCost: 22000000,
    costMultiplier: 1.15,
    productionPerLevel: 10000,
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
          level: 15
        }
      ]
    }
  },
  {
    id: "prayerEngineeringRuins",
    name: "祈念工学実験跡地",
    description:
      "大崩壊に関係する実験が行われていたと思われる跡地。設備のほとんどは沈黙しているが、一部の計器だけが今も何かを測り続けている。分かったことより、分からないまま残ったことの方が多い。",
    tags: ["deep"],
    baseCost: 60000000,
    costMultiplier: 1.15,
    productionPerLevel: 24000,
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
          level: 15
        }
      ]
    }
  },
  {
    id: "reobservationBase",
    name: "再観測拠点",
    description:
      "廻の後に整備された新しい拠点。前の廻では存在しなかったはずなのに、バインダーの端にはここの方角を示す短い印が残っていた。ここから先は、復興というより再び観測し直すための場所に近い。",
    tags: ["infra"],
    baseCost: 160000000,
    costMultiplier: 1.14,
    productionPerLevel: 65000,
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 2
        },
        {
          type: "facility.level",
          facilityId: "prayerEngineeringRuins",
          level: 15
        }
      ]
    }
  },
  {
    id: "unnamedTheater",
    name: "名前のない劇場",
    description:
      "名前を持たない場所は、ここにだけある。だからここは消えない。そういう記録が、読めるようになった行の外側に残っている。誰かがここで歌った気配だけが、まだ客席の奥に反響している。",
    baseCost: 450000000,
    costMultiplier: 1.14,
    productionPerLevel: 150000,
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 2
        },
        {
          type: "facility.level",
          facilityId: "reobservationBase",
          level: 15
        }
      ]
    }
  }
] as const satisfies readonly FacilityDefinition[]);

export type FacilityId = ContentId<typeof FACILITY_DEFINITIONS>;

export const FACILITIES: Record<FacilityId, FacilityDefinition> = toContentMap(FACILITY_DEFINITIONS);

export const FACILITY_ORDER: FacilityId[] = toContentOrder(FACILITY_DEFINITIONS);
