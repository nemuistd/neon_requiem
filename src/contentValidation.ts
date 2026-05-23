import {
  FACILITIES,
  FACILITY_ORDER,
  IDOL_ORDER,
  IDOLS,
  ITEM_ORDER,
  ITEMS,
  RECORD_ORDER,
  RECORDS,
  RESOURCE_ORDER,
  RESOURCES,
  Requirement,
  SONG_ORDER,
  SONGS,
  Effect
} from "./definitions.js";

const SURFACE_FORBIDDEN_TERMS = ["祈念工学", "アンカー", "聖歌", "祈念負荷"] as const;
const NORMAL_UI_TEXTS = [
  ...Object.values(IDOLS).flatMap((idol) => [idol.title, idol.description, idol.passiveDescription]),
  ...Object.values(FACILITIES).map((facility) => facility.description),
  ...Object.values(ITEMS).flatMap((item) => [item.name, item.description, item.effectDescription]),
  ...Object.values(SONGS).flatMap((song) => [song.name, song.description, song.effectDescription])
] as const;

export function validateContentDefinitions(): string[] {
  return [
    ...validateCollection("idol", IDOLS, IDOL_ORDER),
    ...validateCollection("facility", FACILITIES, FACILITY_ORDER),
    ...validateCollection("item", ITEMS, ITEM_ORDER),
    ...validateCollection("resource", RESOURCES, RESOURCE_ORDER),
    ...validateCollection("song", SONGS, SONG_ORDER),
    ...validateCollection("record", RECORDS, RECORD_ORDER),
    ...validateIdols(),
    ...validateFacilities(),
    ...validateItems(),
    ...validateSongs(),
    ...validateRecords(),
    ...validateNormalUiTerms(),
    ...validateReachability()
  ];
}

function validateItems(): string[] {
  return ITEM_ORDER.flatMap((itemId) => {
    const item = ITEMS[itemId];
    const errors: string[] = [];

    if (!isPositiveFiniteNumber(item.cost)) {
      errors.push(`item "${itemId}": cost must be positive.`);
    }

    if (!item.effectDescription.trim()) {
      errors.push(`item "${itemId}": effectDescription is empty.`);
    }

    if (item.effects.length === 0) {
      errors.push(`item "${itemId}": effects must not be empty.`);
    }

    item.effects.forEach((effect) => {
      errors.push(...validateEffect(`item "${itemId}"`, effect));
    });

    errors.push(...validateRequirement(`item "${itemId}"`, item.unlockRequirement));

    return errors;
  });
}

function validateIdols(): string[] {
  return IDOL_ORDER.flatMap((idolId) => {
    const idol = IDOLS[idolId];
    const errors: string[] = [];

    idol.passiveEffects.forEach((effect) => {
      errors.push(...validateEffect(`idol "${idolId}" passive effect`, effect));
    });

    idol.focusEffects?.forEach((effect) => {
      errors.push(...validateEffect(`idol "${idolId}" focus effect`, effect));
    });

    if (idol.unlockRequirement) {
      errors.push(...validateRequirement(`idol "${idolId}"`, idol.unlockRequirement));
    }

    return errors;
  });
}

function validateCollection<T extends { id: string }>(label: string, definitions: Record<string, T>, order: string[]): string[] {
  const errors: string[] = [];
  const definitionIds = Object.keys(definitions);
  const orderedIds = new Set(order);

  if (orderedIds.size !== order.length) {
    errors.push(`${label}: order contains duplicate ids.`);
  }

  definitionIds.forEach((key) => {
    if (definitions[key].id !== key) {
      errors.push(`${label}: object key "${key}" does not match id "${definitions[key].id}".`);
    }

    if (!orderedIds.has(key)) {
      errors.push(`${label}: "${key}" is missing from order.`);
    }
  });

  order.forEach((id) => {
    if (!Object.prototype.hasOwnProperty.call(definitions, id)) {
      errors.push(`${label}: order contains missing id "${id}".`);
    }
  });

  return errors;
}

