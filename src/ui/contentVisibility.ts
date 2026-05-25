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
  return isRequirementProgressVisible(state, requirement);
}

function getNextLockedFacilityId(state: GameState): FacilityId | undefined {
  return FACILITY_ORDER.find((facilityId) => {
    const facility = FACILITIES[facilityId];

    return !isFacilityUnlocked(state, facilityId) && isRelatedProgressVisible(state, facility.unlockRequirement);
  });
}

function isRequirementProgressVisible(state: GameState, requirement?: Requirement): boolean {
  if (!requirement) {
    return true;
  }

  if (requirement.type === "facility.level") {
    return isFacilityId(requirement.facilityId) && isFacilityUnlocked(state, requirement.facilityId);
  }

  if (requirement.type === "song.purchased") {
    const song = SONGS[requirement.songId as keyof typeof SONGS];

    return Boolean(song && isRequirementProgressVisible(state, song.unlockRequirement));
  }

  if (requirement.type === "meguri.count") {
    return (state.meguri?.count ?? 0) >= requirement.count;
  }

  if (requirement.type === "meguri.buff.purchased") {
    const buffs = state.meguri?.buffs as Partial<Record<string, { purchased?: boolean }>> | undefined;

    return Boolean(buffs?.[requirement.buffId]?.purchased);
  }

  if (requirement.type === "meguri.idolRecognition") {
    const idolRecognition = state.meguri?.idolRecognition as Partial<Record<string, boolean>> | undefined;

    return Boolean(idolRecognition?.[requirement.idolId]);
  }

  if (requirement.type === "all") {
    return requirement.requirements.every((childRequirement) => isRequirementProgressVisible(state, childRequirement));
  }

  if (requirement.type === "any") {
    return requirement.requirements.some((childRequirement) => isRequirementProgressVisible(state, childRequirement));
  }

  if (requirement.type === "not") {
    return isRequirementProgressVisible(state, requirement.requirement);
  }

  return true;
}

function isFacilityId(value: string): value is FacilityId {
  return Object.prototype.hasOwnProperty.call(FACILITIES, value);
}
