import "./style.css";
import { createOfflineRewardMessage, createStageUpgradeMessage, UI_TEXT } from "./data";
import { applyProduction, gainManualApplause, GameState, upgradeAlleyStage } from "./game";
import { loadGame, saveGame } from "./storage";
import { formatAmount, renderState, setMessage, setupUi } from "./ui";

const SAVE_INTERVAL_MS = 5000;

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Missing app root.");
}

const elements = setupUi(root);
const loadResult = loadGame();
let state: GameState = loadResult.state;
let lastTickAt = Date.now();

function advanceToNow(): void {
  const now = Date.now();
  const elapsedSeconds = (now - lastTickAt) / 1000;
  lastTickAt = now;

  state = applyProduction(state, elapsedSeconds);
}

renderState(elements, state);

if (loadResult.offlineApplause > 0) {
  setMessage(elements, createOfflineRewardMessage(formatAmount(loadResult.offlineApplause)));
}

elements.liveButton.addEventListener("click", () => {
  advanceToNow();
  state = gainManualApplause(state);
  state = saveGame(state);
  renderState(elements, state);
  setMessage(elements, UI_TEXT.liveSuccessLog);
});

elements.upgradeStageButton.addEventListener("click", () => {
  advanceToNow();
  const result = upgradeAlleyStage(state);

  if (!result.upgraded) {
    setMessage(elements, UI_TEXT.notEnoughApplauseLog);
    return;
  }

  state = saveGame(result.state);
  renderState(elements, state);
  setMessage(elements, createStageUpgradeMessage(formatAmount(result.cost)));
});

window.setInterval(() => {
  advanceToNow();
  renderState(elements, state);
}, 250);

window.setInterval(() => {
  advanceToNow();
  state = saveGame(state);
  renderState(elements, state);
  setMessage(elements, UI_TEXT.autoSavedLog);
}, SAVE_INTERVAL_MS);

window.addEventListener("beforeunload", () => {
  advanceToNow();
  state = saveGame(state);
});
