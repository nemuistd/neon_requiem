import {
  FACILITIES,
  FACILITY_ORDER,
  IDOL_ORDER,
  IDOLS,
  RECORD_ORDER,
  RECORDS,
  SONG_ORDER,
  SONGS,
  UnlockRequirement
} from "./definitions.js";

export function validateContentDefinitions(): string[] {
  return [
    ...validateCollection("idol", IDOLS, IDOL_ORDER),
    ...validateCollection("facility", FACILITIES, FACILITY_ORDER),
    ...validateCollection("song", SONGS, SONG_ORDER),
    ...validateCollection("record", RECORDS, RECORD_ORDER),
    ...validateFacilities(),
    ...validateSongs(),
    ...validateRecords()
  ];
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
      errors.push(...validateUnlockRequirement(`facility "${facilityId}"`, facility.unlockRequirement));
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

    if (song.effect.type === "manualLightGainBonus" && !isPositiveFiniteNumber(song.effect.amount)) {
      errors.push(`song "${songId}": manualLightGainBonus amount must be positive.`);
    }

    if (song.effect.type === "facilityProductionMultiplier" && !isPositiveFiniteNumber(song.effect.multiplier)) {
      errors.push(`song "${songId}": facilityProductionMultiplier multiplier must be positive.`);
    }

    errors.push(...validateUnlockRequirement(`song "${songId}"`, song.unlockRequirement));

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

    record.unlockRequirements.forEach((requirement) => {
      errors.push(...validateUnlockRequirement(`record "${recordId}"`, requirement));
    });

    return errors;
  });
}

function validateUnlockRequirement(label: string, requirement: UnlockRequirement): string[] {
  if (requirement.type === "songPurchased") {
    if (!Object.prototype.hasOwnProperty.call(SONGS, requirement.songId)) {
      return [`${label}: unlock requirement references missing song "${requirement.songId}".`];
    }

    return [];
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

function isPositiveFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegativeFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}
