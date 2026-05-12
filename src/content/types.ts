export type IdolId = "otowaAkari" | "mizukiShino" | "asagiriYui";

export type FacilityId = "alleyStage" | "undergroundChapel";

export type SongId = "rojiuraIntro" | "chapelHarmony" | "twilightChorus";

export type RecordId =
  | "alleyStageRestorationMemo"
  | "lightResponseObservation"
  | "undergroundChapelRestorationReport"
  | "songAndHymnDistinction"
  | "mistAndAnchorFacilityLog";

export type FacilityLevelUnlockRequirement = {
  type?: "facilityLevel";
  facilityId: FacilityId;
  level: number;
};

export type SongPurchasedUnlockRequirement = {
  type: "songPurchased";
  songId: SongId;
};

export type UnlockRequirement = FacilityLevelUnlockRequirement | SongPurchasedUnlockRequirement;

export type IdolPassiveEffect = {
  type: "globalProductionMultiplier";
  multiplier: number;
};

export type SongEffect =
  | {
      type: "manualLightGainBonus";
      amount: number;
    }
  | {
      type: "facilityProductionMultiplier";
      multiplier: number;
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
  unlockRequirement?: UnlockRequirement;
};

export type FacilityDefinition = {
  id: FacilityId;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  productionPerLevel?: number;
  unlockRequirement?: UnlockRequirement;
};

export type SongDefinition = {
  id: SongId;
  name: string;
  description: string;
  cost: number;
  effectDescription: string;
  effect: SongEffect;
  unlockRequirement: UnlockRequirement;
};

export type RecordDefinition = {
  id: RecordId;
  title: string;
  category: "復旧報告" | "観測記録" | "施設ログ" | "断片記憶";
  body: string;
  unlockRequirements: UnlockRequirement[];
};
