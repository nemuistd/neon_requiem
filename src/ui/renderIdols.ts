import {
  IDOL_EVENT_ORDER,
  IDOL_EVENTS,
  IdolEventId,
  IDOL_ORDER,
  IDOLS,
  IdolId
} from "../definitions";
import type { IdolDefinition } from "../definitions";
import { UI_TEXT } from "../data";
import {
  GameState,
  getIdolBond,
  hasIdolRecognition,
  isIdolEventRead,
  isIdolEventUnlocked,
  isIdolJoinable,
  isIdolJoined,
  isIdolUnlocked,
  resolveActiveIdolId
} from "../game";
import { isRelatedProgressVisible } from "./contentVisibility";
import { formatBond } from "./format";
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

          <dl class="idol-details">
            <div>
              <dt>${UI_TEXT.bondLabel}</dt>
              <dd>${formatBond(getIdolBond(state, activeIdolId))}</dd>
            </div>
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${isIdolJoined(state, activeIdolId) ? idol.passiveDescription : UI_TEXT.lockedIdolLabel}</dd>
            </div>
          </dl>

          <button class="detail-action" type="button" disabled>${UI_TEXT.detailButtonLabel}</button>
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

export function renderIdolTabCards(state: GameState): string {
  return IDOL_ORDER
    .filter((idolId) => isRelatedProgressVisible(state, IDOLS[idolId].unlockRequirement))
    .map((idolId) => renderIdolTabCard(state, idolId))
    .join("");
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
        data-idol-id="${idolId}"
        ${isJoined ? "" : "disabled"}
        ${isActive ? 'aria-current="true"' : ""}
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <span>${isUnlocked ? idol.name : UI_TEXT.unknownIdolLabel}</span>
        <small>${isJoined ? idol.reading : isUnlocked ? UI_TEXT.joinableIdolLabel : getIdolUnlockRequirementText(idolId)}</small>
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
          <p class="reading">${idol.reading}</p>
          <p class="title-line">${idol.title}</p>
          <p>${idol.description}</p>
          ${renderRecognitionTrace(state, idolId)}
          <dl class="stats-list">
            ${isJoined
              ? `
            <div>
              <dt>${UI_TEXT.bondLabel}</dt>
              <dd>${formatBond(getIdolBond(state, idolId))}</dd>
            </div>`
              : ""}
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${isJoined ? idol.passiveDescription : UI_TEXT.unjoinedIdolEffectLabel}</dd>
            </div>
            <div>
              <dt>${UI_TEXT.unlockRequirementLabel}</dt>
              <dd>${getIdolUnlockRequirementText(idolId)}</dd>
            </div>
          </dl>
          ${isJoined ? renderIdolEventList(state, idolId) : ""}
          <button
            class="secondary-action idol-tab-action ${isActive ? "active" : isJoined ? "unlocked" : isJoinable ? "joinable" : "locked"}"
            type="button"
            ${isJoinable ? `data-idol-join-id="${idolId}"` : `data-idol-id="${idolId}"`}
            ${(isJoinable || (isJoined && !isActive)) ? "" : "disabled"}
          >
            ${isActive ? UI_TEXT.focusedIdolLabel : isJoinable ? UI_TEXT.joinIdolButtonLabel : isJoined ? UI_TEXT.focusIdolButtonLabel : UI_TEXT.lockedIdolLabel}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderIdolEventList(state: GameState, idolId: IdolId): string {
  const eventIds = IDOL_EVENT_ORDER.filter((eventId) => {
    const event = IDOL_EVENTS[eventId];

    return event.idolId === idolId && isIdolEventUnlocked(state, eventId);
  });

  if (eventIds.length === 0) {
    return "";
  }

  return `
          <section class="idol-event-list" aria-label="${UI_TEXT.idolEventsLabel}">
            <span class="card-kicker">${UI_TEXT.idolEventsLabel}</span>
            ${eventIds.map((eventId) => renderIdolEventCard(state, eventId)).join("")}
          </section>
  `;
}

function renderIdolEventCard(state: GameState, eventId: IdolEventId): string {
  const event = IDOL_EVENTS[eventId];
  const isRead = isIdolEventRead(state, eventId);

  return `
            <article class="idol-event-card ${isRead ? "read" : "unread"}">
              <div class="idol-event-heading">
                <h3>${event.title}</h3>
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