function validateFacilities(): string[] {
  return FACILITY_ORDER.flatMap((facilityId) => {
    const facility = FACILITIES[facilityId];
    const errors: string[] = [];

    if (!isPositiveFiniteNumber(facility.baseCost)) {
      errors.push(`facility "${facilityId}": baseCost must be positive.`);
    }

    if (!isPositiveFiniteNumber(facility.costMultiplier)) {
      errors.push(`facility "${facilityId}": costMultiplier must be positive.`);
    }

    if (facility.costMultiplier < 1) {
      errors.push(`facility "${facilityId}": costMultiplier must be at least 1.`);
    }

    if (facility.productionPerLevel !== undefined && !isNonNegativeFiniteNumber(facility.productionPerLevel)) {
      errors.push(`facility "${facilityId}": productionPerLevel must be non-negative.`);
    }

    if (facility.tags) {
      const uniqueTags = new Set(facility.tags);

      if (uniqueTags.size !== facility.tags.length) {
        errors.push(`facility "${facilityId}": tags must not contain duplicates.`);
      }

      facility.tags.forEach((tag) => {
        if (!tag.trim()) {
          errors.push(`facility "${facilityId}": tags must not be empty.`);
        }
      });
    }

    if (facility.unlockRequirement) {
      errors.push(...validateRequirement(`facility "${facilityId}"`, facility.unlockRequirement));
    }

    return errors;
  });
}

function validateSongs(): string[] {
  return SONG_ORDER.flatMap((songId) => {
    const song = SONGS[songId];
    const errors: string[] = [];

    if (!isPositiveFiniteNumber(song.cost)) {
      errors.push(`song "${songId}": cost must be positive.`);
    }

    if (!song.effectDescription.trim()) {
      errors.push(`song "${songId}": effectDescription is empty.`);
    }

    if (song.effects.length === 0) {
      errors.push(`song "${songId}": effects must not be empty.`);
    }

    song.effects.forEach((effect) => {
      errors.push(...validateEffect(`song "${songId}"`, effect));
    });

    errors.push(...validateRequirement(`song "${songId}"`, song.unlockRequirement));

    return errors;
  });
}

function validateRecords(): string[] {
  return RECORD_ORDER.flatMap((recordId) => {
    const record = RECORDS[recordId];
    const errors: string[] = [];

    if (!record.title.trim()) {
      errors.push(`record "${recordId}": title is empty.`);
    }

    if (!record.body.trim()) {
      errors.push(`record "${recordId}": body is empty.`);
    }

    if (
      record.revealLevel !== "surface" &&
      record.revealLevel !== "uncanny" &&
      record.revealLevel !== "technical" &&
      record.revealLevel !== "deep"
    ) {
      errors.push(`record "${recordId}": revealLevel is invalid.`);
    }

    if (record.revealLevel === "surface") {
      errors.push(...validateSurfaceRecordTerms(recordId, record.title));
      errors.push(...validateSurfaceRecordTerms(recordId, record.body));
    }

    record.unlockRequirements.forEach((requirement) => {
      errors.push(...validateRequirement(`record "${recordId}"`, requirement));
    });

    return errors;
  });
}

function validateSurfaceRecordTerms(recordId: string, text: string): string[] {
  return SURFACE_FORBIDDEN_TERMS.flatMap((term) => {
    if (!text.includes(term)) {
      return [];
    }

    return [`record "${recordId}": surface record must not include deep term "${term}".`];
  });
}

function validateNormalUiTerms(): string[] {
  return NORMAL_UI_TEXTS.flatMap((text) => {
    if (!text.includes("聖歌")) {
      return [];
    }

    return [`normal UI text must not include "聖歌": "${text}"`];
  });
}

