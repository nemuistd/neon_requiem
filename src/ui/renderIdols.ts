import {
  IDOL_EVENT_ORDER,
  IDOL_EVENTS,
  IdolEventId,
  IDOL_ORDER,
  IDOLS,
  IdolId,
  RECORD_ORDER,
  RECORDS,
  RecordId,
  Requirement
} from "../definitions";
import type { IdolDefinition } from "../definitions";
import { UI_TEXT } from "../data";
import {
  GameState,
  getIdolBond,
  hasUnreadRecordContent,
  hasIdolRecognition,
  isIdolEventRead,
  isIdolEventUnlocked,
  isIdolJoinable,
  isIdolJoined,
  isIdolUnlocked,
  isRecordAnnotationRead,
  isRecordAnnotationUnlocked,
  isRecordRead,
  isRecordUnlocked,
  resolveActiveIdolId
} from "../game";
import { isRelatedProgressVisible } from "./contentVisibility";
import { formatBond } from "./format";
import {
  getIdolProgressStatus,
  renderProgressStatusCard
} from "./progressStatus";
import { getIdolUnlockRequirementText } from "./requirementText";

export function renderIdolCards(state: GameState, activeIdolId: IdolId): string {
  const idol = IDOLS[activeIdolId];

  return `
    <article class="idol-card">
      <div class="idol-main">
        ${renderIdolVisual(idol, "idol-portrait")}

        <div class="idol-info-panel">
          <div class="idol-summary">
            <span class="card-kicker">${UI_TEXT.activeIdolLabel}</span>
            <h2>${idol.name}</h2>
            <p class="reading">${idol.reading}</p>
            <p class="title-line">${idol.title}</p>
            <p>${idol.description}</p>
            ${renderRecognitionTrace(state, activeIdolId)}
          </div>

          ${renderBondRow(state, activeIdolId)}

          <dl class="idol-details">
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${isIdolJoined(state, activeIdolId) ? idol.passiveDescription : UI_TEXT.lockedIdolLabel}</dd>
            </div>
          </dl>

          <button
            class="detail-action"
            type="button"
            data-idol-detail-id="${activeIdolId}"
            aria-haspopup="dialog"
          >
            ${UI_TEXT.detailButtonLabel}
          </button>
        </div>
      </div>

      <section class="idol-roster" aria-label="${UI_TEXT.idolRosterLabel}">
        <span class="card-kicker">${UI_TEXT.idolRosterLabel}</span>
        <div class="idol-switcher">
          ${renderIdolSwitcher(state, activeIdolId)}
        </div>
      </section>
    </article>
  `;
}

export function renderIdolDetailModal(state: GameState, idolId: IdolId): string {
  const idol = IDOLS[idolId];
  const titleId = `idol-detail-modal-title-${idolId}`;

  return `
      <section class="idol-detail-modal" aria-hidden="false">
        <div class="idol-detail-modal-surface" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
          <div class="idol-detail-modal-header">
            <div>
              <span class="card-kicker">${UI_TEXT.idolDetailPanelLabel}</span>
              <h2 id="${titleId}">${idol.name}</h2>
            </div>
            <button
              class="settings-icon-button"
              type="button"
              data-idol-detail-action="close"
              aria-label="${UI_TEXT.closeButtonLabel}"
            >
              ${UI_TEXT.closeButtonLabel}
            </button>
          </div>
          ${renderIdolDetailPanel(state, idolId, `idol-detail-modal-panel-${idolId}`, "idol-detail-modal-panel")}
        </div>
      </section>
  `;
}

function renderIdolDetailPanel(state: GameState, idolId: IdolId, panelId: string, extraClassName = ""): string {
  const idol = IDOLS[idolId];
  const eventIds = getUnlockedIdolEventIds(state, idolId);
  const recordIds = getUnlockedIdolRecordIds(state, idolId);
  const className = extraClassName ? `idol-detail-panel ${extraClassName}` : "idol-detail-panel";

  return `
      <section class="${className}" id="${panelId}" aria-label="${idol.name} ${UI_TEXT.idolDetailPanelLabel}">
        <div class="idol-detail-panel-heading">
          <span class="card-kicker">${UI_TEXT.idolDetailPanelLabel}</span>
          <h3>${idol.name}</h3>
        </div>
        <div class="idol-detail-columns">
          <section class="idol-detail-section" aria-label="${UI_TEXT.idolEventsLabel}">
            <div class="idol-detail-section-heading">
              <span>${UI_TEXT.idolEventsLabel}</span>
              <strong>${eventIds.length}</strong>
            </div>
            ${eventIds.length > 0
              ? eventIds.map((eventId) => renderIdolEventCard(state, eventId)).join("")
              : `<p class="idol-detail-empty">${UI_TEXT.noIdolEventsLabel}</p>`}
          </section>
          <section class="idol-detail-section" aria-label="${UI_TEXT.idolRelatedRecordsLabel}">
            <div class="idol-detail-section-heading">
              <span>${UI_TEXT.idolRelatedRecordsLabel}</span>
              <strong>${recordIds.length}</strong>
            </div>
            ${recordIds.length > 0
              ? recordIds.map((recordId) => renderIdolRecordCard(state, recordId)).join("")
              : `<p class="idol-detail-empty">${UI_TEXT.noIdolRecordsLabel}</p>`}
          </section>
        </div>
      </section>
  `;
}

