import { UI_TEXT } from "../data";
import {
  GameState,
  resolveActiveIdolId
} from "../game";
import { renderLiveValues } from "./liveValues";
import { renderFacilityCards } from "./renderFacilities";
import { renderIdolCards, renderIdolTabCards } from "./renderIdols";
import { renderItemCards } from "./renderItems";
import { renderMeguriPanel } from "./renderMeguri";
import { renderRecordCards } from "./renderRecords";
import { renderSongCards } from "./renderSongs";
import { renderTabs } from "./renderTabs";
import type { ActiveTabId, UiElements } from "./types";

export function renderState(elements: UiElements, state: GameState, activeTabId: ActiveTabId): void {
  const resolvedActiveIdolId = resolveActiveIdolId(state);

  renderTabs(elements, state, activeTabId);
  renderLiveValues(elements, state);
  elements.idolList.innerHTML = renderIdolCards(state, resolvedActiveIdolId);
  elements.contentList.className = getContentListClassName(activeTabId);
  elements.contentList.innerHTML = renderActiveTabContent(state, activeTabId);
}

export function setMessage(elements: UiElements, message: string): void {
  const label = document.createElement("span");
  label.textContent = `${UI_TEXT.messageLabel}:`;
  elements.messageLog.replaceChildren(label, ` ${message}`);
}

export function getContentListClassName(activeTabId: ActiveTabId): string {
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

  if (activeTabId === "meguri") {
    return "meguri-list";
  }

  return "facility-grid";
}

export function renderActiveTabContent(state: GameState, activeTabId: ActiveTabId): string {
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

  if (activeTabId === "meguri") {
    return renderMeguriPanel(state);
  }

  return renderFacilityCards(state);
}
