import {
  MEGURI_BUFF_ORDER,
  MEGURI_BUFFS,
  MeguriBuffId
} from "../definitions";
import { RESOURCE_LABELS, UI_TEXT } from "../data";
import {
  canSpendResource,
  GameState,
  getMeguriFacilityProductionMultiplier,
  getMeguriSettlementPreview,
  getResourceAmount,
  isMeguriAvailable,
  isMeguriBuffPurchased,
  MEMORY_FRAGMENT_RESOURCE_ID
} from "../game";
import { formatRate, formatWholeAmount } from "./format";

export function renderMeguriPanel(state: GameState): string {
  const preview = getMeguriSettlementPreview(state);
  const isAvailable = isMeguriAvailable(state);
  const memoryFragments = getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID);

  return `
    <section class="meguri-panel">
      <article class="card meguri-status-card">
        <div class="meguri-heading">
          <span class="card-kicker">${state.meguri.pendingSettlement ? UI_TEXT.meguriSettledLabel : UI_TEXT.meguriReadyLabel}</span>
          <span class="meguri-state ${state.meguri.pendingSettlement ? "open" : "closed"}">
            ${state.meguri.pendingSettlement ? UI_TEXT.meguriSettlementOpenLabel : UI_TEXT.meguriSettlementClosedLabel}
          </span>
        </div>
        <h2>${UI_TEXT.meguriTabLabel}</h2>
        <dl class="stats-list">
          <div>
            <dt>${UI_TEXT.meguriCountLabel}</dt>
            <dd>第${state.meguri.count}廻</dd>
          </div>
          <div>
            <dt>${RESOURCE_LABELS.memoryFragment}</dt>
            <dd data-meguri-memory-fragments>${formatWholeAmount(memoryFragments)}</dd>
          </div>
          <div>
            <dt>${UI_TEXT.meguriPreviewLabel}</dt>
            <dd data-meguri-preview>${formatWholeAmount(preview.memoryFragmentsAwarded)} / 累計 ${formatWholeAmount(preview.totalEligibleMemoryFragments)}</dd>
          </div>
          <div>
            <dt>${UI_TEXT.productionMultiplierLabel}</dt>
            <dd>${formatRate(getMeguriFacilityProductionMultiplier(state))}x</dd>
          </div>
        </dl>
        <div class="meguri-reset-copy">
          <div>
            <strong>${UI_TEXT.meguriCarryOverLabel}</strong>
            <p>${UI_TEXT.meguriCarryOverText}</p>
          </div>
          <div>
            <strong>${UI_TEXT.meguriResetLabel}</strong>
            <p>${UI_TEXT.meguriResetText}</p>
          </div>
        </div>
        <button
          class="primary-action meguri-perform-action"
          type="button"
          data-meguri-action="perform"
          ${isAvailable ? "" : "disabled"}
        >
          ${isAvailable ? UI_TEXT.meguriPerformButtonLabel : UI_TEXT.meguriPerformLockedLabel}
        </button>
      </article>

      <article class="card meguri-buff-card">
        <div class="meguri-heading">
          <span class="card-kicker">${UI_TEXT.meguriBuffListLabel}</span>
          <span class="meguri-state ${state.meguri.pendingSettlement ? "open" : "closed"}">
            ${state.meguri.pendingSettlement ? UI_TEXT.meguriBuffAvailableLabel : UI_TEXT.meguriBuffLockedLabel}
          </span>
        </div>
        <div class="meguri-buff-list">
          ${MEGURI_BUFF_ORDER.map((buffId) => renderMeguriBuff(state, buffId)).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderMeguriBuff(state: GameState, buffId: MeguriBuffId): string {
  const buff = MEGURI_BUFFS[buffId];
  const isPurchased = isMeguriBuffPurchased(state, buffId);
  const canPurchase = state.meguri.pendingSettlement && !isPurchased && canSpendResource(state, MEMORY_FRAGMENT_RESOURCE_ID, buff.cost);
  const stateLabel = isPurchased
    ? UI_TEXT.meguriBuffPurchasedLabel
    : state.meguri.pendingSettlement
      ? UI_TEXT.meguriBuffAvailableLabel
      : UI_TEXT.meguriBuffLockedLabel;

  return `
    <div class="meguri-buff-row ${isPurchased ? "purchased" : ""}">
      <div>
        <div class="meguri-buff-title">
          <strong>${buff.name}</strong>
          <span>${stateLabel}</span>
        </div>
        <p>${buff.description}</p>
        <dl class="meguri-buff-stats">
          <div>
            <dt>${UI_TEXT.itemEffectLabel}</dt>
            <dd>${buff.effectDescription}</dd>
          </div>
          <div>
            <dt>${UI_TEXT.itemPriceLabel}</dt>
            <dd data-meguri-buff-cost="${buffId}">${formatWholeAmount(buff.cost)} ${RESOURCE_LABELS.memoryFragment}</dd>
          </div>
        </dl>
      </div>
      <button
        class="secondary-action meguri-buff-action ${isPurchased ? "purchased" : ""}"
        type="button"
        data-meguri-buff-id="${buffId}"
        ${canPurchase ? "" : "disabled"}
      >
        ${isPurchased ? UI_TEXT.meguriBuffPurchasedLabel : UI_TEXT.meguriBuffPurchaseButtonLabel}
      </button>
    </div>
  `;
}
