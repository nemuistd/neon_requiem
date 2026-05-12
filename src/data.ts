export const GAME_TITLE = "NEON REQUIEM";

export const UI_TEXT = {
  heroEyebrow: "地下第七層・仮設礼拝ステージ",
  subtitle: "灯里の歌で静寂を押し返し、忘れられた路地に拍手を灯す。",
  resourcePanelLabel: "現在の資源",
  perSecondLabel: "毎秒",
  liveSectionLabel: "ライブ",
  liveButton: "ライブする",
  initialIdolLabel: "初期アイドル",
  initialFacilityLabel: "初期施設",
  levelLabel: "Lv",
  upgradeCostLabel: "強化コスト",
  productionLabel: "生産量",
  upgradeStageButton: "路地裏ステージを強化",
  initialLog: "薄いネオンが点滅している。オートセーブ準備完了。",
  liveSuccessLog: "灯里の歌に、小さな拍手が返ってきました。",
  notEnoughApplauseLog: "拍手がまだ足りません。",
  autoSavedLog: "オートセーブしました。"
} as const;

export const RESOURCE_LABELS = {
  applause: "拍手"
} as const;

export const INITIAL_IDOL = {
  id: "otowa-akari",
  name: "音羽 灯里",
  reading: "おとは あかり",
  title: "路地裏の歌姫",
  description:
    "灯里は、明かりの消えた路地裏で歌い続けていた。聖歌のように澄んだ声が響くたび、ひび割れた街路に小さな光が戻っていく。"
} as const;

export const ALLEY_STAGE = {
  id: "alley-stage",
  name: "路地裏ステージ",
  description:
    "古いスピーカー、拾い集めたネオン管、小さな聖印で組まれた仮設ステージ。強化するほど、地下の静寂に届く音が増えていく。",
  baseCost: 10,
  costMultiplier: 1.15,
  productionPerLevel: 0.1
} as const;

export function createOfflineRewardMessage(applause: string): string {
  return `離れている間に、灯里が ${applause} 拍手を集めました。路地の灯りが少し強くなっています。`;
}

export function createStageUpgradeMessage(cost: string): string {
  return `路地裏ステージを強化しました。-${cost} 拍手`;
}