export function validateRequirement(label: string, requirement: Requirement): string[] {
  if (requirement.type === "song.purchased") {
    if (!Object.prototype.hasOwnProperty.call(SONGS, requirement.songId)) {
      return [`${label}: unlock requirement references missing song "${requirement.songId}".`];
    }

    return [];
  }

  if (requirement.type === "resource.amount") {
    const errors: string[] = [];

    if (!Object.prototype.hasOwnProperty.call(RESOURCES, requirement.resourceId)) {
      errors.push(`${label}: requirement references missing resource "${requirement.resourceId}".`);
    }

    if (!isNonNegativeFiniteNumber(requirement.amount)) {
      errors.push(`${label}: requirement resource amount must be non-negative.`);
    }

    return errors;
  }

  if (requirement.type === "idol.bond") {
    const errors: string[] = [];

    if (!Object.prototype.hasOwnProperty.call(IDOLS, requirement.idolId)) {
      errors.push(`${label}: requirement references missing idol "${requirement.idolId}".`);
    }

    if (!isPositiveFiniteNumber(requirement.amount)) {
      errors.push(`${label}: requirement idol bond amount must be positive.`);
    }

    return errors;
  }

  if (requirement.type === "all" || requirement.type === "any") {
    const errors: string[] = [];

    if (requirement.requirements.length === 0) {
      errors.push(`${label}: "${requirement.type}" requirement must not be empty.`);
    }

    return [
      ...errors,
      ...requirement.requirements.flatMap((childRequirement) => validateRequirement(label, childRequirement))
    ];
  }

  if (requirement.type === "not") {
    return validateRequirement(label, requirement.requirement);
  }

  const errors: string[] = [];

  if (!Object.prototype.hasOwnProperty.call(FACILITIES, requirement.facilityId)) {
    errors.push(`${label}: unlock requirement references missing facility "${requirement.facilityId}".`);
  }

  if (!isNonNegativeFiniteNumber(requirement.level)) {
    errors.push(`${label}: unlock requirement level must be non-negative.`);
  }

  if (!Number.isInteger(requirement.level)) {
    errors.push(`${label}: unlock requirement level must be an integer.`);
  }

  return errors;
}

