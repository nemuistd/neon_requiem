import {
  FACILITIES,
  FACILITY_ORDER,
  FacilityId,
  ITEM_ORDER,
  ItemId,
  ITEMS,
  IdolId,
  IDOL_ORDER,
  IDOLS,
  RECORD_ORDER,
  RecordId,
  RECORDS,
  SONG_ORDER,
  SongId,
  SONGS,
  Requirement
} from "../definitions";
import {
  RESOURCE_LABELS,
  UI_TEXT
} from "../data";
import {
  GameState,
  canSpendResource,
  getTomorusaPerSecond,
  getFacilityTomorusaPerSecond,
  getFacilityLevel,
  getFacilityUpgradeCost,
  getResourceAmount,
  isItemPurchased,
  isItemUnlocked,
  isRecordRead,
  isRecordUnlocked,
  isSongPurchased,
  isSongUnlocked,
  isIdolUnlocked,
  isFacilityUnlocked,
  resolveActiveIdolId,
  TOMORUSA_RESOURCE_ID
} from "../game";
import { formatAmount, formatRate } from "./format";
import type { ActiveTabId, UiElements } from "./types";

export function renderState(elements: UiElements, state: GameState, activeTabId: ActiveTabId): void {
  const resolvedActiveIdolId = resolveActiveIdolId(state);

  renderTabs(elements, state, activeTabId);
  renderLiveValues(elements, state);
  elements.idolList.innerHTML = renderIdolCards(state, resolvedActiveIdolId);
  elements.contentList.className = getContentListClassName(activeTabId);
  elements.contentList.innerHTML = renderActiveTabContent(state, activeTabId);
}

export function renderLiveValues(elements: UiElements, state: GameState): void {
  elements.lightsAmount.textContent = formatAmount(getResourceAmount(state, TOMORUSA_RESOURCE_ID));
  elements.lightsPerSecond.textContent = `${formatRate(getTomorusaPerSecond(state))} / 秒`;
  updateFacilityLiveValues(elements, state);
}

export function setMessage(elements: UiElements, message: string): void {
  const label = document.createElement("span");
  label.textContent = `${UI_TEXT.messageLabel}:`;
  elements.messageLog.replaceChildren(label, ` ${message}`);
}

