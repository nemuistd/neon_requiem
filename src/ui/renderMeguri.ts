import {
  IDOL_ORDER,
  MEGURI_BUFF_ORDER,
  MEGURI_BUFFS,
  MeguriBuffId,
  RECORD_ORDER,
  RECORDS,
  RecordId
} from "../definitions";
import {
  createMeguriDashboardNextGoalFragmentMessage,
  createMeguriNextFragmentMessage,
  RESOURCE_LABELS,
  UI_TEXT
} from "../data";
import {
  canSpendResource,
  GameState,
  getMeguriFacilityProductionMultiplier,
  getMeguriSettlementPreview,
  getResourceAmount,
  isRecordAnnotationRead,
  isRecordAnnotationUnlocked,
  isMeguriAvailable,
  isMeguriBuffPurchased,
  MEMORY_FRAGMENT_RESOURCE_ID
} from "../game";
import { formatRate, formatWholeAmount } from "./format";

export function renderMeguriPanel(state: GameState): string {
  if (state.meguri.pendingSettlement) {
    return renderMeguriSettlementPanel(state);
  }

  const preview = getMeguriSettlementPreview(state);
  const isAvailable = isMeguriAvailable(state);
  const memoryFragments = getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID);

  return `
    <section class="meguri-panel">
      ${renderMeguriDashboard(state)}
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
            <dt>${UI_TEXT.meguriNextFragmentLabel}</dt>
            <dd data-meguri-next-fragment>${formatWholeAmount(preview.nextMemoryFragmentTotalTomorusa)} 灯るさ</dd>
          </div>
          <div>
            <dt>${UI_TEXT.productionMultiplierLabel}</dt>
            <dd>${formatRate(getMeguriFacilityProductionMultiplier(state))}x</dd>
          </div>
        </dl>
        ${renderMemoryFragmentProgress(preview.memoryFragmentProgressRatio, preview.tomorusaUntilNextMemoryFragment)}
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

function renderMeguriDashboard(state: GameState): string {
  if (state.meguri.count <= 0) {
    return "";
  }

  const memoryFragments = getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID);
  const purchasedBuffCount = getPurchasedMeguriBuffCount(state);
  const unlockedAnnotationCount = getUnlockedAnnotationRecordIds(state).length;
  const recognitionCount = getMeguriRecognitionCount(state);

  return `
      <article class="card meguri-dashboard-card" data-meguri-dashboard="true">
        <div class="meguri-heading">
          <span class="card-kicker">${UI_TEXT.meguriDashboardLabel}</span>
          <span class="meguri-state closed">${UI_TEXT.meguriSettlementClosedLabel}</span>
        </div>
        <div class="meguri-dashboard-grid">
          <div class="meguri-dashboard-stat">
            <span>${UI_TEXT.meguriCountLabel}</span>
            <strong data-meguri-dashboard-loop>第${state.meguri.count}廻</strong>
          </div>
          <div class="meguri-dashboard-stat">
            <span>${RESOURCE_LABELS.memoryFragment}</span>
            <strong data-meguri-dashboard-memory-fragments>${formatWholeAmount(memoryFragments)}</strong>
          </div>
          <div class="meguri-dashboard-stat">
            <span>${UI_TEXT.meguriDashboardPurchasedBuffCountLabel}</span>
            <strong data-meguri-dashboard-purchased-buffs>${purchasedBuffCount} / ${MEGURI_BUFF_ORDER.length}</strong>
          </div>
          <div class="meguri-dashboard-stat">
            <span>${UI_TEXT.meguriDashboardAnnotationCountLabel}</span>
            <strong data-meguri-dashboard-annotations>${unlockedAnnotationCount}</strong>
          </div>
          <div class="meguri-dashboard-stat">
            <span>${UI_TEXT.meguriDashboardRecognitionCountLabel}</span>
            <strong data-meguri-dashboard-recognition>${recognitionCount}</strong>
          </div>
        </div>
        <div class="meguri-dashboard-goal">
          <span>${UI_TEXT.meguriDashboardNextGoalLabel}</span>
          <strong data-meguri-dashboard-next-goal>${getMeguriDashboardNextGoal(state, memoryFragments)}</strong>
        </div>
      </article>
  `;
}

function renderMeguriSettlementPanel(state: GameState): string {
  const preview = getMeguriSettlementPreview(state);
  const memoryFragments = getResourceAmount(state, MEMORY_FRAGMENT_RESOURCE_ID);

  return `
    <section class="meguri-panel meguri-settlement-panel">
      <article class="card meguri-settlement-card">
        <div class="meguri-heading">
          <span class="card-kicker">${UI_TEXT.meguriSettledLabel}</span>
          <span class="meguri-state open">${UI_TEXT.meguriSettlementOpenLabel}</span>
        </div>
        <h2>${UI_TEXT.meguriSettlementTitle}</h2>
        <p>${UI_TEXT.meguriSettlementText}</p>
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
            <dt>${UI_TEXT.meguriNextFragmentLabel}</dt>
            <dd data-meguri-next-fragment>${formatWholeAmount(preview.nextMemoryFragmentTotalTomorusa)} 灯るさ</dd>
          </div>
        </dl>
        ${renderMemoryFragmentProgress(preview.memoryFragmentProgressRatio, preview.tomorusaUntilNextMemoryFragment)}
        ${renderMeguriSettlementRecordNotes(state)}
        <div class="meguri-settlement-actions">
          <button
            class="primary-action"
            type="button"
            data-meguri-action="closeSettlement"
          >
            ${UI_TEXT.meguriSettlementCloseButtonLabel}
          </button>
        </div>
      </article>

      <article class="card meguri-buff-card">
        <div class="meguri-heading">
          <span class="card-kicker">${UI_TEXT.meguriBuffListLabel}</span>
          <span class="meguri-state open">${UI_TEXT.meguriBuffAvailableLabel}</span>
        </div>
        <div class="meguri-buff-list">
          ${MEGURI_BUFF_ORDER.map((buffId) => renderMeguriBuff(state, buffId)).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderMeguriSettlementRecordNotes(state: GameState): string {
  const recordIds = getUnreadAnnotationRecordIds(state);

  if (recordIds.length <= 0) {
    return "";
  }

  return `
        <div class="meguri-settlement-records">
          <div>
            <span class="card-kicker">${UI_TEXT.meguriSettlementRecordNotesLabel}</span>
            <p>${UI_TEXT.meguriSettlementRecordNotesText}</p>
          </div>
          <div class="meguri-settlement-record-list">
            ${recordIds.map((recordId) => renderMeguriSettlementRecordNote(recordId)).join("")}
          </div>
          <button
            class="secondary-action"
            type="button"
            data-meguri-action="openRecords"
          >
            ${UI_TEXT.meguriSettlementOpenRecordsButtonLabel}
          </button>
        </div>
  `;
}

function renderMeguriSettlementRecordNote(recordId: RecordId): string {
  const record = RECORDS[recordId];

  return `
            <div class="meguri-settlement-record-note">
              <span>${record.category}</span>
              <strong>${record.title}</strong>
            </div>
  `;
}

function getUnreadAnnotationRecordIds(state: GameState): RecordId[] {
  return getUnlockedAnnotationRecordIds(state).filter((recordId) => !isRecordAnnotationRead(state, recordId));
}

function getUnlockedAnnotationRecordIds(state: GameState): RecordId[] {
  return RECORD_ORDER.filter((recordId) => isRecordAnnotationUnlocked(state, recordId));
}

function getPurchasedMeguriBuffCount(state: GameState): number {
  return MEGURI_BUFF_ORDER.filter((buffId) => isMeguriBuffPurchased(state, buffId)).length;
}

function getMeguriRecognitionCount(state: GameState): number {
  return IDOL_ORDER.filter((idolId) => state.meguri.idolRecognition[idolId] === true).length;
}

function getMeguriDashboardNextGoal(state: GameState, memoryFragments: number): string {
  if (getUnreadAnnotationRecordIds(state).length > 0) {
    return UI_TEXT.meguriDashboardNextGoalReadAnnotations;
  }

  const unpurchasedBuffCosts = MEGURI_BUFF_ORDER
    .filter((buffId) => !isMeguriBuffPurchased(state, buffId))
    .map((buffId) => MEGURI_BUFFS[buffId].cost);

  if (unpurchasedBuffCosts.length <= 0) {
    return UI_TEXT.meguriDashboardNextGoalContinueMeguri;
  }

  const nextBuffCost = Math.min(...unpurchasedBuffCosts);

  if (memoryFragments >= nextBuffCost) {
    return UI_TEXT.meguriDashboardNextGoalChooseBuff;
  }

  return createMeguriDashboardNextGoalFragmentMessage(formatWholeAmount(Math.ceil(nextBuffCost - memoryFragments)));
}

function renderMemoryFragmentProgress(progressRatio: number, tomorusaUntilNext: number): string {
  const progressPercent = Math.round(Math.max(0, Math.min(1, progressRatio)) * 100);

  return `
        <div class="meguri-fragment-progress">
          <div class="meguri-progress-label">
            <span>${UI_TEXT.meguriNextFragmentLabel}</span>
            <strong>${progressPercent}%</strong>
          </div>
          <div class="meguri-progress-track" aria-hidden="true">
            <span style="width: ${progressPercent}%"></span>
          </div>
          <p data-meguri-next-fragment-copy>${createMeguriNextFragmentMessage(formatWholeAmount(tomorusaUntilNext))}</p>
        </div>
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
