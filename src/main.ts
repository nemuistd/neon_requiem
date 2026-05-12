import "./style.css";
import { createFacilityUpgradeMessage, createOfflineRewardMessage, createSongPurchaseMessage, UI_TEXT } from "./data";
import { FACILITIES, IdolId, IDOLS, SONGS } from "./definitions";
import { applyProduction, gainManualLights, GameState, isRequirementMet, purchaseSong, readRecord, upgradeFacility } from "./game";
import { loadGame, saveGame, SAVE_KEY } from "./storage";
import {
  ActiveTabId,
  formatAmount,
  getFacilityIdFromEvent,
  getIdolIdFromEvent,
  getRecordIdFromEvent,
  getSongIdFromEvent,
  getTabIdFromEvent,
  renderLiveValues,
  renderState,
  setMessage,
  setupUi
} from "./ui";

const SAVE_INTERVAL_MS = 5000;

declare global {
  interface Window {
    __NEON_DEBUG__: {
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
let activeIdolId: IdolId = "otowaAkari";
let activeTabId: ActiveTabId = "restoration";
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

window.__NEON_DEBUG__ = {
  resetSave: () => {
    window.localStorage.removeItem(SAVE_KEY);
    reloadWithSaveSuppressed();
  },
  setSaveForTest: (save: unknown) => {
    const serializedSave = typeof save === "string" ? save : JSON.stringify(save);
    window.localStorage.setItem(SAVE_KEY, serializedSave);
    reloadWithSaveSuppressed();
  }
};

activeIdolId = renderState(elements, state, activeIdolId, activeTabId);

if (loadResult.offlineLights > 0) {
  setMessage(elements, createOfflineRewardMessage(formatAmount(loadResult.offlineLights)));
}

elements.liveButton.addEventListener("click", () => {
  advanceToNow();
  state = gainManualLights(state);
  state = saveGame(state);
  activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
  setMessage(elements, UI_TEXT.liveSuccessLog);
});

elements.root.addEventListener("click", (event) => {
  const tabId = getTabIdFromEvent(event);

  if (tabId) {
    activeTabId = tabId;
    activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
    return;
  }

  const idolId = getIdolIdFromEvent(event);

  if (idolId) {
    if (!isRequirementMet(state, IDOLS[idolId].unlockRequirement)) {
      return;
    }

    activeIdolId = idolId;
    activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
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

    state = saveGame(result.state);
    activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
    setMessage(elements, createSongPurchaseMessage(SONGS[result.songId].name, formatAmount(result.cost)));
    return;
  }

  const recordId = getRecordIdFromEvent(event);

  if (recordId) {
    advanceToNow();
    state = saveGame(readRecord(state, recordId));
    activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
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

  state = saveGame(result.state);
  activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
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
  activeIdolId = renderState(elements, state, activeIdolId, activeTabId);
}, SAVE_INTERVAL_MS);

window.addEventListener("beforeunload", () => {
  if (isDebugReloading) {
    return;
  }

  advanceToNow();
  state = saveGame(state);
});
