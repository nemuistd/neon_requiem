import {
  ITEM_ORDER,
  RECORD_ORDER,
  RECORDS,
  SONG_ORDER
} from "../definitions";
import {
  GameState,
  hasUnreadRecordContent,
  isItemPurchased,
  isItemUnlocked,
  isMeguriTabUnlocked,
  isRecordAnnotationRead,
  isRecordAnnotationUnlocked,
  isRecordRead,
  isRecordUnlocked,
  isSongPurchased,
  isSongUnlocked
} from "../game";
import type { ActiveTabId, UiElements } from "./types";

export function renderTabs(elements: UiElements, state: GameState, activeTabId: ActiveTabId): void {
  elements.root.querySelectorAll<HTMLButtonElement>("[data-tab-id]").forEach((button) => {
    const isActive = button.dataset.tabId === activeTabId;
    const isSettlementBlocked = state.meguri.pendingSettlement && button.dataset.tabId !== "meguri";

    button.classList.toggle("active", isActive);
    button.disabled = isSettlementBlocked;

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  const songUnlockCount = getUnlockableSongCount(state, activeTabId);
  const songButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="song"]');
  const itemUnlockCount = getUnlockableItemCount(state, activeTabId);
  const itemButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="item"]');
  const recordUnreadCount = getUnreadRecordNotificationCount(state, activeTabId);
  const recordButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="record"]');
  const meguriButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="meguri"]');

  if (songButton) {
    if (activeTabId === "song" || songUnlockCount <= 0) {
      songButton.removeAttribute("data-song-unlock-count");
    } else {
      songButton.dataset.songUnlockCount = String(songUnlockCount);
    }
  }

  if (itemButton) {
    if (activeTabId === "item" || itemUnlockCount <= 0) {
      itemButton.removeAttribute("data-item-unlock-count");
    } else {
      itemButton.dataset.itemUnlockCount = String(itemUnlockCount);
    }
  }

  if (recordButton) {
    if (activeTabId === "record" || recordUnreadCount <= 0) {
      recordButton.removeAttribute("data-record-unread-count");
    } else {
      recordButton.dataset.recordUnreadCount = String(recordUnreadCount);
    }
  }

  if (meguriButton) {
    meguriButton.hidden = !isMeguriTabUnlocked(state);
  }
}

function getUnlockableItemCount(state: GameState, activeTabId: ActiveTabId): number {
  if (activeTabId === "item") {
    return 0;
  }

  return ITEM_ORDER.reduce((count, itemId) => {
    return count + (isItemUnlocked(state, itemId) && !isItemPurchased(state, itemId) ? 1 : 0);
  }, 0);
}

function getUnlockableSongCount(state: GameState, activeTabId: ActiveTabId): number {
  if (activeTabId === "song") {
    return 0;
  }

  return SONG_ORDER.reduce((count, songId) => {
    return count + (isSongUnlocked(state, songId) && !isSongPurchased(state, songId) ? 1 : 0);
  }, 0);
}

export function getUnreadRecordNotificationCount(state: GameState, activeTabId: ActiveTabId): number {
  if (activeTabId === "record") {
    return 0;
  }

  return RECORD_ORDER.reduce((count, recordId) => {
    const record = RECORDS[recordId];
    const hasUnreadBody =
      isRecordUnlocked(state, recordId) &&
      !isRecordRead(state, recordId) &&
      record.introducedAtVersion > state.recordTabLastSeenContentVersion;
    const hasUnreadAnnotation = isRecordAnnotationUnlocked(state, recordId) && !isRecordAnnotationRead(state, recordId);

    return count + ((hasUnreadBody || hasUnreadAnnotation) && hasUnreadRecordContent(state, recordId) ? 1 : 0);
  }, 0);
}
