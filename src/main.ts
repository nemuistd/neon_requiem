import "./style.css";
import { createFacilityUpgradeMessage, createIdolJoinMessage, createItemPurchaseMessage, createMeguriBuffPurchaseMessage, createMeguriPerformedMessage, createOfflineRewardMessage, createSongPurchaseMessage, UI_TEXT } from "./data";
import { FACILITIES, IDOLS, ITEMS, MEGURI_BUFFS, SONGS } from "./definitions";
import { applyProduction, closeMeguriSettlement, GameState, isMeguriTabUnlocked, joinIdol, markRecordTabSeen, performManualLive, performMeguri, purchaseItem, purchaseMeguriBuff, purchaseSong, readRecord, resolveActiveIdolId, SAVE_VERSION, selectActiveIdol, upgradeFacility } from "./game";
import { loadGame, saveGame, SAVE_KEY } from "./storage";
import { getFacilityIdFromEvent, getIdolIdFromEvent, getIdolJoinIdFromEvent, getItemIdFromEvent, getMeguriActionFromEvent, getMeguriBuffIdFromEvent, getRecordIdFromEvent, getSongIdFromEvent, getTabIdFromEvent } from "./ui/events";
import { formatAmount, formatWholeAmount } from "./ui/format";
import { renderLiveValues } from "./ui/liveValues";
import { renderState, setMessage } from "./ui/renderState";
import { setupUi } from "./ui/setupUi";
import type { ActiveTabId } from "./ui/types";

const SAVE_INTERVAL_MS = 5000;

declare global {
  interface Window {
    __NEON_DEBUG__: {
      getState: () => GameState;
      resetSave: () => void;
      setSaveForTest: (save: unknown) => void;
    };
  }
}

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Missing app root.");
}

const elements = setupUi(root);
const loadResult = loadGame();
let state: GameState = loadResult.state;
let lastTickAt = Date.now();
let activeTabId: ActiveTabId = state.meguri.pendingSettlement ? "meguri" : "restoration";
let isSettingsOpen = false;
let isDebugReloading = false;

function advanceToNow(): void {
  const now = Date.now();
  const elapsedSeconds = (now - lastTickAt) / 1000;
  lastTickAt = now;

  state = applyProduction(state, elapsedSeconds);
}

function reloadWithSaveSuppressed(): void {
  isDebugReloading = true;
  window.location.reload();
}

function resetSaveData(): void {
  const confirmed = window.confirm("セーブデータを削除して初期状態に戻します。よろしいですか？");

  if (!confirmed) {
    return;
  }

  window.localStorage.removeItem(SAVE_KEY);
  reloadWithSaveSuppressed();
}

function openSettings(): void {
  isSettingsOpen = true;
  renderSettings();
}

function closeSettings(): void {
  isSettingsOpen = false;
  renderSettings();
}

function renderSettings(): void {
  elements.settingsPanel.hidden = !isSettingsOpen;
  elements.settingsPanel.setAttribute("aria-hidden", isSettingsOpen ? "false" : "true");
  elements.settingsButton.setAttribute("aria-expanded", isSettingsOpen ? "true" : "false");
  elements.settingsVersion.textContent = `v${SAVE_VERSION}`;
}

window.__NEON_DEBUG__ = {
  getState: () => state,
  resetSave: () => {
    resetSaveData();
  },
  setSaveForTest: (save: unknown) => {
    const serializedSave = typeof save === "string" ? save : JSON.stringify(save);
    window.localStorage.setItem(SAVE_KEY, serializedSave);
    reloadWithSaveSuppressed();
  }
};

renderState(elements, state, activeTabId);
renderSettings();

if (loadResult.offlineTomorusa > 0) {
  setMessage(elements, createOfflineRewardMessage(IDOLS[resolveActiveIdolId(state)].name, formatAmount(loadResult.offlineTomorusa)));
}

