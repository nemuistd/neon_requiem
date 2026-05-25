import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { IdolEventDefinition } from "./types.js";

export const IDOL_EVENT_DEFINITIONS = defineContent([
  {
    id: "otowaAkari.firstSeat",
    idolId: "otowaAkari",
    title: "灯里・客席の灯",
    revealLevel: "surface",
    body:
      "ライブの後、灯里は最前列の壊れた椅子を一脚だけ直していた。「誰かがまた座る場所、先に作っておきたいんです」",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "otowaAkari",
      amount: 5
    },
    introducedAtVersion: 12
  },
  {
    id: "asagiriYui.twilightStreetGuide",
    idolId: "asagiriYui",
    title: "結・薄明通りの案内",
    revealLevel: "surface",
    body:
      "霞で読めなくなった案内板の前で、結は迷わず横道を指した。「足が覚えてるんです。来たことは、たぶんないんですけど」",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "asagiriYui",
      amount: 5
    },
    introducedAtVersion: 13
  },
  {
    id: "mizukiShino.storageShelf",
    idolId: "mizukiShino",
    title: "詩乃・出所不明の冊子",
    revealLevel: "surface",
    body:
      "保管棚の端で、詩乃は著者不明の薄い冊子をそっと置いた。「出所が分からないものほど、なくしたら戻せません」",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "mizukiShino",
      amount: 5
    },
    introducedAtVersion: 13
  },
  {
    id: "hibikiTooko.preBroadcastCheck",
    idolId: "hibikiTooko",
    title: "遠子・配信前の確認",
    revealLevel: "surface",
    body:
      "配信前の機材チェック中、遠子はスイッチを一つずつ確認してから言った。「いないと決めつけると声が変わる気がするから、いる前提で話します」",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "hibikiTooko",
      amount: 5
    },
    introducedAtVersion: 13
  },
  {
    id: "kaminoMeguri.unknownAuthorProof",
    idolId: "kaminoMeguri",
    title: "巡・著者不明の証明",
    revealLevel: "surface",
    body:
      "著者不明の記録を棚に戻しながら、巡は背表紙を指で押さえた。「名前がなくても、残っていることには意味があります。著者不明は、ここにあるという証明です」",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "kaminoMeguri",
      amount: 5
    },
    introducedAtVersion: 13
  },
  {
    id: "kasumiyamaMio.mistObservation",
    idolId: "kasumiyamaMio",
    title: "澪・霞の観測",
    revealLevel: "technical",
    body:
      "霞が濃い通路の前で、澪はしばらく黙っていた。「霞は観測対象だから」怖くないのかと訊くと、「怖いかどうかより、何をしているかを見ていたほうがいい」とだけ答えた。",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "kasumiyamaMio",
      amount: 5
    },
    introducedAtVersion: 14
  },
  {
    id: "nanashiroSatsuki.readableUnknown",
    idolId: "nanashiroSatsuki",
    title: "皐月・読める、でも分からない",
    revealLevel: "technical",
    body:
      "工学記録の束を前に、皐月は行を指で追いながら言った。「これは観測者数の記録。多分」多分、と聞き返すと、「読めるけど、理解しているかどうかは別。読んだことを、正しいと思い込まないようにしてる」と答えた。",
    unlockRequirement: {
      type: "idol.bond",
      idolId: "nanashiroSatsuki",
      amount: 5
    },
    introducedAtVersion: 15
  },
  {
    id: "otowaAkari.twilightFirstPause",
    idolId: "otowaAkari",
    title: "灯里・一拍遅い返事",
    eventKind: "twilightMemory",
    revealLevel: "uncanny",
    body:
      "名前を呼ぶと、灯里は一拍だけ遅れて振り向いた。「……はい。変ですね。初めてなのに、その声の近さだけ、少し安心します」",
    unlockRequirement: {
      type: "all",
      requirements: [
        {
          type: "meguri.count",
          count: 1
        },
        {
          type: "meguri.idolRecognition",
          idolId: "otowaAkari"
        },
        {
          type: "idol.bond",
          idolId: "otowaAkari",
          amount: 5
        }
      ]
    },
    introducedAtVersion: 12
  }
] as const satisfies readonly IdolEventDefinition[]);

export type IdolEventId = ContentId<typeof IDOL_EVENT_DEFINITIONS>;

export const IDOL_EVENTS: Record<IdolEventId, IdolEventDefinition> = toContentMap(IDOL_EVENT_DEFINITIONS);

export const IDOL_EVENT_ORDER: IdolEventId[] = toContentOrder(IDOL_EVENT_DEFINITIONS);