export function renderIdolTabCards(state: GameState): string {
  const idolCards = IDOL_ORDER
    .filter((idolId) => isRelatedProgressVisible(state, IDOLS[idolId].unlockRequirement))
    .map((idolId) => renderIdolTabCard(state, idolId))
    .join("");

  return `${idolCards}${renderProgressStatusCard(getIdolProgressStatus(state))}`;
}

function renderIdolSwitcher(state: GameState, activeIdolId: IdolId): string {
  return IDOL_ORDER.filter((idolId) => isRelatedProgressVisible(state, IDOLS[idolId].unlockRequirement)).map((idolId) => {
    const idol = IDOLS[idolId];
    const isUnlocked = isIdolUnlocked(state, idolId);
    const isJoined = isIdolJoined(state, idolId);
    const isActive = activeIdolId === idolId;

    return `
    <button
        class="idol-switch ${isActive ? "active" : ""} ${isJoined ? "unlocked" : isUnlocked ? "joinable" : "locked"}"
        type="button"
        ${isJoined ? `data-idol-id="${idolId}"` : isUnlocked ? `data-idol-join-id="${idolId}"` : ""}
        ${!isJoined && isUnlocked ? 'data-idol-join-source="switcher"' : ""}
        ${isJoined || isUnlocked ? "" : "disabled"}
        ${isActive ? 'aria-current="true"' : ""}
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <span>${isUnlocked ? idol.name : UI_TEXT.unknownIdolLabel}</span>
        ${isJoined ? "" : `<small>${isUnlocked ? UI_TEXT.joinableIdolLabel : getIdolUnlockRequirementText(idolId)}</small>`}
      </button>
    `;
  }).join("");
}

function renderIdolTabCard(state: GameState, idolId: IdolId): string {
  const idol = IDOLS[idolId];
  const isUnlocked = isIdolUnlocked(state, idolId);
  const isJoined = isIdolJoined(state, idolId);
  const isJoinable = isIdolJoinable(state, idolId);
  const activeIdolId = resolveActiveIdolId(state);
  const isActive = activeIdolId === idolId;
  const stateLabel = isActive
    ? UI_TEXT.focusedIdolLabel
    : isJoined
      ? (idolId === "otowaAkari" ? UI_TEXT.initialIdolLabel : UI_TEXT.joinedIdolLabel)
      : isUnlocked
        ? UI_TEXT.joinableIdolLabel
      : UI_TEXT.lockedIdolLabel;

  if (!isUnlocked) {
    return `
    <article class="card idol-tab-card locked-card">
      <div class="idol-tab-header">
        <div>
          <span class="card-kicker">${stateLabel}</span>
          <h2>${UI_TEXT.unknownIdolLabel}</h2>
        </div>
        <span class="idol-tab-state">${stateLabel}</span>
      </div>
      <div class="idol-tab-main">
        ${renderUnknownIdolVisual("idol-tab-portrait")}
        <div class="idol-tab-body">
          <p>${UI_TEXT.unknownContentDescription}</p>
          <dl class="stats-list">
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${UI_TEXT.lockedIdolLabel}</dd>
            </div>
            <div>
              <dt>${UI_TEXT.unlockRequirementLabel}</dt>
              <dd>${getIdolUnlockRequirementText(idolId)}</dd>
            </div>
          </dl>
          <button
            class="secondary-action idol-tab-action locked"
            type="button"
            data-idol-id="${idolId}"
            disabled
          >
            ${UI_TEXT.lockedIdolLabel}
          </button>
        </div>
      </div>
    </article>
  `;
  }

  return `
    <article class="card idol-tab-card ${isJoined ? "unlocked-card" : isJoinable ? "joinable-card" : "locked-card"} ${isActive ? "active-card" : ""}">
      <div class="idol-tab-header">
        <div>
          <span class="card-kicker">${stateLabel}</span>
          <h2>${idol.name}</h2>
        </div>
        <span class="idol-tab-state">${stateLabel}</span>
      </div>
      <div class="idol-tab-main">
        ${renderIdolVisual(idol, "idol-tab-portrait")}
        <div class="idol-tab-body">
          <p class="title-line">${idol.title}</p>
          <p>${idol.description}</p>
          ${renderRecognitionTrace(state, idolId)}
          ${isJoined ? renderBondRow(state, idolId) : ""}
          <dl class="stats-list">
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${isJoined ? idol.passiveDescription : UI_TEXT.unjoinedIdolEffectLabel}</dd>
            </div>
            <div>
              <dt>${UI_TEXT.unlockRequirementLabel}</dt>
              <dd>${getIdolUnlockRequirementText(idolId)}</dd>
            </div>
          </dl>
          ${isJoined
            ? renderJoinedIdolTabActions(idolId, isActive)
            : renderSingleIdolTabAction(idolId, isJoinable)}
        </div>
      </div>
    </article>
  `;
}

