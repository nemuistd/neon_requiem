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
      level: 5
    }
  },
  {
    id: "temporaryBroadcastBooth",
    name: "仮設配信ブース",
    description:
      "電波塔の残骸から引いた細い回線と、防音とは言えない仮囲い。どこまで届いているかは分からないが、今日の公演を外へ向けて送り出す。",
    baseCost: 5000,
    costMultiplier: 1.22,
    productionPerLevel: 4,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "twilightPathGuide",
      level: 1
    }
  },
  {
    id: "memoryLibrary",
    name: "記憶図書館",
    description:
      "地下区画の一角に残されていた文書保管施設。棚の多くは空だが、整理されたものと放置されたものが混在している。著者不明の背表紙が、どの棚にも何冊かある。",
    baseCost: 15000,
    costMultiplier: 1.25,
    productionPerLevel: 8,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "temporaryBroadcastBooth",
      level: 5
    }
  },
  {
    id: "recordingStorage",
    name: "録音保管庫",
    description:
      "磁気テープと録音媒体をまとめた保管庫。劣化した媒体が多いが、再生可能なものは今でも誰かの声を返す。何度も再生されたと分かる媒体が、棚の前の方に並んでいる。",
    baseCost: 12000,
    costMultiplier: 1.23,
    productionPerLevel: 6,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "memoryLibrary",
      level: 1
    }
  },
  {
    id: "oldBroadcastRoom",
    name: "古い放送室",
    description:
      "録音保管庫の奥で見つかった旧式の放送設備。古いマイクとスピーカーの一部はまだ動き、公演情報や短い挨拶を区画の奥へ送り直せる。",
    baseCost: 26000,
    costMultiplier: 1.24,
    productionPerLevel: 11,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "recordingStorage",
      level: 2
    }
  },
  {
    id: "undergroundPlaza",
    name: "地下広場",
    description:
      "かつて市場として使われていたと思われる広い空間。人が多く集まる場所だが、何もない時間は奇妙に静かだ。小春が告知を貼り始めてから、立ち止まる時間が少しずつ長くなった。",
    baseCost: 20000,
    costMultiplier: 1.25,
    productionPerLevel: 10,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "memoryLibrary",
      level: 3
    }
  },
  {
    id: "nameRecordWall",
    name: "名前の記録壁",
    description:
      "地下広場の奥に設けた、来場者や公演名を書いた紙片を残すための壁。呼ばれた名前、戻ってきた名前、まだ確認できない名前が、消えないように一枚ずつ貼られている。",
    tags: ["memory"],
    baseCost: 45000,
    costMultiplier: 1.26,
    productionPerLevel: 14,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "undergroundPlaza",
      level: 4
    }
  },
  {
    id: "undergroundChapel",
    name: "地下礼拝堂",
    description:
      "崩れかけた柱と古い紋章が残る小さな礼拝堂。地下深くに閉ざされていた響きを、後の復興段階で少しずつ調べていく場所。",
    baseCost: 900,
    costMultiplier: 1.25,
    productionPerLevel: 1,
    unlockRequirement: {
      type: "facility.level",
      facilityId: "nameRecordWall",
      level: 3
    }
  }
] as const satisfies readonly FacilityDefinition[]);

export type FacilityId = ContentId<typeof FACILITY_DEFINITIONS>;

export const FACILITIES: Record<FacilityId, FacilityDefinition> = toContentMap(FACILITY_DEFINITIONS);

export const FACILITY_ORDER: FacilityId[] = toContentOrder(FACILITY_DEFINITIONS);