elements.settingsButton.addEventListener("click", () => {
  if (isSettingsOpen) {
    closeSettings();
    return;
  }

  openSettings();
});

elements.settingsCloseButton.addEventListener("click", () => {
  closeSettings();
});

elements.settingsResetButton.addEventListener("click", () => {
  resetSaveData();
});

elements.liveButton.addEventListener("click", () => {
  if (state.meguri.pendingSettlement) {
    activeTabId = "meguri";
    renderState(elements, state, activeTabId);
    setMessage(elements, UI_TEXT.meguriSettlementBlockedLog);
    return;
  }

  advanceToNow();
  state = performManualLive(state);
  state = saveGame(state);
  renderState(elements, state, activeTabId);
  setMessage(elements, UI_TEXT.liveSuccessLog);
});

elements.root.addEventListener("click", (event) => {
  if (event.target === elements.settingsPanel) {
    closeSettings();
    return;
  }

  const tabId = getTabIdFromEvent(event);

  if (tabId) {
    if (tabId === "meguri" && !isMeguriTabUnlocked(state)) {
      setMessage(elements, UI_TEXT.meguriUnavailableLog);
      return;
    }

    if (state.meguri.pendingSettlement && tabId !== "meguri") {
      activeTabId = "meguri";
      renderState(elements, state, activeTabId);
      setMessage(elements, UI_TEXT.meguriSettlementBlockedLog);
      return;
    }

    activeTabId = tabId;

    if (tabId === "record") {
      advanceToNow();
      state = saveGame(markRecordTabSeen(state));
    }

    renderState(elements, state, activeTabId);
    return;
  }

  const meguriAction = getMeguriActionFromEvent(event);

  if (meguriAction === "closeSettlement") {
    advanceToNow();
    state = saveGame(closeMeguriSettlement(state));
    activeTabId = "restoration";
    renderState(elements, state, activeTabId);
    setMessage(elements, UI_TEXT.meguriSettlementClosedLog);
    return;
  }

  if (meguriAction === "openRecords") {
    advanceToNow();
    state = saveGame(markRecordTabSeen(closeMeguriSettlement(state)));
    activeTabId = "record";
    renderState(elements, state, activeTabId);
    setMessage(elements, UI_TEXT.meguriSettlementOpenRecordsLog);
    return;
  }

  if (meguriAction === "perform") {
    advanceToNow();
    const result = performMeguri(state);

    if (!result.performed) {
      setMessage(elements, UI_TEXT.meguriUnavailableLog);
      return;
    }

    const confirmed = window.confirm(UI_TEXT.meguriConfirmText);

    if (!confirmed) {
      return;
    }

    state = saveGame(result.state);
    activeTabId = "meguri";
    renderState(elements, state, activeTabId);
    setMessage(elements, createMeguriPerformedMessage(formatWholeAmount(result.preview.memoryFragmentsAwarded)));
    return;
  }

  const meguriBuffId = getMeguriBuffIdFromEvent(event);

  if (meguriBuffId) {
    advanceToNow();
    const result = purchaseMeguriBuff(state, meguriBuffId);

    if (!result.purchased) {
      if (result.reason === "alreadyPurchased") {
        setMessage(elements, UI_TEXT.alreadyPurchasedMeguriBuffLog);
      } else if (result.reason === "notInSettlement") {
        setMessage(elements, UI_TEXT.meguriBuffNotInSettlementLog);
      } else {
        setMessage(elements, UI_TEXT.notEnoughMemoryFragmentsLog);
      }

      return;
    }

    state = saveGame(result.state);
    renderState(elements, state, activeTabId);
    setMessage(elements, createMeguriBuffPurchaseMessage(MEGURI_BUFFS[result.buffId].name, formatWholeAmount(result.cost)));
    return;
  }

  if (state.meguri.pendingSettlement) {
    activeTabId = "meguri";
    renderState(elements, state, activeTabId);
    setMessage(elements, UI_TEXT.meguriSettlementBlockedLog);
    return;
  }

  const idolJoinId = getIdolJoinIdFromEvent(event);

  if (idolJoinId) {
    advanceToNow();
    const result = joinIdol(state, idolJoinId);

    if (!result.joined) {
      setMessage(elements, result.reason === "alreadyJoined" ? UI_TEXT.idolAlreadyJoinedLog : UI_TEXT.idolJoinLockedLog);
      return;
    }

    state = saveGame(result.state);
    activeTabId = "idol";
    renderState(elements, state, activeTabId);
    setMessage(elements, createIdolJoinMessage(IDOLS[result.idolId].name, IDOLS[result.idolId].passiveDescription));
    return;
  }

  const idolId = getIdolIdFromEvent(event);

  if (idolId) {
    advanceToNow();
    state = saveGame(selectActiveIdol(state, idolId));
    renderState(elements, state, activeTabId);
    return;
  }

  const itemId = getItemIdFromEvent(event);

  if (itemId) {
    advanceToNow();
    const result = purchaseItem(state, itemId);

    if (!result.purchased) {
      if (result.reason === "locked") {
        setMessage(elements, UI_TEXT.lockedItemLog);
      } else if (result.reason === "alreadyPurchased") {
        setMessage(elements, UI_TEXT.alreadyPurchasedItemLog);
      } else {
        setMessage(elements, UI_TEXT.notEnoughLightsLog);
      }

      return;
    }

    state = saveGame(closeMeguriSettlement(result.state));
    renderState(elements, state, activeTabId);
    setMessage(elements, createItemPurchaseMessage(ITEMS[result.itemId].name, formatAmount(result.cost)));
    return;
  }

  const songId = getSongIdFromEvent(event);

  if (songId) {
    advanceToNow();
    const result = purchaseSong(state, songId);

    if (!result.purchased) {
      if (result.reason === "locked") {
        setMessage(elements, UI_TEXT.lockedSongLog);
      } else if (result.reason === "alreadyPurchased") {
        setMessage(elements, UI_TEXT.alreadyPurchasedSongLog);
      } else {
        setMessage(elements, UI_TEXT.notEnoughLightsLog);
      }

      return;
    }

    state = saveGame(closeMeguriSettlement(result.state));
    renderState(elements, state, activeTabId);
    setMessage(elements, createSongPurchaseMessage(SONGS[result.songId].name, formatAmount(result.cost)));
    return;
  }

  const recordId = getRecordIdFromEvent(event);

  if (recordId) {
    advanceToNow();
    state = saveGame(readRecord(state, recordId));
    renderState(elements, state, activeTabId);
    setMessage(elements, UI_TEXT.recordReadLog);
    return;
  }

  const facilityId = getFacilityIdFromEvent(event);

  if (!facilityId) {
    return;
  }

  advanceToNow();
  const result = upgradeFacility(state, facilityId);

  if (!result.upgraded) {
    setMessage(elements, result.reason === "locked" ? UI_TEXT.lockedFacilityLog : UI_TEXT.notEnoughLightsLog);
    return;
  }

  state = saveGame(closeMeguriSettlement(result.state));
  renderState(elements, state, activeTabId);
  setMessage(elements, createFacilityUpgradeMessage(FACILITIES[result.facilityId].name, formatAmount(result.cost)));
});

window.setInterval(() => {
  advanceToNow();
  renderLiveValues(elements, state);
}, 250);

window.setInterval(() => {
  if (isDebugReloading) {
    return;
  }

  advanceToNow();
  state = saveGame(state);
  renderState(elements, state, activeTabId);
}, SAVE_INTERVAL_MS);

window.addEventListener("beforeunload", () => {
  if (isDebugReloading) {
    return;
  }

  advanceToNow();
  state = saveGame(state);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isSettingsOpen) {
    closeSettings();
  }
});
