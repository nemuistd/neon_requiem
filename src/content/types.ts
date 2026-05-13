import { Effect } from "../engine/effects.js";
import { Requirement } from "../engine/requirements.js";

export type IdolId = "otowaAkari" | "mizukiShino" | "asagiriYui";

export type SongId = "rojiuraIntro" | "chapelHarmony" | "twilightChorus";

export type ItemId = "oldNeonTube" | "handwrittenPoster" | "recordedGreeting";

export type RecordId =
  | "alleyStageRestorationMemo"
  | "lightResponseObservation"
  | "undergroundChapelRestorationReport"
  | "songAndHymnDistinction"
  | "mistAndAnchorFacilityLog";

export type RevealLevel = "surface" | "uncanny" | "technical" | "deep";

export type IdolPassiveEffect = {
  type: "globalProductionMultiplier";
  multiplier: number;
};

export type ResourceDefinition = {
  id: string;
  name: string;
  description: string;
};

export type IdolDefinition = {
  id: IdolId;
  name: string;
  reading: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition: string;
  passiveDescription: string;
  passiveEffect: IdolPassiveEffect;
  unlockRequirement?: Requirement;
};

export type FacilityDefinition = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  productionPerLevel?: number;
  unlockRequirement?: Requirement;
};

export type SongDefinition = {
  id: SongId;
  name: string;
  description: string;
  cost: number;
  effectDescription: string;
  effects: Effect[];
  unlockRequirement: Requirement;
};

export type ItemDefinition = {
  id: ItemId;
  name: string;
  description: string;
  cost: number;
  effectDescription: string;
  effects: Effect[];
  unlockRequirement: Requirement;
};

export type RecordDefinition = {
  id: RecordId;
  title: string;
  category: "復旧報告" | "観測記録" | "施設ログ" | "断片記憶";
  revealLevel: RevealLevel;
  body: string;
  introducedAtVersion: number;
  unlockRequirements: Requirement[];
};
