import {
  FACILITIES,
  FacilityId,
  IDOLS,
  IdolId,
  MEGURI_BUFFS,
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
    return `${formatAmount(requirement.amount)} ${RESOURCE_LABELS[requirement.resourceId as keyof typeof RESOURCE_LABELS] ?? "不明な資源"}`;
  }

  if (requirement.type === "idol.bond") {
    if (!isIdolId(requirement.idolId)) {
      return "不明なアイドル";
    }

    return `${IDOLS[requirement.idolId].name} ${UI_TEXT.bondLabel} ${requirement.amount}`;
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

  if (requirement.type === "meguri.count") {
    return `廻 ${requirement.count}回以上`;
  }

  if (requirement.type === "meguri.buff.purchased") {
    if (!Object.prototype.hasOwnProperty.call(MEGURI_BUFFS, requirement.buffId)) {
      return "不明な廻後バフ";
    }

    return `${MEGURI_BUFFS[requirement.buffId as keyof typeof MEGURI_BUFFS].name} 取得`;
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

export function isIdolId(value: string | undefined): value is IdolId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(IDOLS, value);
}