function renderJoinedIdolTabActions(idolId: IdolId, isActive: boolean): string {
  return `
          <div class="idol-tab-action-row">
            <button
              class="secondary-action idol-tab-action ${isActive ? "active" : "unlocked"}"
              type="button"
              data-idol-id="${idolId}"
              ${isActive ? "disabled" : ""}
            >
              ${isActive ? UI_TEXT.focusedIdolLabel : UI_TEXT.focusIdolButtonLabel}
            </button>
            <button
              class="secondary-action idol-tab-action detail unlocked"
              type="button"
              data-idol-detail-id="${idolId}"
              aria-haspopup="dialog"
            >
              ${UI_TEXT.detailButtonLabel}
            </button>
          </div>
  `;
}

function renderSingleIdolTabAction(idolId: IdolId, isJoinable: boolean): string {
  return `
          <button
            class="secondary-action idol-tab-action ${isJoinable ? "joinable" : "locked"}"
            type="button"
            ${isJoinable ? `data-idol-join-id="${idolId}"` : `data-idol-id="${idolId}"`}
            ${isJoinable ? "" : "disabled"}
          >
            ${isJoinable ? UI_TEXT.joinIdolButtonLabel : UI_TEXT.lockedIdolLabel}
          </button>
  `;
}

function getUnlockedIdolEventIds(state: GameState, idolId: IdolId): IdolEventId[] {
  return IDOL_EVENT_ORDER.filter((eventId) => {
    const event = IDOL_EVENTS[eventId];

    return event.idolId === idolId && isIdolEventUnlocked(state, eventId);
  });
}

function renderIdolEventCard(state: GameState, eventId: IdolEventId): string {
  const event = IDOL_EVENTS[eventId];
  const eventKind = event.eventKind ?? "normal";
  const isRead = isIdolEventRead(state, eventId);

  return `
            <article class="idol-event-card ${isRead ? "read" : "unread"} ${eventKind}">
              <div class="idol-event-heading">
                <div>
                  <span class="card-kicker">${getIdolEventKindLabel(eventKind)}</span>
                  <h3>${event.title}</h3>
                </div>
                <span class="idol-event-state">${isRead ? UI_TEXT.readIdolEventLabel : UI_TEXT.unreadIdolEventLabel}</span>
              </div>
              <p>${event.body}</p>
              <button
                class="secondary-action idol-event-action"
                type="button"
                data-idol-event-id="${eventId}"
                ${isRead ? "disabled" : ""}
              >
                ${isRead ? UI_TEXT.readIdolEventLabel : UI_TEXT.readIdolEventButtonLabel}
              </button>
            </article>
  `;
}

function getIdolEventKindLabel(eventKind: "normal" | "twilightMemory"): string {
  return eventKind === "twilightMemory" ? UI_TEXT.idolTwilightMemoryEventLabel : UI_TEXT.idolNormalEventLabel;
}

function renderIdolRecordCard(state: GameState, recordId: RecordId): string {
  const record = RECORDS[recordId];
  const hasUnread = hasUnreadRecordContent(state, recordId);
  const isAnnotationUnlocked = isRecordAnnotationUnlocked(state, recordId);
  const isAnnotationRead = isRecordAnnotationRead(state, recordId);
  const stateLabel = hasUnread
    ? isRecordRead(state, recordId)
      ? UI_TEXT.unreadRecordAnnotationLabel
      : UI_TEXT.unreadRecordLabel
    : UI_TEXT.readRecordLabel;

  return `
            <article class="idol-record-card ${hasUnread ? "unread" : "read"}">
              <div class="idol-event-heading">
                <div>
                  <span class="card-kicker">${record.category}</span>
                  <h3>${record.title}</h3>
                </div>
                <span class="idol-event-state">${stateLabel}</span>
              </div>
              <p>${record.body}</p>
              ${isAnnotationUnlocked
                ? `
              <aside class="record-annotation ${isAnnotationRead ? "read" : "unread"}">
                <span>${UI_TEXT.recordAnnotationLabel}</span>
                <p>${record.bodyAnnotation}</p>
              </aside>`
                : ""}
              <button
                class="secondary-action idol-event-action"
                type="button"
                data-record-id="${recordId}"
                ${hasUnread ? "" : "disabled"}
              >
                ${hasUnread ? UI_TEXT.readRecordButtonLabel : UI_TEXT.readRecordLabel}
              </button>
            </article>
  `;
}

