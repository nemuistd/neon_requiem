import {
  FACILITY_ORDER,
  ITEM_ORDER,
  ITEMS,
  SONG_ORDER,
  SONGS
} from "../definitions";
import {
  canSpendResource,
  GameState,
  getFacilityLevel,
  getFacilityTomorusaPerSecond,
  getFacilityUpgradeCost,
  getResourceAmount,
  getTomorusaPerSecond,
  isFacilityUnlocked,
  isItemPurchased,
  isItemUnlocked,
  isSongPurchased,
  isSongUnlocked,
  TOMORUSA_RESOURCE_ID
} from "../game";
import { formatAmount, formatRate } from "./format";
import type { UiElements } from "./types";

export function renderLiveValues(elements: UiElements, state: GameState): void {
  elements.lightsAmount.textContent = formatAmount(getResourceAmount(state, TOMORUSA_RESOURCE_ID));
  elements.lightsPerSecond.textContent = `${formatRate(getTomorusaPerSecond(state))} / 秒`;
  updateFacilityLiveValues(elements, state);
  updateSongLiveValues(elements, state);
  updateItemLiveValues(elements, state);
}

export function updateFacilityLiveValues(elements: UiElements, state: GameState): void {
  FACILITY_ORDER.forEach((facilityId) => {
    const levelElement = elements.contentList.querySelector<HTMLElement>(`[data-facility-level="${facilityId}"]`);
    const costElement = elements.contentList.querySelector<HTMLElement>(`[data-facility-cost="${facilityId}"]`);
    const productionElement = elements.contentList.querySelector<HTMLElement>(`[data-facility-production="${facilityId}"]`);
    const upgradeButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-facility-id="${facilityId}"]`);

    if (levelElement) {
      levelElement.textContent = String(getFacilityLevel(state, facilityId));
    }

    if (costElement) {
      costElement.textContent = `${formatAmount(getFacilityUpgradeCost(state, facilityId))} 灯るさ`;
    }

    if (productionElement) {
      productionElement.textContent = `${formatRate(getFacilityTomorusaPerSecond(state, facilityId))} 灯るさ / 秒`;
    }

    if (upgradeButton) {
      upgradeButton.disabled = !isFacilityUnlocked(state, facilityId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, getFacilityUpgradeCost(state, facilityId));
    }
  });
}

export function updateSongLiveValues(elements: UiElements, state: GameState): void {
  SONG_ORDER.forEach((songId) => {
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-song-id="${songId}"]`);

    if (purchaseButton) {
      purchaseButton.disabled = !isSongUnlocked(state, songId) || isSongPurchased(state, songId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, SONGS[songId].cost);
    }
  });
}

export function updateItemLiveValues(elements: UiElements, state: GameState): void {
  ITEM_ORDER.forEach((itemId) => {
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-item-id="${itemId}"]`);

    if (purchaseButton) {
      purchaseButton.disabled = !isItemUnlocked(state, itemId) || isItemPurchased(state, itemId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, ITEMS[itemId].cost);
    }
  });
}
