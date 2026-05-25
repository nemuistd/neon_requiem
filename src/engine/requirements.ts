export type Requirement =
  | { type: "facility.level"; facilityId: string; level: number }
  | { type: "song.purchased"; songId: string }
  | { type: "resource.amount"; resourceId: string; amount: number }
  | { type: "idol.joined"; idolId: string }
  | { type: "idol.bond"; idolId: string; amount: number }
  | { type: "meguri.count"; count: number }
  | { type: "meguri.idolRecognition"; idolId: string }
  | { type: "meguri.buff.purchased"; buffId: string }
  | { type: "all"; requirements: Requirement[] }
  | { type: "any"; requirements: Requirement[] }
  | { type: "not"; requirement: Requirement };

export type RequirementState = {
  facilities: Partial<Record<string, { level?: number }>>;
  resources: Partial<Record<string, number>>;
  songs: Partial<Record<string, { purchased?: boolean }>>;
  idols?: Partial<Record<string, { bond?: number; joined?: boolean }>>;
  meguri?: {
    count?: number;
    buffs?: Partial<Record<string, { purchased?: boolean }>>;
    idolRecognition?: Partial<Record<string, boolean>>;
  };
};

export function isRequirementMet(state: RequirementState, requirement?: Requirement): boolean {
  if (!requirement) {
    return true;
  }

  if (requirement.type === "facility.level") {
    return (state.facilities[requirement.facilityId]?.level ?? 0) >= requirement.level;
  }

  if (requirement.type === "song.purchased") {
    return state.songs[requirement.songId]?.purchased === true;
  }

  if (requirement.type === "resource.amount") {
    return (state.resources[requirement.resourceId] ?? 0) >= requirement.amount;
  }

  if (requirement.type === "idol.bond") {
    return (state.idols?.[requirement.idolId]?.bond ?? 0) >= requirement.amount;
  }

  if (requirement.type === "idol.joined") {
    return state.idols?.[requirement.idolId]?.joined === true;
  }

  if (requirement.type === "meguri.count") {
    return (state.meguri?.count ?? 0) >= requirement.count;
  }

  if (requirement.type === "meguri.idolRecognition") {
    return state.meguri?.idolRecognition?.[requirement.idolId] === true;
  }

  if (requirement.type === "meguri.buff.purchased") {
    return state.meguri?.buffs?.[requirement.buffId]?.purchased === true;
  }

  if (requirement.type === "all") {
    return areRequirementsMet(state, requirement.requirements);
  }

  if (requirement.type === "any") {
    return requirement.requirements.some((childRequirement) => isRequirementMet(state, childRequirement));
  }

  return !isRequirementMet(state, requirement.requirement);
}

export function areRequirementsMet(state: RequirementState, requirements: Requirement[]): boolean {
  return requirements.every((requirement) => isRequirementMet(state, requirement));
}
