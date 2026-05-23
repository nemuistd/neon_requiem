import {
  FACILITIES,
  FACILITY_ORDER,
  SONGS
} from "../definitions";
import type {
  FacilityId,
  Requirement
} from "../definitions";
import {
  GameState,
  isFacilityUnlocked
} from "../game";

export function shouldRenderFacilityCard(state: GameState, facilityId: FacilityId): boolean {
  return isFacilityUnlocked(state, facilityId) || getNextLockedFacilityId(state) === facilityId;
}

export function isRelatedProgressVisible(state: GameState, requirement?: Requirement): boolean {
  if (!requirement) {
    return true;
  }

  const facilityIds = getRequirementFacilityIds(requirement);

  return facilityIds.length === 0 || facilityIds.every((facilityId) => isFacilityUnlocked(state, facilityId));
}

function getNextLockedFacilityId(state: GameState): FacilityId | undefined {
  return FACILITY_ORDER.find((facilityId) => !isFacilityUnlocked(state, facilityId));
}

function getRequirementFacilityIds(requirement: Requirement): FacilityId[] {
  if (requirement.type === "facility.level") {
    return isFacilityId(requirement.facilityId) ? [requirement.facilityId] : [];
  }

  if (requirement.type === "song.purchased") {
    const song = SONGS[requirement.songId as keyof typeof SONGS];

    return song ? getRequirementFacilityIds(song.unlockRequirement) : [];
  }

  if (requirement.type === "all" || requirement.type === "any") {
    return requirement.requirements.flatMap(getRequirementFacilityIds);
  }

  if (requirement.type === "not") {
    return getRequirementFacilityIds(requirement.requirement);
  }

  return [];
}

function isFacilityId(value: string): value is FacilityId {
  return Object.prototype.hasOwnProperty.call(FACILITIES, value);
}
