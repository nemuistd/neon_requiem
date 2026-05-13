import {
  FACILITIES,
  FacilityId,
  IDOLS,
  IdolId,
  Requirement,
  SONGS,
  SongId
} from "../definitions";
import {
  RESOURCE_LABELS,
  UI_TEXT
} from "../data";
import { formatAmount } from "./format";

export function getUnlockRequirementText(facilityId: FacilityId): string {
  const requirement = FACILITIES[facilityId].unlockRequirement;

  if (!requirement) {
    return "";
  }

  return getUnlockRequirementTextFromRequirement(requirement);
}

export function getIdolUnlockRequirementText(idolId: IdolId): string {
  const requirement = IDOLS[idolId].unlockRequirement;

  if (!requirement) {
    return UI_TEXT.initialIdolLabel;
  }

  return `${UI_TEXT.idolUnlockRequirementLabel}: ${getUnlockRequirementTextFromRequirement(requirement)}`;
}

export function getUnlockRequirementTextFromRequirement(requirement: Requirement): string {
  if (requirement.type === "song.purchased") {
    if (!isSongId(requirement.songId)) {
      return "不明な歌";
    }

    return `${SONGS[requirement.songId].name} 取得`;
  }

  if (requirement.type === "resource.amount") {
    return `${formatAmount(requirement.amount)} ${RESOURCE_LABELS.tomorusa}`;
  }

  if (requirement.type === "all") {
    return requirement.requirements.map(getUnlockRequirementTextFromRequirement).join(" / ");
  }

  if (requirement.type === "any") {
    return requirement.requirements.map(getUnlockRequirementTextFromRequirement).join(" または ");
  }

  if (requirement.type === "not") {
    return `${getUnlockRequirementTextFromRequirement(requirement.requirement)} 未達成`;
  }

  if (!isFacilityId(requirement.facilityId)) {
    return "不明な施設";
  }

  return `${FACILITIES[requirement.facilityId].name} Lv ${requirement.level}`;
}

export function isFacilityId(value: string | undefined): value is FacilityId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(FACILITIES, value);
}

export function isSongId(value: string | undefined): value is SongId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SONGS, value);
}
