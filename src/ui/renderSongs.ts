import {
  SONG_ORDER,
  SONGS,
  SongId
} from "../definitions";
import { UI_TEXT } from "../data";
import {
  canSpendResource,
  GameState,
  getSongCost,
  isSongPurchased,
  isSongUnlocked,
  TOMORUSA_RESOURCE_ID
} from "../game";
import { isRelatedProgressVisible } from "./contentVisibility";
import { formatAmount } from "./format";
import {
  getSongProgressStatus,
  renderProgressStatusCard
} from "./progressStatus";
import { getUnlockRequirementTextFromRequirement } from "./requirementText";

export function renderSongCards(state: GameState): string {
  const songCards = SONG_ORDER
    .filter((songId) => isRelatedProgressVisible(state, SONGS[songId].unlockRequirement))
    .map((songId) => renderSongCard(state, songId))
    .join("");

  return `${songCards}${renderProgressStatusCard(getSongProgressStatus(state))}`;
}

function renderSongCard(state: GameState, songId: SongId): string {
  const song = SONGS[songId];
  const isUnlocked = isSongUnlocked(state, songId);
  const isPurchased = isSongPurchased(state, songId);
  const cost = getSongCost(state, songId);
  const canPurchase = isUnlocked && !isPurchased && canSpendResource(state, TOMORUSA_RESOURCE_ID, cost);
  const songStateLabel = isPurchased
    ? UI_TEXT.purchasedSongLabel
    : isUnlocked
      ? UI_TEXT.unlockedSongLabel
      : UI_TEXT.lockedSongLabel;

  if (!isUnlocked) {
    return `
      <article class="card song-card locked-card">
        <div class="song-card-heading">
          <span class="card-kicker">${songStateLabel}</span>
          <span class="song-state locked">${songStateLabel}</span>
        </div>
        <h2>${UI_TEXT.unknownSongLabel}</h2>
        <p>${UI_TEXT.unknownContentDescription}</p>
        <dl class="stats-list">
          <div>
            <dt>${UI_TEXT.unlockRequirementLabel}</dt>
            <dd>${getUnlockRequirementTextFromRequirement(song.unlockRequirement)}</dd>
          </div>
        </dl>
        <button
          class="secondary-action song-action locked"
          type="button"
          data-song-id="${songId}"
          disabled
        >
          ${UI_TEXT.lockedSongLabel}
        </button>
      </article>
    `;
  }

  return `
    <article class="card song-card ${isUnlocked ? "unlocked-card" : "locked-card"} ${isPurchased ? "purchased-card" : ""}">
      <div class="song-card-heading">
        <span class="card-kicker">${songStateLabel}</span>
        <span class="song-state ${isPurchased ? "purchased" : isUnlocked ? "unlocked" : "locked"}">${songStateLabel}</span>
      </div>
      <h2>${song.name}</h2>
      <p>${song.description}</p>
      <dl class="stats-list">
        <div>
          <dt>${UI_TEXT.songEffectLabel}</dt>
          <dd>${song.effectDescription}</dd>
        </div>
        <div>
          <dt>${UI_TEXT.songPriceLabel}</dt>
          <dd data-song-cost="${songId}">${formatAmount(cost)} 灯るさ</dd>
        </div>
        <div>
          <dt>${UI_TEXT.unlockRequirementLabel}</dt>
          <dd>${getUnlockRequirementTextFromRequirement(song.unlockRequirement)}</dd>
        </div>
      </dl>
      <button
        class="secondary-action song-action ${isPurchased ? "purchased" : isUnlocked ? "unlocked" : "locked"}"
        type="button"
        data-song-id="${songId}"
        ${canPurchase ? "" : "disabled"}
      >
        ${isPurchased ? UI_TEXT.purchasedSongLabel : UI_TEXT.purchaseSongButtonLabel}
      </button>
    </article>
  `;
}
