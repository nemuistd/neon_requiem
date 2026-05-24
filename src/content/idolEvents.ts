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
  }
] as const satisfies readonly IdolEventDefinition[]);

export type IdolEventId = ContentId<typeof IDOL_EVENT_DEFINITIONS>;

export const IDOL_EVENTS: Record<IdolEventId, IdolEventDefinition> = toContentMap(IDOL_EVENT_DEFINITIONS);

export const IDOL_EVENT_ORDER: IdolEventId[] = toContentOrder(IDOL_EVENT_DEFINITIONS);
