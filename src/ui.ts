import {
  FACILITIES,
  FACILITY_ORDER,
  FacilityId,
  IdolId,
  IDOL_ORDER,
  IDOLS,
  RECORD_ORDER,
  RecordId,
  RECORDS,
  SONG_ORDER,
  SongId,
  SONGS,
  UnlockRequirement
} from "./definitions";
import {
  GAME_TITLE,
  RESOURCE_LABELS,
  UI_TEXT
} from "./data";
import {
  GameState,
  getLightsPerSecond,
  getFacilityLightsPerSecond,
  getFacilityLevel,
  getFacilityUpgradeCost,
  isRecordRead,
  isRecordUnlocked,
  isSongPurchased,
  isSongUnlocked,
  isIdolUnlocked,
  isFacilityUnlocked
} from "./game";

export type ActiveTabId = "restoration" | "song" | "record";

export type UiElements = {
  root: HTMLElement;
  lightsAmount: HTMLElement;
  lightsPerSecond: HTMLElement;
  liveButton: HTMLButtonElement;
  idolList: HTMLElement;
  contentList: HTMLElement;
  messageLog: HTMLElement;
};

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
            <span class="label">${RESOURCE_LABELS.lights}</span>
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

        <button class="settings-button" type="button" disabled aria-label="${UI_TEXT.settingsButtonLabel}">
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
            <button class="tab-button" type="button" disabled>${UI_TEXT.idolTabLabel}</button>
            <button class="tab-button" type="button" data-tab-id="record">${UI_TEXT.recordTabLabel}</button>
          </nav>
          <div id="content-list" class="facility-grid"></div>
        </section>
      </section>
    </main>
  `;

  return {
    root,
    lightsAmount: getElement(root, "lights-amount"),
    lightsPerSecond: getElement(root, "lights-per-second"),
    liveButton: getElement(root, "live-button", HTMLButtonElement),
    idolList: getElement(root, "idol-list"),
    contentList: getElement(root, "content-list"),
    messageLog: getElement(root, "message-log")
  };
}

export function renderState(elements: UiElements, state: GameState, activeIdolId: IdolId, activeTabId: ActiveTabId): IdolId {
  const resolvedActiveIdolId = isIdolUnlocked(state, activeIdolId) ? activeIdolId : "otowaAkari";

  renderTabs(elements, activeTabId);
  renderLiveValues(elements, state);
  elements.idolList.innerHTML = renderIdolCards(state, resolvedActiveIdolId);
  elements.contentList.className = getContentListClassName(activeTabId);
  elements.contentList.innerHTML = renderActiveTabContent(state, activeTabId);

  return resolvedActiveIdolId;
}

export function renderLiveValues(elements: UiElements, state: GameState): void {
  elements.lightsAmount.textContent = formatAmount(state.lights);
  elements.lightsPerSecond.textContent = `${formatRate(getLightsPerSecond(state))} / 秒`;
  updateFacilityLiveValues(elements, state);
}

export function setMessage(elements: UiElements, message: string): void {
  const label = document.createElement("span");
  label.textContent = `${UI_TEXT.messageLabel}:`;
  elements.messageLog.replaceChildren(label, ` ${message}`);
}

export function getFacilityIdFromEvent(event: Event): FacilityId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-facility-id]");
  const facilityId = button?.dataset.facilityId;

  if (isFacilityId(facilityId)) {
    return facilityId;
  }

  return null;
}

export function getIdolIdFromEvent(event: Event): IdolId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-idol-id]");
  const idolId = button?.dataset.idolId;

  if (isIdolId(idolId)) {
    return idolId;
  }

  return null;
}

export function getSongIdFromEvent(event: Event): SongId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-song-id]");
  const songId = button?.dataset.songId;

  if (isSongId(songId)) {
    return songId;
  }

  return null;
}

export function getRecordIdFromEvent(event: Event): RecordId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-record-id]");
  const recordId = button?.dataset.recordId;

  if (isRecordId(recordId)) {
    return recordId;
  }

  return null;
}

export function getTabIdFromEvent(event: Event): ActiveTabId | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>("[data-tab-id]");
  const tabId = button?.dataset.tabId;

  if (tabId === "restoration" || tabId === "song" || tabId === "record") {
    return tabId;
  }

  return null;
}

function getContentListClassName(activeTabId: ActiveTabId): string {
  if (activeTabId === "song") {
    return "song-grid";
  }

  if (activeTabId === "record") {
    return "record-list";
  }

  return "facility-grid";
}

function renderActiveTabContent(state: GameState, activeTabId: ActiveTabId): string {
  if (activeTabId === "song") {
    return renderSongCards(state);
  }

  if (activeTabId === "record") {
    return renderRecordCards(state);
  }

  return renderFacilityCards(state);
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

function renderIdolCards(state: GameState, activeIdolId: IdolId): string {
  const idol = IDOLS[activeIdolId];

  return `
    <article class="idol-card">
      <div class="idol-main">
        <div class="idol-portrait" aria-hidden="true">
          <img src="${idol.imageUrl}" alt="" style="object-position: ${idol.imagePosition};" />
        </div>

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

