import { RecordDefinition, RecordId } from "./types.js";

export const RECORD_CONTENT_VERSION = 1;

export const RECORDS: Record<RecordId, RecordDefinition> = {
  alleyStageRestorationMemo: {
    id: "alleyStageRestorationMemo",
    title: "路地裏ステージの復興",
    category: "復旧報告",
    body:
      "仮設ステージの電源系統を確認。古いネオン管はまだ不安定だが、灯里の声に呼応して、周囲をより強く照らすように感じる瞬間がある。まるで、人の注目や熱に応えているかのようだ。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: []
  },
  lightResponseObservation: {
    id: "lightResponseObservation",
    title: "観測記録・灯り反応",
    category: "観測記録",
    body:
      "路地裏ステージの盛り上がりに合わせて、周辺の灯りが明確に増加していると人々が噂している。観客の数は少ないが、同じ名前を繰り返し呼ぶ声が人々に強くこの場所を印象付けるのだろうか。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
      "路地裏の歌が十分に届いたことで、閉ざされていた地下礼拝堂の扉が開いた。礼拝堂に残された置手紙。『祈る場所としてではなく、失われた響きを保管する区画として残されていた』とある。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
      "歌を媒介にすることで、安全に人々の注意を集め、灯し手と区画を安定させることが出来るのではないか。アイドルの歌唱は聖歌隊のそれとは異なる。公演は儀式とはならず、歌は聖歌にはならないだろう。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
      "協会に残されたログには、灯し手のことをアンカー個体と呼んでいると見られる記録が確認できる。観測者数、認知固定率、霞曝露耐性。どの語も親しみやすさはないが、指しているものは近しい。より多く名前を呼ばれる者が、霞に沈みかけた場所をより強くつなぎ止める。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
