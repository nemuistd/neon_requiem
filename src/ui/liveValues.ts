import {
  FACILITY_ORDER,
  ITEM_ORDER,
  MEGURI_BUFF_ORDER,
  MEGURI_BUFFS,
  SONG_ORDER,
} from "../definitions";
import { createMeguriNextFragmentMessage, UI_TEXT } from "../data";
import {
  canSpendResource,
  GameState,
  getFacilityLevel,
  getFacilityTomorusaPerSecond,
  getFacilityUpgradeCost,
  getItemCost,
  getMeguriSettlementPreview,
  getResourceAmount,
  getSongCost,
  getTomorusaPerSecond,
  isFacilityUnlocked,
  isItemPurchased,
  isItemUnlocked,
  isMeguriAvailable,
  isMeguriBuffPurchased,
  isSongPurchased,
  isSongUnlocked,
  MEMORY_FRAGMENT_RESOURCE_ID,
  TOMORUSA_RESOURCE_ID
} from "../game";
import { formatAmount, formatRate, formatWholeAmount } from "./format";
import type { UiElements } from "./types";

export function renderLiveValues(elements: UiElements, state: GameState): void {
  elements.lightsAmount.textContent = formatAmount(getResourceAmount(state, TOMORUSA_RESOURCE_ID));
  elements.memoryFragmentsAmount.textContent = formatWholeAmount(getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID));
  elements.memoryFragmentResource.hidden = state.meguri.count <= 0;
  elements.lightsPerSecond.textContent = `${formatRate(getTomorusaPerSecond(state))} / 秒`;
  elements.liveButton.disabled = state.meguri.pendingSettlement;
  elements.liveButton.textContent = state.meguri.pendingSettlement ? UI_TEXT.meguriSettlementOpenLabel : UI_TEXT.liveButton;
  updateFacilityLiveValues(elements, state);
  updateSongLiveValues(elements, state);
  updateItemLiveValues(elements, state);
  updateMeguriLiveValues(elements, state);
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
    const cost = getSongCost(state, songId);
    const costElement = elements.contentList.querySelector<HTMLElement>(`[data-song-cost="${songId}"]`);
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-song-id="${songId}"]`);

    if (costElement) {
      costElement.textContent = `${formatAmount(cost)} 灯るさ`;
    }

    if (purchaseButton) {
      purchaseButton.disabled = !isSongUnlocked(state, songId) || isSongPurchased(state, songId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, cost);
    }
  });
}

export function updateItemLiveValues(elements: UiElements, state: GameState): void {
  ITEM_ORDER.forEach((itemId) => {
    const cost = getItemCost(state, itemId);
    const costElement = elements.contentList.querySelector<HTMLElement>(`[data-item-cost="${itemId}"]`);
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-item-id="${itemId}"]`);

    if (costElement) {
      costElement.textContent = `${formatAmount(cost)} 灯るさ`;
    }

    if (purchaseButton) {
      purchaseButton.disabled = !isItemUnlocked(state, itemId) || isItemPurchased(state, itemId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, cost);
    }
  });
}

export function updateMeguriLiveValues(elements: UiElements, state: GameState): void {
  const performButton = elements.contentList.querySelector<HTMLButtonElement>("[data-meguri-action='perform']");
  const memoryFragmentsElement = elements.contentList.querySelector<HTMLElement>("[data-meguri-memory-fragments]");
  const previewElement = elements.contentList.querySelector<HTMLElement>("[data-meguri-preview]");
  const nextFragmentElement = elements.contentList.querySelector<HTMLElement>("[data-meguri-next-fragment]");
  const nextFragmentCopyElement = elements.contentList.querySelector<HTMLElement>("[data-meguri-next-fragment-copy]");
  const progressBarElement = elements.contentList.querySelector<HTMLElement>(".meguri-progress-track span");

  if (performButton) {
    performButton.disabled = state.meguri.pendingSettlement || !isMeguriAvailable(state);
  }

  if (memoryFragmentsElement) {
    memoryFragmentsElement.textContent = formatWholeAmount(getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID));
  }

  if (previewElement) {
    const preview = getMeguriSettlementPreview(state);
    previewElement.textContent = `${formatWholeAmount(preview.memoryFragmentsAwarded)} / 累計 ${formatWholeAmount(preview.totalEligibleMemoryFragments)}`;
  }

  if (nextFragmentElement || nextFragmentCopyElement || progressBarElement) {
    const preview = getMeguriSettlementPreview(state);
    const progressPercent = Math.round(Math.max(0, Math.min(1, preview.memoryFragmentProgressRatio)) * 100);

    if (nextFragmentElement) {
      nextFragmentElement.textContent = `${formatWholeAmount(preview.nextMemoryFragmentTotalTomorusa)} 灯るさ`;
    }

    if (nextFragmentCopyElement) {
      nextFragmentCopyElement.textContent = createMeguriNextFragmentMessage(formatWholeAmount(preview.tomorusaUntilNextMemoryFragment));
    }

    if (progressBarElement) {
      progressBarElement.style.width = `${progressPercent}%`;
    }
  }

  MEGURI_BUFF_ORDER.forEach((buffId) => {
    const button = elements.contentList.querySelector<HTMLButtonElement>(`[data-meguri-buff-id="${buffId}"]`);

    if (button) {
      button.disabled =
        !state.meguri.pendingSettlement ||
        isMeguriBuffPurchased(state, buffId) ||
        !canSpendResource(state, MEMORY_FRAGMENT_RESOURCE_ID, MEGURI_BUFFS[buffId].cost);
    }
  });
}
