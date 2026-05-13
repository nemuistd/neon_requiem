import {
  RECORD_ORDER,
  RECORDS,
  RecordId
} from "../definitions";
import { UI_TEXT } from "../data";
import {
  GameState,
  isRecordRead,
  isRecordUnlocked
} from "../game";
import { getUnlockRequirementTextFromRequirement } from "./requirementText";

export function renderRecordCards(state: GameState): string {
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