function getContentListClassName(activeTabId: ActiveTabId): string {
  if (activeTabId === "song") {
    return "song-grid";
  }

  if (activeTabId === "item") {
    return "song-grid";
  }

  if (activeTabId === "idol") {
    return "idol-grid";
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

  if (activeTabId === "item") {
    return renderItemCards(state);
  }

  if (activeTabId === "idol") {
    return renderIdolTabCards(state);
  }

  if (activeTabId === "record") {
    return renderRecordCards(state);
  }

  return renderFacilityCards(state);
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
        class="idol-switch ${isActive ? "active" : ""} ${isUnlocked ? "unlocked" : "locked"}"
        type="button"
        data-idol-id="${idolId}"
        ${isUnlocked ? "" : "disabled"}
        ${isActive ? 'aria-current="true"' : ""}
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <span>${idol.name}</span>
        <small>${isUnlocked ? idol.reading : getIdolUnlockRequirementText(idolId)}</small>
      </button>
    `;
  }).join("");
}

function renderIdolTabCards(state: GameState): string {
  return IDOL_ORDER.map((idolId) => renderIdolTabCard(state, idolId)).join("");
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
        <div class="idol-tab-portrait" aria-hidden="true">
          <img src="${idol.imageUrl}" alt="" style="object-position: ${idol.imagePosition};" />
        </div>
        <div class="idol-tab-body">
          <p class="reading">${idol.reading}</p>
          <p class="title-line">${idol.title}</p>
          <p>${idol.description}</p>
          <dl class="stats-list">
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
  const canUpgrade = canSpendResource(state, TOMORUSA_RESOURCE_ID, upgradeCost);

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
      <dd data-facility-cost="${facilityId}">${formatAmount(upgradeCost)} 灯るさ</dd>
    </div>
    <div>
      <dt>生産</dt>
      <dd data-facility-production="${facilityId}">${formatRate(getFacilityTomorusaPerSecond(state, facilityId))} 灯るさ / 秒</dd>
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
  const canPurchase = isUnlocked && !isPurchased && canSpendResource(state, TOMORUSA_RESOURCE_ID, song.cost);
  const songStateLabel = isPurchased
    ? UI_TEXT.purchasedSongLabel
    : isUnlocked
      ? UI_TEXT.unlockedSongLabel
      : UI_TEXT.lockedSongLabel;

  return `
    <article class="card song-card ${isUnlocked ? "unlocked-card" : "locked-card"} ${isPurchased ? "purchased-card" : ""}">
      <div class="song-card-heading">
        <span class="card-kicker">${songStateLabel}</span>
        <span class="song-state ${isPurchased ? "purchased" : isUnlocked ? "unlocked" : "locked"}">${songStateLabel}</span>
      </div>
      <h2>${song.name}</h2>
      <p>${song.description}</p>
      <dl class="stats-list">
        <div>
          <dt>${UI_TEXT.songEffectLabel}</dt>
          <dd>${song.effectDescription}</dd>
        </div>
        <div>
          <dt>${UI_TEXT.songPriceLabel}</dt>
          <dd data-song-cost="${songId}">${formatAmount(song.cost)} 灯るさ</dd>
        </div>
        <div>
          <dt>${UI_TEXT.unlockRequirementLabel}</dt>
          <dd>${getUnlockRequirementTextFromRequirement(song.unlockRequirement)}</dd>
        </div>
      </dl>
      <button
        class="secondary-action song-action ${isPurchased ? "purchased" : isUnlocked ? "unlocked" : "locked"}"
        type="button"
        data-song-id="${songId}"
        ${canPurchase ? "" : "disabled"}
      >
        ${isPurchased ? UI_TEXT.purchasedSongLabel : UI_TEXT.purchaseSongButtonLabel}
      </button>
    </article>
  `;
}

function renderItemCards(state: GameState): string {
  return ITEM_ORDER.map((itemId) => renderItemCard(state, itemId)).join("");
}

function renderItemCard(state: GameState, itemId: ItemId): string {
  const item = ITEMS[itemId];
  const isUnlocked = isItemUnlocked(state, itemId);
  const isPurchased = isItemPurchased(state, itemId);
  const canPurchase = isUnlocked && !isPurchased && canSpendResource(state, TOMORUSA_RESOURCE_ID, item.cost);
  const itemStateLabel = isPurchased
    ? UI_TEXT.purchasedItemLabel
    : isUnlocked
      ? UI_TEXT.unlockedItemLabel
      : UI_TEXT.lockedItemLabel;

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
          <dd data-item-cost="${itemId}">${formatAmount(item.cost)} 灯るさ</dd>
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
          <span class="record-state locked">${UI_TEXT.lockedRecordLabel}</span>
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
        <span class="record-state ${isRead ? "read" : "unread"}">${isRead ? UI_TEXT.readRecordLabel : UI_TEXT.unreadRecordLabel}</span>
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
    return UI_TEXT.initialIdolLabel;
  }

  return `${UI_TEXT.idolUnlockRequirementLabel}: ${getUnlockRequirementTextFromRequirement(requirement)}`;
}

function getUnlockRequirementTextFromRequirement(requirement: Requirement): string {
  if (requirement.type === "song.purchased") {
    if (!isSongId(requirement.songId)) {
      return "不明な歌";
    }

    return `${SONGS[requirement.songId].name} 取得`;
  }

  if (requirement.type === "resource.amount") {
    return `${formatAmount(requirement.amount)} ${RESOURCE_LABELS.tomorusa}`;
  }

  if (requirement.type === "all") {
    return requirement.requirements.map(getUnlockRequirementTextFromRequirement).join(" / ");
  }

  if (requirement.type === "any") {
    return requirement.requirements.map(getUnlockRequirementTextFromRequirement).join(" または ");
  }

  if (requirement.type === "not") {
    return `${getUnlockRequirementTextFromRequirement(requirement.requirement)} 未達成`;
  }

  if (!isFacilityId(requirement.facilityId)) {
    return "不明な施設";
  }

  return `${FACILITIES[requirement.facilityId].name} Lv ${requirement.level}`;
}

function renderTabs(elements: UiElements, state: GameState, activeTabId: ActiveTabId): void {
  elements.root.querySelectorAll<HTMLButtonElement>("[data-tab-id]").forEach((button) => {
    const isActive = button.dataset.tabId === activeTabId;

    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  const songUnlockCount = getUnlockableSongCount(state, activeTabId);
  const songButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="song"]');
  const itemUnlockCount = getUnlockableItemCount(state, activeTabId);
  const itemButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="item"]');
  const recordUnreadCount = getUnreadRecordNotificationCount(state, activeTabId);
  const recordButton = elements.root.querySelector<HTMLButtonElement>('[data-tab-id="record"]');

  if (songButton) {
    if (activeTabId === "song" || songUnlockCount <= 0) {
      songButton.removeAttribute("data-song-unlock-count");
    } else {
      songButton.dataset.songUnlockCount = String(songUnlockCount);
    }
  }

  if (itemButton) {
    if (activeTabId === "item" || itemUnlockCount <= 0) {
      itemButton.removeAttribute("data-item-unlock-count");
    } else {
      itemButton.dataset.itemUnlockCount = String(itemUnlockCount);
    }
  }

  if (recordButton) {
    if (activeTabId === "record" || recordUnreadCount <= 0) {
      recordButton.removeAttribute("data-record-unread-count");
    } else {
      recordButton.dataset.recordUnreadCount = String(recordUnreadCount);
    }
  }
}

function getUnlockableItemCount(state: GameState, activeTabId: ActiveTabId): number {
  if (activeTabId === "item") {
    return 0;
  }

  return ITEM_ORDER.reduce((count, itemId) => {
    return count + (isItemUnlocked(state, itemId) && !isItemPurchased(state, itemId) ? 1 : 0);
  }, 0);
}

function getUnlockableSongCount(state: GameState, activeTabId: ActiveTabId): number {
  if (activeTabId === "song") {
    return 0;
  }

  return SONG_ORDER.reduce((count, songId) => {
    return count + (isSongUnlocked(state, songId) && !isSongPurchased(state, songId) ? 1 : 0);
  }, 0);
}

function getUnreadRecordNotificationCount(state: GameState, activeTabId: ActiveTabId): number {
  if (activeTabId === "record") {
    return 0;
  }

  return RECORD_ORDER.reduce((count, recordId) => {
    const record = RECORDS[recordId];
    const isUnread = isRecordUnlocked(state, recordId) && !isRecordRead(state, recordId);
    const isNewSinceLastView = record.introducedAtVersion > state.recordTabLastSeenContentVersion;

    return count + (isUnread && isNewSinceLastView ? 1 : 0);
  }, 0);
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
      costElement.textContent = `${formatAmount(getFacilityUpgradeCost(state, facilityId))} 灯るさ`;
    }

    if (productionElement) {
      productionElement.textContent = `${formatRate(getFacilityTomorusaPerSecond(state, facilityId))} 灯るさ / 秒`;
    }

    if (upgradeButton) {
      upgradeButton.disabled = !isFacilityUnlocked(state, facilityId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, getFacilityUpgradeCost(state, facilityId));
    }
  });

  updateSongLiveValues(elements, state);
  updateItemLiveValues(elements, state);
}

function updateSongLiveValues(elements: UiElements, state: GameState): void {
  SONG_ORDER.forEach((songId) => {
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-song-id="${songId}"]`);

    if (purchaseButton) {
      purchaseButton.disabled = !isSongUnlocked(state, songId) || isSongPurchased(state, songId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, SONGS[songId].cost);
    }
  });
}

function updateItemLiveValues(elements: UiElements, state: GameState): void {
  ITEM_ORDER.forEach((itemId) => {
    const purchaseButton = elements.contentList.querySelector<HTMLButtonElement>(`[data-item-id="${itemId}"]`);

    if (purchaseButton) {
      purchaseButton.disabled = !isItemUnlocked(state, itemId) || isItemPurchased(state, itemId) || !canSpendResource(state, TOMORUSA_RESOURCE_ID, ITEMS[itemId].cost);
    }
  });
}

function isFacilityId(value: string | undefined): value is FacilityId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(FACILITIES, value);
}

function isSongId(value: string | undefined): value is SongId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SONGS, value);
}

