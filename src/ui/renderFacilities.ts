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
import { formatAmount, formatRate } from "./format";
import { getUnlockRequirementText } from "./requirementText";

export function renderFacilityCards(state: GameState): string {
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
