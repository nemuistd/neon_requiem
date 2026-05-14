import { Effect } from "../engine/effects.js";
import { Requirement } from "../engine/requirements.js";

export type RevealLevel = "surface" | "uncanny" | "technical" | "deep";

export type ResourceDefinition = {
  id: string;
  name: string;
  description: string;
};

export type IdolDefinition = {
  id: string;
  name: string;
  reading: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition: string;
  passiveDescription: string;
  passiveEffects: Effect[];
  focusEffects?: Effect[];
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
  id: string;
  name: string;
  description: string;
  cost: number;
  effectDescription: string;
  effects: Effect[];
  unlockRequirement: Requirement;
};

export type ItemDefinition = {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectDescription: string;
  effects: Effect[];
  unlockRequirement: Requirement;
};

export type RecordDefinition = {
  id: string;
  title: string;
  category: "復旧報告" | "観測記録" | "施設ログ" | "断片記憶" | "交流メモ";
  revealLevel: RevealLevel;
  body: string;
  introducedAtVersion: number;
  unlockRequirements: Requirement[];
};
