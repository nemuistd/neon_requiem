export const GAME_TITLE = "NEON REQUIEM";

export const UI_TEXT = {
  heroEyebrow: "地下第七層・仮設礼拝ステージ",
  subtitle: "灯里の歌で静寂を押し返し、忘れられた路地に灯るさを戻す。",
  compactSubtitle: "地下都市復興ライブ",
  resourcePanelLabel: "現在の資源",
  perSecondLabel: "毎秒",
  liveSectionLabel: "ライブ",
  liveButton: "ライブする",
  settingsButtonLabel: "設定",
  messageLabel: "最新メッセージ",
  activeIdolLabel: "注目アイドル",
  bondLabel: "交流",
  passiveEffectLabel: "パッシブ効果",
  noActiveEffectLabel: "効果なし",
  baseProductionLabel: "基礎生産",
  productionMultiplierLabel: "生産倍率",
  detailButtonLabel: "詳細を見る",
  focusIdolButtonLabel: "注目にする",
  focusedIdolLabel: "注目中",
  idolRosterLabel: "アイドル切替",
  lockedIdolLabel: "未解放",
  idolUnlockRequirementLabel: "解放条件",
  restorationTabLabel: "復興区画",
  songTabLabel: "歌",
  itemTabLabel: "アイテム",
  idolTabLabel: "アイドル",
  recordTabLabel: "記録",
  recordCategoryLabel: "種別",
  unreadRecordLabel: "未読",
  readRecordLabel: "既読",
  lockedRecordLabel: "未解放の記録",
  readRecordButtonLabel: "読む",
  versionLabel: "バージョン",
  closeButtonLabel: "閉じる",
  resetSaveButtonLabel: "セーブデータを削除",
  idolSectionLabel: "アイドル",
  facilitySectionLabel: "施設",
  initialIdolLabel: "初期アイドル",
  unlockedIdolLabel: "解放アイドル",
  initialFacilityLabel: "初期施設",
  unlockedFacilityLabel: "解放施設",
  lockedFacilityLabel: "未解放施設",
  levelLabel: "Lv",
  upgradeCostLabel: "強化コスト",
  productionLabel: "総生産",
  unlockRequirementLabel: "解放条件",
  initialLog: "薄暗い路地裏ステージが、もう一度人を迎える準備を始めた。オートセーブ準備完了。",
  liveSuccessLog: "灯里の歌に応えて、路地に小さな灯るさが戻りました。",
  notEnoughLightsLog: "灯るさがまだ足りません。ライブで街の安定を少しずつ戻しましょう。",
  lockedFacilityLog: "この区画はまだ復興に着手できません。",
  purchasedSongLabel: "取得済み",
  unlockedSongLabel: "解放済み",
  lockedSongLabel: "未開放",
  songEffectLabel: "効果",
  songPriceLabel: "価格",
  purchaseSongButtonLabel: "歌を取得",
  lockedSongLog: "まだこの歌は解放されていません。",
  alreadyPurchasedSongLog: "この歌は取得済みです。",
  purchasedItemLabel: "購入済み",
  unlockedItemLabel: "購入可能",
  lockedItemLabel: "未解放",
  itemEffectLabel: "効果",
  itemPriceLabel: "価格",
  purchaseItemButtonLabel: "購入",
  lockedItemLog: "まだこのアイテムは解放されていません。",
  alreadyPurchasedItemLog: "このアイテムは購入済みです。",
  recordReadLog: "記録を確認しました。",
  autoSavedLog: "オートセーブしました。"
} as const;

export const RESOURCE_LABELS = {
  tomorusa: "灯るさ"
} as const;

export function createOfflineRewardMessage(idolName: string, tomorusa: string): string {
  return `${getGivenName(idolName)}が不在の間も歌をつなぎ、${tomorusa}灯るさ分の明かりを守りました。`;
}

export function createFacilityUpgradeMessage(facilityName: string, cost: string): string {
  return `${facilityName}を少し復旧しました。街の輪郭が強まります。-${cost} 灯るさ`;
}

export function createSongPurchaseMessage(songName: string, cost: string): string {
  return `${songName}をステージの演目に加えました。-${cost} 灯るさ`;
}

export function createItemPurchaseMessage(itemName: string, cost: string): string {
  return `${itemName}を復興用の備品に加えました。-${cost} 灯るさ`;
}

function getGivenName(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);

  return nameParts[nameParts.length - 1] || fullName;
}