function validateEffect(label: string, effect: Effect): string[] {
  if (effect.type === "manual.gain.add") {
    const errors: string[] = [];

    if (!Object.prototype.hasOwnProperty.call(RESOURCES, effect.resourceId)) {
      errors.push(`${label}: effect references missing resource "${effect.resourceId}".`);
    }

    if (!isPositiveFiniteNumber(effect.amount)) {
      errors.push(`${label}: manual.gain.add amount must be positive.`);
    }

    return errors;
  }

  if (effect.type === "manual.gain.add.production.ratio" && !isPositiveFiniteNumber(effect.ratio)) {
    return [`${label}: manual.gain.add.production.ratio ratio must be positive.`];
  }

  if (effect.type === "facility.production.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: facility.production.multiplier multiplier must be positive.`];
  }

  if (effect.type === "facility.production.multiplier.tag") {
    const errors: string[] = [];

    if (!effect.tag.trim()) {
      errors.push(`${label}: facility.production.multiplier.tag tag must not be empty.`);
    }

    if (!getFacilityTags().has(effect.tag)) {
      errors.push(`${label}: facility.production.multiplier.tag references missing facility tag "${effect.tag}".`);
    }

    if (!isPositiveFiniteNumber(effect.multiplier)) {
      errors.push(`${label}: facility.production.multiplier.tag multiplier must be positive.`);
    }

    return errors;
  }

  if (effect.type === "offline.reward.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: offline.reward.multiplier multiplier must be positive.`];
  }

  if (effect.type === "bond.rate.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: bond.rate.multiplier multiplier must be positive.`];
  }

  if (effect.type === "record.unlock.cost.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: record.unlock.cost.multiplier multiplier must be positive.`];
  }

  if (effect.type === "item.cost.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: item.cost.multiplier multiplier must be positive.`];
  }

  if (effect.type === "song.cost.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: song.cost.multiplier multiplier must be positive.`];
  }

  if (effect.type === "memory.fragment.production.add" && !isPositiveFiniteNumber(effect.ratio)) {
    return [`${label}: memory.fragment.production.add ratio must be positive.`];
  }

  if (effect.type === "rebirth.bonus.multiplier" && !isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: rebirth.bonus.multiplier multiplier must be positive.`];
  }

  return [];
}

function getFacilityTags(): Set<string> {
  return new Set(Object.values(FACILITIES).flatMap((facility) => facility.tags ?? []));
}

function isPositiveFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegativeFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function validateReachability(): string[] {
  const reachableFacilities = getReachableFacilities();
  const reachableSongs = getReachableSongs(reachableFacilities);
  const reachableResources = new Set(RESOURCE_ORDER);
  const errors: string[] = [];

  FACILITY_ORDER.forEach((facilityId) => {
    if (!reachableFacilities.has(facilityId)) {
      errors.push(`facility "${facilityId}": unlock requirement is unreachable.`);
    }
  });

  SONG_ORDER.forEach((songId) => {
    if (!reachableSongs.has(songId)) {
      errors.push(`song "${songId}": unlock requirement is unreachable.`);
    }
  });

  ITEM_ORDER.forEach((itemId) => {
    if (!isRequirementPotentiallyReachable(ITEMS[itemId].unlockRequirement, reachableFacilities, reachableSongs, reachableResources)) {
      errors.push(`item "${itemId}": unlock requirement is unreachable.`);
    }
  });

  IDOL_ORDER.forEach((idolId) => {
    const requirement = IDOLS[idolId].unlockRequirement;

    if (requirement && !isRequirementPotentiallyReachable(requirement, reachableFacilities, reachableSongs, reachableResources)) {
      errors.push(`idol "${idolId}": unlock requirement is unreachable.`);
    }
  });

  RECORD_ORDER.forEach((recordId) => {
    const record = RECORDS[recordId];
    const isReachable = record.unlockRequirements.every((requirement) => (
      isRequirementPotentiallyReachable(requirement, reachableFacilities, reachableSongs, reachableResources)
    ));

    if (!isReachable) {
      errors.push(`record "${recordId}": unlock requirement is unreachable.`);
    }
  });

  return errors;
}

function getReachableFacilities(): Set<string> {
  const reachableFacilities = new Set<string>();
  const reachableSongs = new Set<string>();
  const reachableResources = new Set<string>(RESOURCE_ORDER);
  let changed = true;

  while (changed) {
    changed = false;

    FACILITY_ORDER.forEach((facilityId) => {
      if (reachableFacilities.has(facilityId)) {
        return;
      }

      const requirement = FACILITIES[facilityId].unlockRequirement;

      if (!requirement || isRequirementPotentiallyReachable(requirement, reachableFacilities, reachableSongs, reachableResources)) {
        reachableFacilities.add(facilityId);
        changed = true;
      }
    });
  }

  return reachableFacilities;
}

function getReachableSongs(reachableFacilities: Set<string>): Set<string> {
  const reachableSongs = new Set<string>();
  const reachableResources = new Set<string>(RESOURCE_ORDER);
  let changed = true;

  while (changed) {
    changed = false;

    SONG_ORDER.forEach((songId) => {
      if (reachableSongs.has(songId)) {
        return;
      }

      if (isRequirementPotentiallyReachable(SONGS[songId].unlockRequirement, reachableFacilities, reachableSongs, reachableResources)) {
        reachableSongs.add(songId);
        changed = true;
      }
    });
  }

  return reachableSongs;
}

function isRequirementPotentiallyReachable(
  requirement: Requirement,
  reachableFacilities: Set<string>,
  reachableSongs: Set<string>,
  reachableResources: Set<string>
): boolean {
  if (requirement.type === "facility.level") {
    return reachableFacilities.has(requirement.facilityId) && isNonNegativeFiniteNumber(requirement.level);
  }

  if (requirement.type === "song.purchased") {
    return reachableSongs.has(requirement.songId);
  }

  if (requirement.type === "resource.amount") {
    return reachableResources.has(requirement.resourceId) && isNonNegativeFiniteNumber(requirement.amount);
  }

  if (requirement.type === "idol.bond") {
    return Object.prototype.hasOwnProperty.call(IDOLS, requirement.idolId) && isPositiveFiniteNumber(requirement.amount);
  }

  if (requirement.type === "all") {
    return requirement.requirements.length > 0 && requirement.requirements.every((childRequirement) => (
      isRequirementPotentiallyReachable(childRequirement, reachableFacilities, reachableSongs, reachableResources)
    ));
  }

  if (requirement.type === "any") {
    return requirement.requirements.some((childRequirement) => (
      isRequirementPotentiallyReachable(childRequirement, reachableFacilities, reachableSongs, reachableResources)
    ));
  }

  return true;
}
