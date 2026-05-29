import {
  ITEM_ORDER,
  ITEMS,
  ItemId
} from "../definitions";
import { UI_TEXT } from "../data";
import {
  canSpendResource,
  GameState,
  getItemCost,
  isItemPurchased,
  isItemUnlocked,
  TOMORUSA_RESOURCE_ID
} from "../game";
import { isRelatedProgressVisible } from "./contentVisibility";
import { formatAmount, formatDetailedAmount } from "./format";
import { renderNumberDetail } from "./numberDetail";
import {
  getItemProgressStatus,
  renderProgressStatusCard
} from "./progressStatus";
import { getUnlockRequirementTextFromRequirement } from "./requirementText";

export function renderItemCards(state: GameState): string {
  const itemCards = ITEM_ORDER
    .filter((itemId) => isRelatedProgressVisible(state, ITEMS[itemId].unlockRequirement))
    .map((itemId) => renderItemCard(state, itemId))
    .join("");

  return `${itemCards}${renderProgressStatusCard(getItemProgressStatus(state))}`;
}

function renderItemCard(state: GameState, itemId: ItemId): string {
  const item = ITEMS[itemId];
  const isUnlocked = isItemUnlocked(state, itemId);
  const isPurchased = isItemPurchased(state, itemId);
  const cost = getItemCost(state, itemId);
  const canPurchase = isUnlocked && !isPurchased && canSpendResource(state, TOMORUSA_RESOURCE_ID, cost);
  const itemStateLabel = isPurchased
    ? UI_TEXT.purchasedItemLabel
    : isUnlocked
      ? UI_TEXT.unlockedItemLabel
      : UI_TEXT.lockedItemLabel;

  if (!isUnlocked) {
    return `
      <article class="card song-card locked-card">
        <div class="song-card-heading">
          <span class="card-kicker">${itemStateLabel}</span>
          <span class="song-state locked">${itemStateLabel}</span>
        </div>
        <h2>${UI_TEXT.unknownItemLabel}</h2>
        <p>${UI_TEXT.unknownContentDescription}</p>
        <dl class="stats-list">
          <div>
            <dt>${UI_TEXT.unlockRequirementLabel}</dt>
            <dd>${getUnlockRequirementTextFromRequirement(item.unlockRequirement)}</dd>
          </div>
        </dl>
        <button
          class="secondary-action song-action locked"
          type="button"
          data-item-id="${itemId}"
          disabled
        >
          ${UI_TEXT.lockedItemLabel}
        </button>
      </article>
    `;
  }

  return `
    <article class="card song-card ${isUnlocked ? "unlocked-card" : "locked-card"} ${isPurchased ? "purchased-card" : ""}">
      <div class="song-card-heading">
        <span class="card-kicker">${itemStateLabel}</span>
        <span class="song-state ${isPurchased ? "purchased" : isUnlocked ? "unlocked" : "locked"}">${itemStateLabel}</span>
      </div>
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <dl class="stats-list">
        <div>
          <dt>${UI_TEXT.itemEffectLabel}</dt>
          <dd>${item.effectDescription}</dd>
        </div>
        <div>
          <dt>${UI_TEXT.itemPriceLabel}</dt>
          <dd data-item-cost="${itemId}">${renderNumberDetail(`${formatAmount(cost)} 灯るさ`, `${formatDetailedAmount(cost)} 灯るさ`)}</dd>
        </div>
        <div>
          <dt>${UI_TEXT.unlockRequirementLabel}</dt>
          <dd>${getUnlockRequirementTextFromRequirement(item.unlockRequirement)}</dd>
        </div>
      </dl>
      <button
        class="secondary-action song-action ${isPurchased ? "purchased" : isUnlocked ? "unlocked" : "locked"}"
        type="button"
        data-item-id="${itemId}"
        ${canPurchase ? "" : "disabled"}
      >
        ${isPurchased ? UI_TEXT.purchasedItemLabel : UI_TEXT.purchaseItemButtonLabel}
      </button>
    </article>
  `;
}
