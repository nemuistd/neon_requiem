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
    ...validateNormalUiTerms()
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

    if (!idol.unlockRequirement) {
      return [];
    }

    return validateRequirement(`idol "${idolId}"`, idol.unlockRequirement);
  });
}

function validateCollection<T extends { id: string }>(label: string, definitions: Record<string, T>, order: string[]): string[] {
  const errors: string[] = [];
  const definitionIds = Object.keys(definitions);
  const orderedIds = new Set(order);

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

    if (facility.productionPerLevel !== undefined && !isNonNegativeFiniteNumber(facility.productionPerLevel)) {
      errors.push(`facility "${facilityId}": productionPerLevel must be non-negative.`);
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

function validateRequirement(label: string, requirement: Requirement): string[] {
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

  if (requirement.type === "all" || requirement.type === "any") {
    return requirement.requirements.flatMap((childRequirement) => validateRequirement(label, childRequirement));
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

  if (!isPositiveFiniteNumber(effect.multiplier)) {
    return [`${label}: facility.production.multiplier multiplier must be positive.`];
  }

  return [];
}

function isPositiveFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegativeFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}