function renderIdolSwitcher(state: GameState, activeIdolId: IdolId): string {
  return IDOL_ORDER.map((idolId) => {
    const idol = IDOLS[idolId];
    const isUnlocked = isIdolUnlocked(state, idolId);
    const isActive = activeIdolId === idolId;

    return `
      <button
        class="idol-switch ${isActive ? "active" : ""} ${isUnlocked ? "" : "locked"}"
        type="button"
        data-idol-id="${idolId}"
        ${isUnlocked ? "" : "disabled"}
        ${isActive ? 'aria-current="true"' : ""}
      >
        <span>${idol.name}</span>
        <small>${isUnlocked ? idol.reading : getIdolUnlockRequirementText(idolId)}</small>
      </button>
    `;
  }).join("");
}

function renderFacilityCards(state: GameState): string {
  return FACILITY_ORDER.map((facilityId) => renderFacilityCard(state, facilityId)).join("");
}

function renderFacilityCard(state: GameState, facilityId: FacilityId): string {
  const facility = FACILITIES[facilityId];
  const isUnlocked = isFacilityUnlocked(state, facilityId);

  if (!isUnlocked) {
    return `
      <article class="card stage-card locked-card">
        <h2 class="facility-title">${facility.name}</h2>
        <div class="facility-card-main">
          <div class="facility-visual facility-visual-${facilityId}" aria-hidden="true"></div>
          <div class="facility-card-body">
            <dl class="stats-list">
              <div>
                <dt>${UI_TEXT.unlockRequirementLabel}</dt>
                <dd data-facility-unlock-requirement="${facilityId}">${getUnlockRequirementText(facilityId)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>
    `;
  }

  const level = getFacilityLevel(state, facilityId);
  const upgradeCost = getFacilityUpgradeCost(state, facilityId);
  const canUpgrade = state.lights >= upgradeCost;

  return `
    <article class="card stage-card">
      <h2 class="facility-title">${facility.name}</h2>
      <div class="facility-card-main">
        <div class="facility-visual facility-visual-${facilityId}" aria-hidden="true"></div>
        <div class="facility-card-body">
          <dl class="stats-list">
            <div>
              <dt>${UI_TEXT.levelLabel}</dt>
              <dd data-facility-level="${facilityId}">${level}</dd>
            </div>
            ${renderFacilityStats(state, facilityId, upgradeCost)}
          </dl>
        </div>
      </div>
      <button
        class="secondary-action"
        type="button"
        data-facility-id="${facilityId}"
        ${canUpgrade ? "" : "disabled"}
      >
        ${facility.name}を強化
      </button>
    </article>
  `;
}

function renderFacilityStats(state: GameState, facilityId: FacilityId, upgradeCost: number): string {
  return `
    <div>
      <dt>価格</dt>
      <dd data-facility-cost="${facilityId}">${formatAmount(upgradeCost)} 灯り</dd>
    </div>
    <div>
      <dt>生産</dt>
      <dd data-facility-production="${facilityId}">${formatRate(getFacilityLightsPerSecond(state, facilityId))} 灯り / 秒</dd>
    </div>
  `;
}

function renderSongCards(state: GameState): string {
  return SONG_ORDER.map((songId) => renderSongCard(state, songId)).join("");
}

function renderSongCard(state: GameState, songId: SongId): string {
  const song = SONGS[songId];
  const isUnlocked = isSongUnlocked(state, songId);
  const isPurchased = isSongPurchased(state, songId);
  const canPurchase = isUnlocked && !isPurchased && state.lights >= song.cost;

  return `
    <article class="card song-card ${isUnlocked ? "" : "locked-card"} ${isPurchased ? "purchased-card" : ""}">
      <span class="card-kicker">${isPurchased ? UI_TEXT.purchasedSongLabel : UI_TEXT.songTabLabel}</span>
      <h2>${song.name}</h2>
      <p>${song.description}</p>
      <dl class="stats-list">
        <div>
          <dt>${UI_TEXT.songEffectLabel}</dt>
          <dd>${song.effectDescription}</dd>
        </div>
        <div>
          <dt>${UI_TEXT.songPriceLabel}</dt>
          <dd data-song-cost="${songId}">${formatAmount(song.cost)} 灯り</dd>
        </div>
        <div>
          <dt>${UI_TEXT.unlockRequirementLabel}</dt>
          <dd>${getUnlockRequirementTextFromRequirement(song.unlockRequirement)}</dd>
        </div>
      </dl>
      <button
        class="secondary-action"
        type="button"
        data-song-id="${songId}"
        ${canPurchase ? "" : "disabled"}
      >
        ${isPurchased ? UI_TEXT.purchasedSongLabel : UI_TEXT.purchaseSongButtonLabel}
      </button>
    </article>
  `;
}

