import { UI_TEXT } from "../data";
import {
  GameState,
  resolveActiveIdolId
} from "../game";
import { renderLiveValues } from "./liveValues";
import { renderFacilityCards } from "./renderFacilities";
import { renderIdolCards, renderIdolDetailModal, renderIdolTabCards } from "./renderIdols";
import { renderItemCards } from "./renderItems";
import { renderMeguriPanel } from "./renderMeguri";
import { renderRecordCards } from "./renderRecords";
import { renderSongCards } from "./renderSongs";
import { renderTabs } from "./renderTabs";
import type { ActiveTabId, UiElements } from "./types";
import type { IdolId } from "../definitions";

export type UiRenderOptions = {
  openIdolDetailId?: IdolId | null;
  preserveContentScroll?: boolean;
};

export function renderState(elements: UiElements, state: GameState, activeTabId: ActiveTabId, options: UiRenderOptions = {}): void {
  const resolvedActiveIdolId = resolveActiveIdolId(state);
  const effectiveActiveTabId = state.meguri.pendingSettlement ? "meguri" : activeTabId;
  const nextContentListClassName = getContentListClassName(effectiveActiveTabId);
  const previousContentScrollTop = elements.contentList.scrollTop;
  const previousWindowScrollY = window.scrollY;

  elements.root.classList.toggle("settlement-active", state.meguri.pendingSettlement);
  renderTabs(elements, state, effectiveActiveTabId);
  renderLiveValues(elements, state);
  elements.idolList.innerHTML = renderIdolCards(state, resolvedActiveIdolId);
  elements.contentList.className = nextContentListClassName;
  elements.contentList.innerHTML = renderActiveTabContent(state, effectiveActiveTabId);
  elements.root.querySelector(".idol-detail-modal")?.remove();

  if (options.openIdolDetailId) {
    elements.root.insertAdjacentHTML("beforeend", renderIdolDetailModal(state, options.openIdolDetailId));
  }

  if (options.preserveContentScroll === true) {
    elements.contentList.scrollTop = previousContentScrollTop;
    window.scrollTo(window.scrollX, previousWindowScrollY);
  }
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
