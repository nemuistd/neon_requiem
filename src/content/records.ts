import { RecordDefinition, RecordId } from "./types.js";

export const RECORDS: Record<RecordId, RecordDefinition> = {
  alleyStageRestorationMemo: {
    id: "alleyStageRestorationMemo",
    title: "路地裏ステージ復旧メモ",
    category: "復旧報告",
    body:
      "仮設ステージの電源系統を確認。古いネオン管はまだ不安定だが、灯里の声に合わせて点灯する瞬間がある。単なる演出ではなく、人の注意が集まった場所ほど灯りが戻りやすい。",
    unlockRequirements: []
  },
  lightResponseObservation: {
    id: "lightResponseObservation",
    title: "観測記録・灯り反応",
    category: "観測記録",
    body:
      "路地裏ステージ Lv 5 到達後、周辺の灯り反応が明確に増加。観客数は少ないが、同じ名前を繰り返し呼ぶ声が区画の輪郭を補強している可能性がある。",
    unlockRequirements: [
      {
        facilityId: "alleyStage",
        level: 5
      }
    ]
  },
  undergroundChapelRestorationReport: {
    id: "undergroundChapelRestorationReport",
    title: "地下礼拝堂復旧報告",
    category: "復旧報告",
    body:
      "路地裏の歌が十分に届いたことで、閉ざされていた地下礼拝堂の扉が開いた。礼拝堂は祈る場所としてではなく、失われた響きを保管する区画として再利用できる。",
    unlockRequirements: [
      {
        facilityId: "alleyStage",
        level: 10
      }
    ]
  },
  songAndHymnDistinction: {
    id: "songAndHymnDistinction",
    title: "歌と聖歌の区別について",
    category: "断片記憶",
    body:
      "歌は人々の注意を安全に集め、灯し手と区画を安定させる。聖歌は違う。聖歌は集めた祈念を霞へ直接届けてしまう危険な形式だ。公演は儀式ではない。歌は、聖歌ではない。",
    unlockRequirements: [
      {
        type: "songPurchased",
        songId: "rojiuraIntro"
      }
    ]
  },
  mistAndAnchorFacilityLog: {
    id: "mistAndAnchorFacilityLog",
    title: "施設ログ・霞とアンカー",
    category: "施設ログ",
    body:
      "旧施設ログには、灯し手をアンカー個体と呼ぶ記録が残っている。観測者数、認知固定率、霞曝露耐性。どの語も冷たいが、指しているものは同じだ。名前を呼ばれる者は、霞に沈みかけた場所をつなぎ止める。",
    unlockRequirements: [
      {
        facilityId: "undergroundChapel",
        level: 5
      }
    ]
  }
};

export const RECORD_ORDER: RecordId[] = [
  "alleyStageRestorationMemo",
  "lightResponseObservation",
  "undergroundChapelRestorationReport",
  "songAndHymnDistinction",
  "mistAndAnchorFacilityLog"
];
