import {
  IDOL_ORDER,
  IDOLS,
  IdolId
} from "../definitions";
import type { IdolDefinition } from "../definitions";
import { UI_TEXT } from "../data";
import {
  GameState,
  getIdolBond,
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
          </div>

          <dl class="idol-details">
            <div>
              <dt>${UI_TEXT.bondLabel}</dt>
              <dd>${formatBond(getIdolBond(state, activeIdolId))}</dd>
            </div>
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${isIdolUnlocked(state, activeIdolId) ? idol.passiveDescription : UI_TEXT.lockedIdolLabel}</dd>
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
    const isActive = activeIdolId === idolId;

    return `
    <button
        class="idol-switch ${isActive ? "active" : ""} ${isUnlocked ? "unlocked" : "locked"}"
        type="button"
        data-idol-id="${idolId}"
        ${isUnlocked ? "" : "disabled"}
        ${isActive ? 'aria-current="true"' : ""}
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <span>${isUnlocked ? idol.name : UI_TEXT.unknownIdolLabel}</span>
        <small>${isUnlocked ? idol.reading : getIdolUnlockRequirementText(idolId)}</small>
      </button>
    `;
  }).join("");
}

function renderIdolTabCard(state: GameState, idolId: IdolId): string {
  const idol = IDOLS[idolId];
  const isUnlocked = isIdolUnlocked(state, idolId);
  const activeIdolId = resolveActiveIdolId(state);
  const isActive = activeIdolId === idolId;
  const stateLabel = isActive
    ? UI_TEXT.focusedIdolLabel
    : isUnlocked
      ? (idolId === "otowaAkari" ? UI_TEXT.initialIdolLabel : UI_TEXT.unlockedIdolLabel)
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
    <article class="card idol-tab-card ${isUnlocked ? "unlocked-card" : "locked-card"} ${isActive ? "active-card" : ""}">
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
          <dl class="stats-list">
            ${isUnlocked
              ? `
            <div>
              <dt>${UI_TEXT.bondLabel}</dt>
              <dd>${formatBond(getIdolBond(state, idolId))}</dd>
            </div>`
              : ""}
            <div>
              <dt>${UI_TEXT.passiveEffectLabel}</dt>
              <dd>${isUnlocked ? idol.passiveDescription : UI_TEXT.lockedIdolLabel}</dd>
            </div>
            <div>
              <dt>${UI_TEXT.unlockRequirementLabel}</dt>
              <dd>${getIdolUnlockRequirementText(idolId)}</dd>
            </div>
          </dl>
          <button
            class="secondary-action idol-tab-action ${isActive ? "active" : isUnlocked ? "unlocked" : "locked"}"
            type="button"
            data-idol-id="${idolId}"
            ${isUnlocked && !isActive ? "" : "disabled"}
          >
            ${isActive ? UI_TEXT.focusedIdolLabel : isUnlocked ? UI_TEXT.focusIdolButtonLabel : UI_TEXT.lockedIdolLabel}
          </button>
        </div>
      </div>
    </article>
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
