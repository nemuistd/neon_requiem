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
