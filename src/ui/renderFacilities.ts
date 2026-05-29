import {
  FACILITIES,
  FACILITY_ORDER,
  FacilityId
} from "../definitions";
import { UI_TEXT } from "../data";
import {
  canSpendResource,
  GameState,
  getFacilityLevel,
  getFacilityTomorusaPerSecond,
  getFacilityUpgradeCost,
  isFacilityUnlocked,
  TOMORUSA_RESOURCE_ID
} from "../game";
import { formatAmount, formatDetailedAmount, formatDetailedRate, formatRate } from "./format";
import { renderNumberDetail } from "./numberDetail";
import { shouldRenderFacilityCard } from "./contentVisibility";
import {
  getFacilityProgressStatus,
  renderProgressStatusCard
} from "./progressStatus";
import { getUnlockRequirementText } from "./requirementText";

export function renderFacilityCards(state: GameState): string {
  const facilityCards = FACILITY_ORDER
    .filter((facilityId) => shouldRenderFacilityCard(state, facilityId))
    .map((facilityId) => renderFacilityCard(state, facilityId))
    .join("");

  return `${facilityCards}${renderProgressStatusCard(getFacilityProgressStatus(state))}`;
}

function renderFacilityCard(state: GameState, facilityId: FacilityId): string {
  const facility = FACILITIES[facilityId];
  const isUnlocked = isFacilityUnlocked(state, facilityId);

  if (!isUnlocked) {
    return `
      <article class="card stage-card locked-card">
        <h2 class="facility-title">${UI_TEXT.unknownFacilityLabel}</h2>
        <div class="facility-card-main">
          ${renderFacilityVisual()}
          <div class="facility-card-body">
            <p>${UI_TEXT.unknownFacilityDescription}</p>
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
        ${renderFacilityVisual(facility.imageUrl, facility.imagePosition, facilityId)}
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

function renderFacilityVisual(imageUrl?: string, imagePosition = "center", facilityId?: FacilityId): string {
  const facilityClass = facilityId ? ` facility-visual-${facilityId}` : "";

  if (!imageUrl) {
    return `<div class="facility-visual${facilityClass}" aria-hidden="true"></div>`;
  }

  return `
    <div class="facility-visual facility-visual-image${facilityClass}" aria-hidden="true">
      <img src="${imageUrl}" alt="" style="object-position: ${imagePosition};" />
    </div>
  `;
}

function renderFacilityStats(state: GameState, facilityId: FacilityId, upgradeCost: number): string {
  const production = getFacilityTomorusaPerSecond(state, facilityId);

  return `
    <div>
      <dt>価格</dt>
      <dd data-facility-cost="${facilityId}">${renderNumberDetail(`${formatAmount(upgradeCost)} 灯るさ`, `${formatDetailedAmount(upgradeCost)} 灯るさ`)}</dd>
    </div>
    <div>
      <dt>生産</dt>
      <dd data-facility-production="${facilityId}">${renderNumberDetail(`${formatRate(production)} 灯るさ / 秒`, `${formatDetailedRate(production)} 灯るさ / 秒`)}</dd>
    </div>
  `;
}
