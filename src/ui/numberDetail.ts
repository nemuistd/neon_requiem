export function renderNumberDetail(displayText: string, detailText: string): string {
  const escapedDisplayText = escapeHtml(displayText);
  const escapedDetailText = escapeHtml(detailText);

  return `<button class="number-detail" type="button" tabindex="0" aria-label="${escapedDisplayText}。詳細: ${escapedDetailText}">${escapedDisplayText}<span class="number-detail-popover" aria-hidden="true">${escapedDetailText}</span></button>`;
}

export function setNumberDetail(element: HTMLElement, displayText: string, detailText: string): void {
  const detailElement = element.querySelector<HTMLElement>(":scope > .number-detail");
  const popoverElement = detailElement?.querySelector<HTMLElement>(":scope > .number-detail-popover");

  if (!detailElement || !popoverElement || !detailElement.firstChild || detailElement.firstChild.nodeType !== Node.TEXT_NODE) {
    element.innerHTML = renderNumberDetail(displayText, detailText);
    return;
  }

  detailElement.firstChild.textContent = displayText;
  detailElement.setAttribute("aria-label", `${displayText}。詳細: ${detailText}`);
  popoverElement.textContent = detailText;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
