import {
  FACILITY_ORDER,
  IDOLS,
  IDOL_ORDER,
  ITEMS,
  ITEM_ORDER,
  SONGS,
  SONG_ORDER
} from "../definitions";
import { UI_TEXT } from "../data";
import {
  GameState,
  isFacilityUnlocked,
  isIdolUnlocked,
  isItemUnlocked,
  isMeguriTabUnlocked,
  isSongUnlocked
} from "../game";
import {
  isRelatedProgressVisible,
  shouldRenderFacilityCard
} from "./contentVisibility";

export type ProgressStatus = "none" | "hidden" | "complete";

export function getFacilityProgressStatus(state: GameState): ProgressStatus {
  const hasVisibleLockedFacility = FACILITY_ORDER.some((facilityId) => (
    shouldRenderFacilityCard(state, facilityId) && !isFacilityUnlocked(state, facilityId)
  ));

  if (hasVisibleLockedFacility) {
    return "none";
  }

  return FACILITY_ORDER.some((facilityId) => !isFacilityUnlocked(state, facilityId)) ? "hidden" : "complete";
}

export function getSongProgressStatus(state: GameState): ProgressStatus {
  const visibleSongIds = SONG_ORDER.filter((songId) => (
    isRelatedProgressVisible(state, SONGS[songId].unlockRequirement)
  ));
  const hasVisibleLockedSong = visibleSongIds.some((songId) => !isSongUnlocked(state, songId));

  if (hasVisibleLockedSong) {
    return "none";
  }

  return SONG_ORDER.length > visibleSongIds.length ? "hidden" : "complete";
}

export function getItemProgressStatus(state: GameState): ProgressStatus {
  const visibleItemIds = ITEM_ORDER.filter((itemId) => (
    isRelatedProgressVisible(state, ITEMS[itemId].unlockRequirement)
  ));
  const hasVisibleLockedItem = visibleItemIds.some((itemId) => !isItemUnlocked(state, itemId));

  if (hasVisibleLockedItem) {
    return "none";
  }

  return ITEM_ORDER.length > visibleItemIds.length ? "hidden" : "complete";
}

export function getIdolProgressStatus(state: GameState): ProgressStatus {
  const visibleIdolIds = IDOL_ORDER.filter((idolId) => (
    isRelatedProgressVisible(state, IDOLS[idolId].unlockRequirement)
  ));
  const hasVisibleLockedIdol = visibleIdolIds.some((idolId) => !isIdolUnlocked(state, idolId));

  if (hasVisibleLockedIdol) {
    return "none";
  }

  return IDOL_ORDER.length > visibleIdolIds.length ? "hidden" : "complete";
}

export function renderProgressStatusCard(status: ProgressStatus, state: GameState): string {
  if (status === "none") {
    return "";
  }

  const isHidden = status === "hidden";
  const hiddenTitle = isMeguriTabUnlocked(state) ? UI_TEXT.progressStatusHiddenMeguriTitle : UI_TEXT.progressStatusHiddenTitle;
  const text = isHidden ? "" : UI_TEXT.progressStatusCompleteText;

  return `
    <article class="card progress-status-card" data-progress-status="${status}">
      <span class="card-kicker">${isHidden ? UI_TEXT.progressStatusHiddenLabel : UI_TEXT.progressStatusCompleteLabel}</span>
      <h2>${isHidden ? hiddenTitle : UI_TEXT.progressStatusCompleteTitle}</h2>
      ${text ? `<p>${text}</p>` : ""}
    </article>
  `;
}
