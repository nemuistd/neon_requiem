export type Requirement =
  | { type: "facility.level"; facilityId: string; level: number }
  | { type: "song.purchased"; songId: string }
  | { type: "resource.amount"; resourceId: string; amount: number }
  | { type: "all"; requirements: Requirement[] }
  | { type: "any"; requirements: Requirement[] }
  | { type: "not"; requirement: Requirement };

export type RequirementState = {
  facilities: Partial<Record<string, { level?: number }>>;
  resources: Partial<Record<string, number>>;
  songs: Partial<Record<string, { purchased?: boolean }>>;
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
