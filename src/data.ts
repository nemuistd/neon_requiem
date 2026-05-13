export const GAME_TITLE = "NEON REQUIEM";

export const UI_TEXT = {
  heroEyebrow: "地下第七層・仮設礼拝ステージ",
  subtitle: "灯里の歌で静寂を押し返し、忘れられた路地に灯りを戻す。",
  compactSubtitle: "地下都市復興ライブ",
  resourcePanelLabel: "現在の資源",
  perSecondLabel: "毎秒",
  liveSectionLabel: "ライブ",
  liveButton: "ライブする",
  settingsButtonLabel: "設定",
  messageLabel: "最新メッセージ",
  activeIdolLabel: "注目アイドル",
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
  productionLabel: "生産量",
  unlockRequirementLabel: "解放条件",
  initialLog: "薄いネオンが点滅している。オートセーブ準備完了。",
  liveSuccessLog: "灯里の歌に、小さな灯りが返ってきました。",
  notEnoughLightsLog: "灯りがまだ足りません。",
  lockedFacilityLog: "まだこの施設は解放されていません。",
  purchasedSongLabel: "取得済み",
  unlockedSongLabel: "解放済み",
  lockedSongLabel: "未開放",
  songEffectLabel: "効果",
  songPriceLabel: "価格",
  purchaseSongButtonLabel: "歌を取得",
  lockedSongLog: "まだこの歌は解放されていません。",
  alreadyPurchasedSongLog: "この歌は取得済みです。",
  recordReadLog: "記録を確認しました。",
  autoSavedLog: "オートセーブしました。"
} as const;

export const RESOURCE_LABELS = {
  lights: "灯り"
} as const;

export function createOfflineRewardMessage(idolName: string, lights: string): string {
  return `${getGivenName(idolName)}が${lights}灯りを集めました。`;
}

export function createFacilityUpgradeMessage(facilityName: string, cost: string): string {
  return `${facilityName}を強化しました。-${cost} 灯り`;
}

export function createSongPurchaseMessage(songName: string, cost: string): string {
  return `${songName}を取得しました。-${cost} 灯り`;
}

function getGivenName(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);

  return nameParts[nameParts.length - 1] || fullName;
}
