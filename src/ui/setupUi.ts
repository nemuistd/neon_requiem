import {
  GAME_TITLE,
  RESOURCE_LABELS,
  UI_TEXT
} from "../data";
import type { UiElements } from "./types";

export function setupUi(root: HTMLElement): UiElements {
  root.innerHTML = `
    <main class="game-shell">
      <header class="top-panel">
        <div class="brand-block">
          <p class="eyebrow">${UI_TEXT.heroEyebrow}</p>
          <h1>${GAME_TITLE}</h1>
          <p class="subtitle">${UI_TEXT.compactSubtitle}</p>
        </div>

        <section class="resource-panel" aria-label="${UI_TEXT.resourcePanelLabel}">
          <div class="resource-item">
            <span class="label">${RESOURCE_LABELS.tomorusa}</span>
            <strong id="lights-amount">0</strong>
          </div>
          <div class="resource-item">
            <span class="label">${UI_TEXT.perSecondLabel}</span>
            <strong id="lights-per-second">0.00 / 秒</strong>
          </div>
        </section>

        <section class="action-panel" aria-label="${UI_TEXT.liveSectionLabel}">
          <button id="live-button" class="primary-action" type="button">${UI_TEXT.liveButton}</button>
        </section>

        <button id="settings-button" class="settings-button" type="button" aria-label="${UI_TEXT.settingsButtonLabel}" aria-expanded="false" aria-controls="settings-panel">
          ⚙
        </button>
      </header>

      <p id="message-log" class="message-log" aria-live="polite">
        <span>${UI_TEXT.messageLabel}:</span>
        ${UI_TEXT.initialLog}
      </p>

      <section class="main-layout">
        <aside class="idol-focus" aria-label="${UI_TEXT.idolSectionLabel}">
          <div id="idol-list"></div>
        </aside>

        <section class="content-panel" aria-label="${UI_TEXT.facilitySectionLabel}">
          <nav class="tab-strip" aria-label="表示カテゴリ">
            <button class="tab-button active" type="button" data-tab-id="restoration" aria-current="page">${UI_TEXT.restorationTabLabel}</button>
            <button class="tab-button" type="button" data-tab-id="song">${UI_TEXT.songTabLabel}</button>
            <button class="tab-button" type="button" data-tab-id="item">${UI_TEXT.itemTabLabel}</button>
            <button class="tab-button" type="button" data-tab-id="idol">${UI_TEXT.idolTabLabel}</button>
            <button class="tab-button" type="button" data-tab-id="record">${UI_TEXT.recordTabLabel}</button>
          </nav>
          <div id="content-list" class="facility-grid"></div>
        </section>
      </section>

      <section id="settings-panel" class="settings-panel" aria-hidden="true" hidden>
        <div class="settings-panel-surface" role="dialog" aria-modal="true" aria-label="${UI_TEXT.settingsButtonLabel}">
          <div class="settings-panel-header">
            <h2>${UI_TEXT.settingsButtonLabel}</h2>
            <button id="settings-close-button" class="settings-icon-button" type="button" aria-label="${UI_TEXT.closeButtonLabel}">×</button>
          </div>

          <div class="settings-panel-body">
            <dl class="settings-list">
              <div>
                <dt>${UI_TEXT.versionLabel}</dt>
                <dd id="settings-version"></dd>
              </div>
            </dl>

            <button id="settings-reset-button" class="settings-danger-button" type="button">
              ${UI_TEXT.resetSaveButtonLabel}
            </button>
          </div>
        </div>
      </section>
    </main>
  `;

  return {
    root,
    lightsAmount: getElement(root, "lights-amount"),
    lightsPerSecond: getElement(root, "lights-per-second"),
    liveButton: getElement(root, "live-button", HTMLButtonElement),
    settingsButton: getElement(root, "settings-button", HTMLButtonElement),
    settingsPanel: getElement(root, "settings-panel"),
    settingsCloseButton: getElement(root, "settings-close-button", HTMLButtonElement),
    settingsResetButton: getElement(root, "settings-reset-button", HTMLButtonElement),
    settingsVersion: getElement(root, "settings-version"),
    idolList: getElement(root, "idol-list"),
    contentList: getElement(root, "content-list"),
    messageLog: getElement(root, "message-log")
  };
}

function getElement<T extends HTMLElement>(
  root: HTMLElement,
  id: string,
  elementType?: { new (): T }
): T {
  const element = root.querySelector(`#${id}`);

  if (!element) {
    throw new Error(`Missing UI element: ${id}`);
  }

  if (elementType && !(element instanceof elementType)) {
    throw new Error(`Unexpected UI element type: ${id}`);
  }

  return element as T;
}
