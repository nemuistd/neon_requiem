import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { RecordDefinition } from "./types.js";

export const RECORD_CONTENT_VERSION = 1;

export const RECORD_DEFINITIONS = defineContent([
  {
    id: "alleyStageRestorationMemo",
    title: "路地裏ステージの復興",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "仮設ステージの電源系統を確認。古いネオン管はまだ不安定だが、灯里の声に呼応して、周囲をより強く照らすように感じる瞬間がある。まるで、人の注目や熱に応えているかのようだ。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: []
  },
  {
    id: "firstAudienceNote",
    title: "最初の客席メモ",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "路地裏ステージの前に、古い折りたたみ椅子を三脚だけ並べた。まだ客席と呼ぶには小さいが、灯里はそこへ向けて丁寧に歌った。誰かが座れる場所があるだけで、通りの空気が少し温かくなる。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "alleyStage",
        level: 2
      }
    ]
  },
  {
    id: "lightResponseObservation",
    title: "観測記録・灯り反応",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "路地裏ステージの盛り上がりに合わせて、周辺の灯りが明確に増加していると人々が噂している。観客の数は少ないが、同じ名前を繰り返し呼ぶ声が人々に強くこの場所を印象付けるのだろうか。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "alleyStage",
        level: 5
      }
    ]
  },
  {
    id: "posterNameMemo",
    title: "告知ポスターの貼り替え",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "手書きの告知ポスターを貼り替えた。遠くから見かけただけでも、名前と時間だけは読み取れるように太く大きい字で書いてある。それを声に出して読む人を見かけた。路地裏ステージへの道を間違える人が少し減った。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "song.purchased",
        songId: "rojiuraIntro"
      }
    ]
  },
  {
    id: "neonBoardNoticeLog",
    title: "ネオン掲示板・点灯確認",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "ネオン色の掲示板の一部が点灯した。表示できる文字数はまだ少ないが、ライブ予定とアイドルの名前を出すには十分だ。次の公演の情報を確認するために、立ち止まる人が増えている。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "neonBoard",
        level: 1
      }
    ]
  },
  {
    id: "recordedGreetingEcho",
    title: "短い挨拶の反響",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "録音済みの短い挨拶を流している間、無人の通路でも足音が遠ざかりにくくなった。誰もいないはずの時間に、誰かが返事をしたような反響があったと噂が立っている。故障なのか、聞き間違いなのかは分からない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "neonBoard",
        level: 3
      }
    ]
  },
  {
    id: "undergroundChapelRestorationReport",
    title: "地下礼拝堂復旧報告",
    category: "復旧報告",
    revealLevel: "uncanny",
    body:
      "ネオン掲示板に名前と告知を残し続けたことで、人通りの少ない奥の区画まで道筋が戻った。閉ざされていた地下礼拝堂には、『祈る場所としてではなく、失われた響きを保管する区画として残されていた』という置手紙がある。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "neonBoard",
        level: 10
      }
    ]
  },
  {
    id: "chapelStorageSlip",
    title: "礼拝堂保管棚の札",
    category: "復旧報告",
    revealLevel: "uncanny",
    body:
      "地下礼拝堂の奥に、音源や譜面を入れていたらしい保管棚が残っていた。棚札の文字はほとんど消えているが、番号だけは不自然なほど鮮明に読める。空の棚を開けると、しばらく誰かの練習前の息づかいのような音が残った。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 1
      }
    ]
  },
  {
    id: "observerCountFragment",
    title: "観測者数メモ断片",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "古い端末に、観測者数という項目だけが残っていた。数値は欠けているが、特定名称の発言数、特定の場所へ戻る人数、歌を覚えている人数が並べて記録されている。意味はまだ断定できない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 2
      }
    ]
  },
  {
    id: "songAndHymnDistinction",
    title: "歌の扱いに関する断片",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "歌を媒介にすることで、安全に人々の注意を集め、灯し手と区画を安定させることが出来るのではないか。アイドルの歌唱は聖歌隊のそれとは異なる。公演は儀式とはならず、歌は聖歌にはならないだろう。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "song.purchased",
        songId: "chapelHarmony"
      }
    ]
  },
  {
    id: "mistAndAnchorFacilityLog",
    title: "施設ログ・霞とアンカー",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "協会に残されたログによると、灯し手はアンカー個体と呼ばれていたらしい。観測者数、認知固定率、霞曝露耐性。どの語も親しみやすさはないが、指しているものは近しい。より多く名前を呼ばれる者が、霞に沈みかけた場所をより強くつなぎ止める。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 3
      }
    ]
  }
] as const satisfies readonly RecordDefinition[]);

export type RecordId = ContentId<typeof RECORD_DEFINITIONS>;

export const RECORDS: Record<RecordId, RecordDefinition> = toContentMap(RECORD_DEFINITIONS);

export const RECORD_ORDER: RecordId[] = toContentOrder(RECORD_DEFINITIONS);