function getUnlockedIdolRecordIds(state: GameState, idolId: IdolId): RecordId[] {
  return RECORD_ORDER.filter((recordId) => {
    const record = RECORDS[recordId];

    return record.category === "アイドルの様子" && record.relatedIdolId === idolId && isRecordUnlocked(state, recordId);
  });
}

function renderBondRow(state: GameState, idolId: IdolId): string {
  const current = getIdolBond(state, idolId);
  const goal = getNextVisibleBondGoal(state, idolId, current);

  return `
          <div class="idol-bond-row">
            <div class="idol-bond-row-header">
              <span class="idol-bond-title">${UI_TEXT.bondLabel}</span>
              <span class="idol-bond-value">${formatBond(current)} / ${formatBond(goal)}</span>
            </div>
            ${renderBondProgress(idolId, current, goal)}
          </div>
  `;
}

function renderBondProgress(idolId: IdolId, current: number, goal: number): string {
  const ratio = goal <= 0 ? 1 : Math.min(current / goal, 1);
  const percent = Math.max(0, Math.min(100, ratio * 100));

  return `
                <div class="idol-bond-progress" data-idol-bond-progress="${idolId}" data-bond-current="${formatBond(current)}" data-bond-goal="${formatBond(goal)}">
                  <div class="idol-bond-progress-track" aria-hidden="true">
                    <span style="width: ${percent.toFixed(1)}%;"></span>
                  </div>
                </div>
  `;
}

function getNextVisibleBondGoal(state: GameState, idolId: IdolId, current: number): number {
  const goals = getVisibleBondGoals(state, idolId);
  const nextGoal = goals.find((goal) => goal > current);
  const highestGoal = goals[goals.length - 1] ?? 1;

  return nextGoal ?? Math.max(current, highestGoal);
}

function getVisibleBondGoals(state: GameState, idolId: IdolId): number[] {
  const goals = IDOL_EVENT_ORDER.flatMap((eventId) => {
    const event = IDOL_EVENTS[eventId];

    if (event.idolId !== idolId || !isRelatedProgressVisible(state, event.unlockRequirement)) {
      return [];
    }

    return getIdolBondAmounts(event.unlockRequirement, idolId);
  });

  return Array.from(new Set(goals))
    .filter((goal) => goal > 0)
    .sort((left, right) => left - right);
}

function getIdolBondAmounts(requirement: Requirement, idolId: IdolId): number[] {
  if (requirement.type === "idol.bond") {
    return requirement.idolId === idolId ? [requirement.amount] : [];
  }

  if (requirement.type === "all" || requirement.type === "any") {
    return requirement.requirements.flatMap((childRequirement) => getIdolBondAmounts(childRequirement, idolId));
  }

  if (requirement.type === "not") {
    return getIdolBondAmounts(requirement.requirement, idolId);
  }

  return [];
}

function renderRecognitionTrace(state: GameState, idolId: IdolId): string {
  if (!hasIdolRecognition(state, idolId)) {
    return "";
  }

  return `
            <p class="recognition-trace">
              <span>${UI_TEXT.idolRecognitionTraceLabel}</span>
              ${UI_TEXT.idolRecognitionTraceText}
            </p>
  `;
}

function renderUnknownIdolVisual(className: string): string {
  return `
        <div class="${className}" data-idol-placeholder="true" aria-hidden="true">
          <span class="idol-placeholder-glyph">?</span>
        </div>
    `;
}

function renderIdolVisual(idol: IdolDefinition, className: string): string {
  if (idol.imageUrl) {
    return `
        <div class="${className}" aria-hidden="true">
          <img src="${idol.imageUrl}" alt="" style="object-position: ${idol.imagePosition ?? "center top"};" />
        </div>
    `;
  }

  const nameParts = idol.name.trim().split(/\s+/);
  const displayName = nameParts[nameParts.length - 1] ?? idol.name;
  const glyph = Array.from(displayName)[0] ?? "♪";

  return `
        <div class="${className}" data-idol-placeholder="true" aria-hidden="true">
          <span class="idol-placeholder-glyph">${glyph}</span>
        </div>
    `;
}