function renderRecordCards(state: GameState): string {
  return RECORD_ORDER.map((recordId) => renderRecordCard(state, recordId)).join("");
}

function renderRecordCard(state: GameState, recordId: RecordId): string {
  const record = RECORDS[recordId];
  const isUnlocked = isRecordUnlocked(state, recordId);
  const isRead = isRecordRead(state, recordId);

  if (!isUnlocked) {
    return `
      <article class="card record-card locked-card">
        <div class="record-card-heading">
          <span class="card-kicker">${UI_TEXT.lockedRecordLabel}</span>
          <span class="record-state">${UI_TEXT.lockedIdolLabel}</span>
        </div>
        <h2>${record.title}</h2>
        <dl class="stats-list">
          <div>
            <dt>${UI_TEXT.unlockRequirementLabel}</dt>
            <dd>${record.unlockRequirements.map(getUnlockRequirementTextFromRequirement).join(" / ")}</dd>
          </div>
        </dl>
      </article>
    `;
  }

  return `
    <article class="card record-card ${isRead ? "read-record-card" : "unread-record-card"}">
      <div class="record-card-heading">
        <span class="card-kicker">${record.category}</span>
        <span class="record-state">${isRead ? UI_TEXT.readRecordLabel : UI_TEXT.unreadRecordLabel}</span>
      </div>
      <h2>${record.title}</h2>
      <p>${record.body}</p>
      <button
        class="secondary-action"
        type="button"
        data-record-id="${recordId}"
        ${isRead ? "disabled" : ""}
      >
        ${isRead ? UI_TEXT.readRecordLabel : UI_TEXT.readRecordButtonLabel}
      </button>
    </article>
  `;
}

function getUnlockRequirementText(facilityId: FacilityId): string {
  const requirement = FACILITIES[facilityId].unlockRequirement;

  if (!requirement) {
    return "";
  }

  return getUnlockRequirementTextFromRequirement(requirement);
}

function getIdolUnlockRequirementText(idolId: IdolId): string {
  const requirement = IDOLS[idolId].unlockRequirement;

  if (!requirement) {
    return UI_TEXT.lockedIdolLabel;
  }

  return `${UI_TEXT.idolUnlockRequirementLabel}: ${getUnlockRequirementTextFromRequirement(requirement)}`;
}

function getUnlockRequirementTextFromRequirement(requirement: UnlockRequirement): string {
  if (requirement.type === "songPurchased") {
    return `${SONGS[requirement.songId].name} 取得`;
  }

  return `${FACILITIES[requirement.facilityId].name} Lv ${requirement.level}`;
}

function renderTabs(elements: UiElements, activeTabId: ActiveTabId): void {
  elements.root.querySelectorAll<HTMLButtonElement>("[data-tab-id]").forEach((button) => {
    const isActive = button.dataset.tabId === activeTabId;

    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
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

function updateFacilityLiveValues(elements: UiElements, state: GameState): void {
  FACILITY_ORDER.forEach((facilityId) => {
    const levelElement = elements.contentList.querySelector<HTMLElement>(`[data-facility-level="${facilityId}"]`);
    const costElement = elements.contentList.querySelector<HTMLElement>(`[data-facility-cost="${facilityId}"]`);
    const productionElement = elements.contentList.querySelector<HTMLElement>(`[data-facility-production="${facilityId}"]`);
    const upgradeButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-facility-id="${facilityId}"]`);

    if (levelElement) {
      levelElement.textContent = String(getFacilityLevel(state, facilityId));
    }

    if (costElement) {
      costElement.textContent = `${formatAmount(getFacilityUpgradeCost(state, facilityId))} 灯り`;
    }

    if (productionElement) {
      productionElement.textContent = `${formatRate(getFacilityLightsPerSecond(state, facilityId))} 灯り / 秒`;
    }

    if (upgradeButton) {
      upgradeButton.disabled = !isFacilityUnlocked(state, facilityId) || state.lights < getFacilityUpgradeCost(state, facilityId);
    }
  });

  updateSongLiveValues(elements, state);
}

function updateSongLiveValues(elements: UiElements, state: GameState): void {
  SONG_ORDER.forEach((songId) => {
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-song-id="${songId}"]`);

    if (purchaseButton) {
      purchaseButton.disabled = !isSongUnlocked(state, songId) || isSongPurchased(state, songId) || state.lights < SONGS[songId].cost;
    }
  });
}

function isFacilityId(value: string | undefined): value is FacilityId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(FACILITIES, value);
}

function isIdolId(value: string | undefined): value is IdolId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(IDOLS, value);
}

function isSongId(value: string | undefined): value is SongId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SONGS, value);
}

function isRecordId(value: string | undefined): value is RecordId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(RECORDS, value);
}
