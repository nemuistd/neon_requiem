import { ALLEY_STAGE, GAME_TITLE, INITIAL_IDOL, RESOURCE_LABELS, UI_TEXT } from "./data";
import { GameState, getAlleyStageUpgradeCost, getApplausePerSecond } from "./game";

export type UiElements = {
  applauseAmount: HTMLElement;
  applausePerSecond: HTMLElement;
  liveButton: HTMLButtonElement;
  upgradeStageButton: HTMLButtonElement;
  stageLevel: HTMLElement;
  stageCost: HTMLElement;
  stageProduction: HTMLElement;
  messageLog: HTMLElement;
};

export function setupUi(root: HTMLElement): UiElements {
  root.innerHTML = `
    <main class="game-shell">
      <header class="hero">
        <p class="eyebrow">${UI_TEXT.heroEyebrow}</p>
        <h1>${GAME_TITLE}</h1>
        <p class="subtitle">${UI_TEXT.subtitle}</p>
      </header>

      <section class="resource-panel" aria-label="${UI_TEXT.resourcePanelLabel}">
        <div>
          <span class="label">${RESOURCE_LABELS.applause}</span>
          <strong id="applause-amount">0</strong>
        </div>
        <div>
          <span class="label">${UI_TEXT.perSecondLabel}</span>
          <strong id="applause-per-second">0.00 / 秒</strong>
        </div>
      </section>

      <section class="action-panel" aria-label="${UI_TEXT.liveSectionLabel}">
        <button id="live-button" class="primary-action" type="button">${UI_TEXT.liveButton}</button>
      </section>

      <section class="content-grid">
        <article class="card idol-card">
          <span class="card-kicker">${UI_TEXT.initialIdolLabel}</span>
          <h2>${INITIAL_IDOL.name}</h2>
          <p class="reading">${INITIAL_IDOL.reading}</p>
          <p class="title-line">${INITIAL_IDOL.title}</p>
          <p>${INITIAL_IDOL.description}</p>
        </article>

        <article class="card stage-card">
          <span class="card-kicker">${UI_TEXT.initialFacilityLabel}</span>
          <h2>${ALLEY_STAGE.name}</h2>
          <p>${ALLEY_STAGE.description}</p>
          <dl class="stats-list">
            <div>
              <dt>${UI_TEXT.levelLabel}</dt>
              <dd id="stage-level">0</dd>
            </div>
            <div>
              <dt>${UI_TEXT.upgradeCostLabel}</dt>
              <dd id="stage-cost">10 拍手</dd>
            </div>
            <div>
              <dt>${UI_TEXT.productionLabel}</dt>
              <dd id="stage-production">0.00 拍手 / 秒</dd>
            </div>
          </dl>
          <button id="upgrade-stage-button" class="secondary-action" type="button">${UI_TEXT.upgradeStageButton}</button>
        </article>
      </section>

      <p id="message-log" class="message-log" aria-live="polite">${UI_TEXT.initialLog}</p>
    </main>
  `;

  return {
    applauseAmount: getElement(root, "applause-amount"),
    applausePerSecond: getElement(root, "applause-per-second"),
    liveButton: getElement(root, "live-button", HTMLButtonElement),
    upgradeStageButton: getElement(root, "upgrade-stage-button", HTMLButtonElement),
    stageLevel: getElement(root, "stage-level"),
    stageCost: getElement(root, "stage-cost"),
    stageProduction: getElement(root, "stage-production"),
    messageLog: getElement(root, "message-log")
  };
}

export function renderState(elements: UiElements, state: GameState): void {
  const upgradeCost = getAlleyStageUpgradeCost(state.alleyStageLevel);
  const applausePerSecond = getApplausePerSecond(state);

  elements.applauseAmount.textContent = formatAmount(state.applause);
  elements.applausePerSecond.textContent = `${formatRate(applausePerSecond)} / 秒`;
  elements.stageLevel.textContent = String(state.alleyStageLevel);
  elements.stageCost.textContent = `${formatAmount(upgradeCost)} 拍手`;
  elements.stageProduction.textContent = `${formatRate(applausePerSecond)} 拍手 / 秒`;
  elements.upgradeStageButton.disabled = state.applause < upgradeCost;
}

export function setMessage(elements: UiElements, message: string): void {
  elements.messageLog.textContent = message;
}

export function formatAmount(value: number): string {
  if (value < 100) {
    return value.toFixed(1);
  }

  return Math.floor(value).toLocaleString("ja-JP");
}

export function formatRate(value: number): string {
  return value.toFixed(2);
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
