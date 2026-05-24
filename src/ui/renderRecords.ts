import {
  RECORD_ORDER,
  RECORDS,
  RecordId
} from "../definitions";
import { UI_TEXT } from "../data";
import {
  GameState,
  hasUnreadRecordContent,
  isRecordAnnotationRead,
  isRecordAnnotationUnlocked,
  isRecordRead,
  isRecordUnlocked
} from "../game";

export function renderRecordCards(state: GameState): string {
  return RECORD_ORDER
    .filter((recordId) => isRecordUnlocked(state, recordId))
    .map((recordId) => renderRecordCard(state, recordId))
    .join("");
}

function renderRecordCard(state: GameState, recordId: RecordId): string {
  const record = RECORDS[recordId];
  const isRead = isRecordRead(state, recordId);
  const isAnnotationUnlocked = isRecordAnnotationUnlocked(state, recordId);
  const isAnnotationRead = isRecordAnnotationRead(state, recordId);
  const hasUnread = hasUnreadRecordContent(state, recordId);
  const stateLabel = hasUnread
    ? isRead
      ? UI_TEXT.unreadRecordAnnotationLabel
      : UI_TEXT.unreadRecordLabel
    : UI_TEXT.readRecordLabel;
  const stateClassName = hasUnread ? "unread" : "read";

  return `
    <article class="card record-card ${hasUnread ? "unread-record-card" : "read-record-card"}">
      <div class="record-card-heading">
        <span class="card-kicker">${record.category}</span>
        <span class="record-state ${stateClassName}">${stateLabel}</span>
      </div>
      <h2>${record.title}</h2>
      <p>${record.body}</p>
      ${isAnnotationUnlocked
        ? `
      <aside class="record-annotation ${isAnnotationRead ? "read" : "unread"}">
        <span>${UI_TEXT.recordAnnotationLabel}</span>
        <p>${record.bodyAnnotation}</p>
      </aside>`
        : ""}
      <button
        class="secondary-action"
        type="button"
        data-record-id="${recordId}"
        ${hasUnread ? "" : "disabled"}
      >
        ${hasUnread ? UI_TEXT.readRecordButtonLabel : UI_TEXT.readRecordLabel}
      </button>
    </article>
  `;
}
