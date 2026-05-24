import {
  FACILITIES,
  FacilityId,
  IDOLS,
  IdolId,
  ITEMS,
  ItemId,
  MEGURI_BUFFS,
  MeguriBuffId,
  RECORDS,
  RecordId,
  SONGS,
  SongId
} from "../definitions";
import type { ActiveTabId } from "./types";

export function getFacilityIdFromEvent(event: Event): FacilityId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-facility-id]");
  const facilityId = button?.dataset.facilityId;

  if (isFacilityId(facilityId)) {
    return facilityId;
  }

  return null;
}

export function getIdolIdFromEvent(event: Event): IdolId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-idol-id]");
  const idolId = button?.dataset.idolId;

  if (isIdolId(idolId)) {
    return idolId;
  }

  return null;
}

export function getIdolJoinIdFromEvent(event: Event): IdolId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-idol-join-id]");
  const idolId = button?.dataset.idolJoinId;

  if (isIdolId(idolId)) {
    return idolId;
  }

  return null;
}

export function getSongIdFromEvent(event: Event): SongId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-song-id]");
  const songId = button?.dataset.songId;

  if (isSongId(songId)) {
    return songId;
  }

  return null;
}

export function getItemIdFromEvent(event: Event): ItemId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-item-id]");
  const itemId = button?.dataset.itemId;

  if (isItemId(itemId)) {
    return itemId;
  }

  return null;
}

export function getRecordIdFromEvent(event: Event): RecordId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-record-id]");
  const recordId = button?.dataset.recordId;

  if (isRecordId(recordId)) {
    return recordId;
  }

  return null;
}

export function getMeguriActionFromEvent(event: Event): "perform" | "closeSettlement" | "openRecords" | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-meguri-action]");
  const action = button?.dataset.meguriAction;

  return action === "perform" || action === "closeSettlement" || action === "openRecords" ? action : null;
}

export function getMeguriBuffIdFromEvent(event: Event): MeguriBuffId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-meguri-buff-id]");
  const buffId = button?.dataset.meguriBuffId;

  if (isMeguriBuffId(buffId)) {
    return buffId;
  }

  return null;
}

export function getTabIdFromEvent(event: Event): ActiveTabId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-tab-id]");
  const tabId = button?.dataset.tabId;

  if (tabId === "restoration" || tabId === "song" || tabId === "item" || tabId === "idol" || tabId === "record" || tabId === "meguri") {
    return tabId;
  }

  return null;
}

function isFacilityId(value: string | undefined): value is FacilityId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(FACILITIES, value);
}

function isIdolId(value: string | undefined): value is IdolId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(IDOLS, value);
}

function isSongId(value: string | undefined): value is SongId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SONGS, value);
}

function isItemId(value: string | undefined): value is ItemId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(ITEMS, value);
}

function isRecordId(value: string | undefined): value is RecordId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(RECORDS, value);
}

function isMeguriBuffId(value: string | undefined): value is MeguriBuffId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(MEGURI_BUFFS, value);
}
