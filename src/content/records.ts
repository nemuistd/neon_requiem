import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { RecordDefinition } from "./types.js";

export const RECORD_CONTENT_VERSION = 18;
const PRE_CH7_RECORD_CONTENT_VERSION = 11;
const CH7_RECORD_CONTENT_VERSION = 12;
const CH8_RECORD_CONTENT_VERSION = 13;
const CH9_ENTRY_RECORD_CONTENT_VERSION = 14;
const CH9_REINFORCEMENT_RECORD_CONTENT_VERSION = 15;
const CH8_REINFORCEMENT_RECORD_CONTENT_VERSION = 16;
const CH7_REINFORCEMENT_RECORD_CONTENT_VERSION = 17;

export const RECORD_DEFINITIONS = defineContent([
  {
    id: "alleyStageRestorationMemo",
    title: "路地裏ステージの復興",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "仮設ステージの電源系統を確認。古いネオン管はまだ不安定だが、灯里の声に呼応して、周囲をより強く照らすように感じる瞬間がある。まるで、人の注目や熱に応えているかのようだ。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: []
  },
  {
    id: "firstAudienceNote",
    title: "最初の客席メモ",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "路地裏ステージの前に、古い折りたたみ椅子を三脚だけ並べた。まだ客席と呼ぶには小さいが、灯里はそこへ向けて丁寧に歌った。誰かが座れる場所があるだけで、通りの空気が少し温かくなる。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
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
    bodyAnnotation:
      "同じ反応が、別の日付の記録にも残っている。筆跡は違うが、観測の言い回しだけが妙に似ている。",
    annotationRequirement: {
      type: "meguri.buff.purchased",
      buffId: "footstepResonance"
    },
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "alleyStage",
        level: 5
      }
    ]
  },
  {
    id: "idolBondAkariFirstVoice",
    title: "灯里・最初の呼び声",
    category: "交流メモ",
    revealLevel: "surface",
    body:
      "ライブの後、灯里は客席から名前を呼ばれたことに少し遅れて気づいた。返事は小さかったが、片づけの間もその席の方を何度か見ていた。次の告知にも、自分の名前をきちんと書いてほしいと頼まれた。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "idol.bond",
        idolId: "otowaAkari",
        amount: 5
      }
    ]
  },
  {
    id: "idolBondAkariRegularSeat",
    title: "灯里・いつもの席",
    category: "交流メモ",
    revealLevel: "surface",
    body:
      "折りたたみ椅子のひとつに、誰が決めたわけでもない指定席ができた。灯里は曲の始まりにそこを一度見る。誰も座っていない日でも、そこへ向けて歌うと、路地裏ステージの空気が少し落ち着く。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "idol.bond",
        idolId: "otowaAkari",
        amount: 20
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
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
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
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "neonBoard",
        level: 1
      }
    ]
  },
  {
    id: "idolBondYuiGuideNote",
    title: "結・案内メモの端",
    category: "交流メモ",
    revealLevel: "uncanny",
    body:
      "結は、ネオン掲示板の横に小さな案内メモを足した。曲がり角の説明は妙に正確で、読んだ人は暗い通路でも迷いにくいという。本人は、前に誰かが教えてくれた気がするとだけ言っている。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "idol.bond",
        idolId: "asagiriYui",
        amount: 5
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
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "neonBoard",
        level: 3
      }
    ]
  },
  {
    id: "twilightPathGuideOpeningReport",
    title: "薄明通り案内所・開設報告",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "薄明通り案内所を開設した。ネオン掲示板から南西、分岐点の手前に小さな窓口を置く。確認のために一時間立っていると、そこで足を止めて周囲を見回す人が確かに多かった。案内所設置後、通過人数を計測できるようになる予定。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "twilightPathGuide",
        level: 1
      }
    ]
  },
  {
    id: "unreadableRouteMap",
    title: "路線図・読めない区画",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "古い路線図を確認した。現在の通路と照合すると、三か所の区画が記載されているが現状では確認できない。複数の住民への聞き込みでも、あそこには行けない、霞が濃くて近づけない、という回答が多い。路線図が正確だった時期はあったはずだ。",
    bodyAnnotation:
      "未確認区画のひとつは、廻の後に入口付近の古い案内板として輪郭だけ現れる。文字はまだ読めない。",
    annotationRequirement: {
      type: "meguri.buff.purchased",
      buffId: "leftWorkMemo"
    },
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "twilightPathGuide",
        level: 3
      }
    ]
  },
  {
    id: "mistDensityFixedPoint",
    title: "霞の濃淡・定点観測",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "薄明通り案内所から三か所の定点で霞の濃度を観察している。ライブ開催日には、路地裏ステージ周辺の霞が薄くなる。公演後一時間程度で元の濃度に戻るが、客が多かった日は回復が遅い。相関が偶然かどうかは判断しない。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "twilightPathGuide",
        level: 5
      }
    ]
  },
  {
    id: "tookoFirstBroadcast",
    title: "遠子・最初の放送",
    category: "交流メモ",
    revealLevel: "surface",
    body:
      "響木 遠子が最初の放送を行った。内容は路地裏ステージの公演告知、施設案内、遠子の挨拶で、約十五分。放送後に遠子は機材を点検していた。受信確認について訊くと、雑音が少し返ってきた、とだけ答えた。誰かが聞いていたかは分からない。でも続ける。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "temporaryBroadcastBooth",
        level: 3
      }
    ]
  },
  {
    id: "broadcastBoothNoiseLog",
    title: "配信ブース・雑音の記録",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "遠子が放送した後に返ってくる雑音について、継続観測を行っている。放送内容によって返ってくる雑音の量が異なる可能性がある。公演告知の後の雑音が多く、一般的な告知文の後は少ない。差異の原因は不明。遠子は、届く場所が内容によって変わるのかもしれない、と仮説を残した。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "temporaryBroadcastBooth",
        level: 3
      }
    ]
  },
  {
    id: "memoryLibraryOpeningReport",
    title: "記憶図書館・開架報告",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "記憶図書館の第一区画を開架した。保管文書は各種記録、施設ログ、地図、名前の登録台帳。管理担当の紙野 巡が初日に、著者不明の文書が全体の約三分の一を占めると報告した。名前がないと、どこにも置けない。でも捨てない。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "memoryLibrary",
        level: 1
      }
    ]
  },
  {
    id: "unidentifiedRecordBundle",
    title: "出所不明の記録",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "巡が整理中に出所不明の文書を一束まとめた。紙の劣化から相当古いが、字体は統一されていない。複数の人間が別々の時期に書いたもの、または一人の人間が長期間にわたって書いたものと思われる。巡は、どこにも置けないものを、どこかに置くための棚を作った、とだけ言った。",
    bodyAnnotation:
      "巡の追記。束の中に、バインダーの筆跡と似た文書が一冊だけある。著者不明として保管を続ける。",
    annotationRequirement: {
      type: "meguri.buff.purchased",
      buffId: "rememberedCallsign"
    },
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "memoryLibrary",
        level: 3
      }
    ]
  },
  {
    id: "oldBroadcastRoomEquipmentCheck",
    title: "古い放送室・機材確認",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "旧い放送室の機材を確認した。一部は動く。録音テープが数本残っていた。再生したところ、音声は入っているが内容が聞き取れない。劣化したのではなく、録音時から音質が低いように見える。別の可能性として、意図的に聞き取れないようにされた録音かもしれない。削除ではなく、劣化させる処理が施された可能性がある。機材は動くが、この録音の意図については分からないまま保管する。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "oldBroadcastRoom",
        level: 1
      }
    ]
  },
  {
    id: "undergroundPlazaFirstDay",
    title: "地下広場・初日",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "地下広場が稼働した。初日の記録では、陽向 小春が来た人間全員に声をかけ、三十分で二十七人の名前を覚えた。翌日、同じ人間が戻ってきた時に全員の名前を呼んだ。驚いた後、広場に留まる時間が長くなった。小春は、名前を呼ぶと帰る速度が遅くなる、と笑って言った。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundPlaza",
        level: 1
      }
    ]
  },
  {
    id: "koharuNameEffect",
    title: "小春・名前の効果",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "陽向 小春が名前を呼んだ時の観察記録。名前を呼んだ直後、その人物の輪郭が一瞬鮮明になる気がする。光の問題か、注目が集まるためか、別の何かか。小春に確認すると、そうかな、そんなことより今日は何人来た、と話題を変えた。以後、この件について小春には確認していない。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundPlaza",
        level: 4
      }
    ]
  },
  {
    id: "nameRecordWallOpeningLog",
    title: "名前の記録壁・設置報告",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "地下広場の奥に、来場者や公演名を書いた紙片を貼る壁を設けた。小春は名前を聞くたびに、本人に見える高さへ紙片を貼っている。自分の名前を見つけた人は、少し照れた後で次の公演予定も確認していく。広場を通り過ぎるだけだった人が、壁の前で立ち止まるようになった。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "nameRecordWall",
        level: 1
      }
    ]
  },
  {
    id: "wallNameStabilityLog",
    title: "壁面の名前と輪郭",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "名前の記録壁を貼り替えた日の観測。古い紙片を捨てず、書き写してから新しい場所へ移したところ、地下広場の奥の通路が少し見つけやすくなったという報告が複数あった。光量や案内の改善だけで説明できるかは分からない。現時点では、名前が見える状態を保つことに意味がある、という作業仮説に留める。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "nameRecordWall",
        level: 3
      }
    ]
  },
  {
    id: "nameFixationObservation",
    title: "観測記録・名称固定の効果",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "出所不明の文書より抜粋。観測者数が一定水準を超えると、対象区画の輪郭が安定する傾向がある。名称の付与がない場合、同等の観測者数では効果が低下する。仮説として、名称は認知固定の補助として機能すると記されている。この文書が誰によっていつ書かれたものかは不明。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "nameRecordWall",
        level: 2
      }
    ]
  },
  {
    id: "undergroundChapelRestorationReport",
    title: "地下礼拝堂復旧報告",
    category: "復旧報告",
    revealLevel: "uncanny",
    body:
      "名前の記録壁を整理している時、古い紙片の裏に地下礼拝堂への通路名が残っていた。広場の奥で同じ名前を何度か呼ぶと、霞の向こうに扉の輪郭が戻った。閉ざされていた地下礼拝堂には、『祈る場所としてではなく、失われた響きを保管する区画として残されていた』という置手紙がある。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 1
      }
    ]
  },
  {
    id: "idolBondShinoStorageShelf",
    title: "詩乃・保管棚の前",
    category: "交流メモ",
    revealLevel: "uncanny",
    body:
      "詩乃は地下礼拝堂の保管棚を開ける前に、必ず短く声をかける。返事はないが、棚札の番号が読みやすくなることがある。失われた歌の持ち主へ挨拶しているのだと、彼女は静かに説明した。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "idol.bond",
        idolId: "mizukiShino",
        amount: 5
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
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
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
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 2
      }
    ]
  },
  {
    id: "chapelSecondShelfInvestigation",
    title: "礼拝堂・第二保管棚の調査",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "詩乃が第二保管棚の内容を整理した。分類結果は、公演記録、復旧報告、名前の登録台帳。どれも通常の施設記録として扱える。例外として、表紙に何も書かれていない文書が一冊あった。内容は観測手順と思われるが、何を観測するものかは書かれていない。詩乃は、出所不明として保管すると記録した。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 2
      }
    ]
  },
  {
    id: "shinoDeletedRecordTrace",
    title: "詩乃・消えた記録の痕跡",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "保管棚の一部の文書に、削除の痕跡がある。詩乃は、朽ちたのではなく、削除された跡だけが残っている、と観察した。削除された内容の種類も、削除した者の意図も不明。詩乃は、消えた記録を復元することはできない。でも、消えたことは記録できる、とだけ言った。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 4
      }
    ]
  },
  {
    id: "songAndHymnDistinction",
    title: "歌の扱いに関する断片",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "施設ログ断片。公演は、儀式ではない。歌は、聖歌ではない。そう扱い続けることが、安全な運用の条件である。理由はここには書かない。知っている者は知っている。知らない者は、知らないままで構わない。知らないことが、安全を保つ。以上。前後の文脈は欠落している。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "facility.level",
            facilityId: "undergroundChapel",
            level: 5
          },
          {
            type: "song.purchased",
            songId: "chapelHarmony"
          }
        ]
      }
    ]
  },
  {
    id: "binderSealedLetterOpening",
    title: "バインダー封書・開封",
    category: "断片記憶",
    revealLevel: "uncanny",
    body:
      "バインダーの一番後ろに、封をされたままの書類が一枚あった。表書きには「地下礼拝堂の復旧が終わるまで開封しないこと」とある。礼拝堂がここまで戻った。封を切ってみた。文字のほとんどが、霞で白く潰れている。読めるのは書き出しの数文字だけだった。「これを、廻——」そこから先は読めない。封書を閉じた。読めない部分を、無理に読もうとはしなかった。霞がそれを覆っているのは、まだその時ではないからだという気がした。",
    bodyAnnotation:
      "廻を重ねるごとに、霞で白く潰れていた行がわずかに戻る。今読めるのは、次へ進むための手順の端だけだ。",
    annotationRequirement: {
      type: "meguri.buff.purchased",
      buffId: "fragmentIndex"
    },
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "facility.level",
            facilityId: "undergroundChapel",
            level: 8
          },
          {
            type: "song.purchased",
            songId: "chapelHarmony"
          }
        ]
      }
    ]
  },
  {
    id: "binderSealedLetterFirstLine",
    title: "バインダー封書・第一行",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "バインダーの封書を開けた。文字のほとんどはまだ霞で読めない。今読めるのは、「これを、廻と呼ぶことにした。理由は書いてなかった。以前の私も、書かなかったのだろう」という二行だけだった。封書の残りは、まだ読めない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "undergroundChapel",
            level: 9
          }
        ]
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
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundChapel",
        level: 3
      }
    ]
  },
  {
    id: "sakurakoRemovedPartsReport",
    title: "桜子・外されていた記録",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "継ノ端 桜子からの報告。地下通路の修復中に、接続部品が「壊れたのではなく外された」と思われる箇所を発見した。桜子の言葉は短かった。意図的に取り外した形跡がある。壊れた通路と違う。理由は分からない。誰が、いつ外したかも分からない。現状は部品欠損として修復した。桜子は、修理ではなく復元と記録する、と残した。",
    introducedAtVersion: PRE_CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundPassageRepair",
        level: 1
      }
    ]
  },
  {
    id: "deepDistrictBlueprintDiscrepancy",
    title: "深層区画・設計図との差異",
    category: "観測記録",
    revealLevel: "technical",
    body:
      "継ノ端 桜子からの報告。深層区画の修復中に、地上から入手した設計図との差異が三か所見つかった。追加で建設された痕跡があるが、設計図には記載がない。後から付け加えたというより、最初から計画に含まれていた可能性がある。設計図が不完全なのか、設計が変更されたのかは判断できない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "undergroundPassageRepair",
        level: 4
      }
    ]
  },
  {
    id: "postMeguriAlleySubtleChange",
    title: "廻後の路地裏・微細な変化",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "廻後の路地裏について。入口付近に霞が薄い箇所がある。一周目では確認できなかった古い案内板の名残が、側壁に輪郭だけ残っている。文字は読めない。灯里は同じ言葉で「来たんだね」と言ったが、返事までの間合いが少しだけ違った気がする。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "alleyStage",
            level: 1
          }
        ]
      }
    ]
  },
  {
    id: "secondMeguriRecord",
    title: "廻・二度目の記録",
    category: "断片記憶",
    revealLevel: "surface",
    body:
      "廻後の記録。施設は再び最初の状態から始まる。記録の既読状態は保たれている。バインダーには、別のインクで「覚えている。覚えているが、また始める必要があるから、始める」と書き添えられていた。誰が書いたかは明記されていない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "meguri.count",
        count: 2
      }
    ]
  },
  {
    id: "deepLayerObservatoryAnteroomReport",
    title: "深層観測所・前室報告",
    category: "観測記録",
    revealLevel: "technical",
    body:
      "深層観測所の前室に到達した。内部には長期間使われていなかった形跡がある一方で、電源系統は完全には死んでおらず、一部の計測機器は現在も動作する。最後に誰が使ったのかは不明。霞山 澪は、いつからここにいたのかを訊かれると、来た時期を覚えていないと答えた。",
    introducedAtVersion: CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 1
          }
        ]
      }
    ]
  },
  {
    id: "mioMistObservationLog",
    title: "澪・霞の観測記録",
    category: "観測記録",
    revealLevel: "technical",
    body:
      "深層観測所の前室に、霞山 澪の記録が残されている。「霞濃度：通常値より低い。原因として観測者数の増加が考えられる。ただし増加分と低下幅の相関は線形ではない。認知の質が数より重要な可能性がある」。その観測が誰に頼まれたものなのか、澪自身の意思によるものなのかは、まだ問わないことにした。",
    introducedAtVersion: CH7_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 2
          }
        ]
      }
    ]
  },
  {
    id: "coverlessObservationLogFragment",
    title: "表紙のない観測日誌・抜粋",
    category: "観測記録",
    revealLevel: "technical",
    body:
      "表紙のない日誌から、数行だけ読める箇所を写した。「一周目・三日目。静寂は保たれている。霞の濃度は変わらないが、観測対象の輪郭は昨日より安定している」。日付ではなく周回で数える理由は、まだ書かれていない。",
    introducedAtVersion: CH7_REINFORCEMENT_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 2
          }
        ]
      }
    ]
  },
  {
    id: "deepLayerSilenceMeasurement",
    title: "深層観測所・静寂測定",
    category: "観測記録",
    revealLevel: "technical",
    body:
      "深層観測所の測定ログ。音が少ない時間帯ほど、観測値の揺れが小さくなる。ただし観測回数を増やしすぎると、対象の反応そのものが変化するという注意書きがある。澪は、見続ければ分かるものと、見続けることで変わってしまうものは違う、とだけ言った。",
    introducedAtVersion: CH7_REINFORCEMENT_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 3
          }
        ]
      }
    ]
  },
  {
    id: "cognitiveFixationRateChangeLog",
    title: "施設ログ・認知固定率の変化",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "深層観測所保管の旧ログより。区画A-7の認知固定率は先月比でわずかに上昇している。主要因として観測者数の増加、副要因として対象区画に付与された名称の浸透が挙げられている。アンカー個体の配置については次回報告を参照、とだけ続くが、次回報告は見つかっていない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 3
          }
        ]
      }
    ]
  },
  {
    id: "observerThresholdFragment",
    title: "観測者数・閾値付近",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "旧ログの続きと思われる断片。観測者数が閾値を超えた場合、局所安定化が始まる。これは比喩ではない、と記されている。ただし閾値は固定ではなく、観測の質、名称の明確さ、アンカー個体の有無によって変化する。具体的な数値は残っていない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 4
          }
        ]
      }
    ]
  },
  {
    id: "protagonistFirstMemoryFragment",
    title: "主人公・最初の記憶の断片",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "夢の記録として書き残しておく。広い空間で、多くの声が名前を呼んでいた。その声は霞へ向かっていた。止めようとした気がする。止められたかどうかは分からない。夢として分類するのが正確かどうかも分からないが、他に分類する言葉がない。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "deepLayerObservatory",
            level: 5
          }
        ]
      }
    ]
  },
  {
    id: "prayerEngineeringRecordFragment",
    title: "祈念工学・記録断片",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "皐月が翻訳した断片の要約。祈念工学とは、人々の願い、祈り、期待、注目を束ね、現実を望ましい形へ固定または改変しようとした技術体系である、と記されている。制御は完全ではなく、霞を介して外部の応答を招く方法だったという評価も残る。皐月は、読めるが完全には理解できていない、と余白に書き添えた。",
    introducedAtVersion: CH8_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "engineeringArchive",
            level: 2
          }
        ]
      }
    ]
  },
  {
    id: "experimentalRuinsFieldReport",
    title: "実験跡地・現地調査報告",
    category: "観測記録",
    revealLevel: "deep",
    body:
      "祈念工学実験跡地の調査を行った。建物の構造は残っている。機材の一部も残っているが、ほとんどは使用不能。焼けたのではなく、急速に使われなくなった形跡がある。部屋の中央に大きな機材が残っているが、接続先がない。澪は一度だけその機材を見て「知っている」と言った。どこで知ったかは聞かなかった。",
    introducedAtVersion: CH8_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "prayerEngineeringRuins",
            level: 1
          }
        ]
      }
    ]
  },
  {
    id: "oldCouncilRecordFragment",
    title: "旧評議会・記録の断片",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "旧評議会の会議録と思われる断片が見つかった。大規模固定実験を実施する、反対意見は記録する、という文だけが残っている。名前の部分は削除されており、削除された人数も、誰が削除したのかも分からない。",
    introducedAtVersion: CH8_REINFORCEMENT_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "engineeringArchive",
            level: 4
          }
        ]
      }
    ]
  },
  {
    id: "sealedMemoryFragment",
    title: "封印された記憶について",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "バインダーの封書ではない箇所に、短い記述が残っていた。「記憶を封印することにした。理由は記録しない。理由を記録すると、記録を読んだ者が理由を再現しようとするかもしれない」。最後には、少なくとも今はまだ知らない方がいい、とだけある。",
    introducedAtVersion: CH8_REINFORCEMENT_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 1
          },
          {
            type: "facility.level",
            facilityId: "engineeringArchive",
            level: 5
          }
        ]
      }
    ]
  },
  {
    id: "unnamedTheaterEchoRecord",
    title: "名前のない劇場・残響記録",
    category: "観測記録",
    revealLevel: "deep",
    body:
      "名前のない劇場でライブを行った。席は整っていて、誰かが最近使った形跡があるが、誰かは分からない。ライブ中、音響が奇妙だった。歌が終わった後も、余韻が通常より長く続き、反響の形が今歌った歌とわずかに違う。以前にここで誰かが歌ったのか。あるいは別の廻で。どちらも確認できない。",
    introducedAtVersion: CH9_ENTRY_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 2
          },
          {
            type: "facility.level",
            facilityId: "unnamedTheater",
            level: 1
          }
        ]
      }
    ]
  },
  {
    id: "rinFirstWords",
    title: "燐・最初の言葉",
    category: "交流メモ",
    revealLevel: "deep",
    body:
      "白霧 燐と最初に話した。「初めまして」と言うと、燐は「そうかな」と言った。確信ではなく、疑問として。それから「以前もここに来たね」と続けた。覚えているのかと訊くと、「覚えているというより、感じている」と答えた。言い方が正確かどうかは分からない。でも、その感覚は少しだけ分かった。",
    introducedAtVersion: CH9_ENTRY_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 2
          },
          {
            type: "facility.level",
            facilityId: "unnamedTheater",
            level: 1
          }
        ]
      }
    ]
  },
  {
    id: "binderSealedLetterFullText",
    title: "バインダー封書・全文",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "封書の全文が読めるようになった。そこには、これを廻と呼ぶこと、次の廻のために施設を復旧し、灯し手たちを見つけ、ライブを続け、名前を掲げ続けることが書かれていた。理由は最後まで一つには書かれていない。霞へ直接願う方法を使わないこと。それだけが条件で、条件の理由を知っている者は、知らないままでいるべきだった、とある。最後の一行だけが、読み手に判断を返している。",
    introducedAtVersion: CH9_REINFORCEMENT_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 2
          },
          {
            type: "facility.level",
            facilityId: "unnamedTheater",
            level: 3
          },
          {
            type: "song.purchased",
            songId: "theLastName"
          }
        ]
      }
    ]
  },
  {
    id: "meguriMemoryRelation",
    title: "廻と記憶の関係について",
    category: "断片記憶",
    revealLevel: "deep",
    body:
      "廻について、整理できていることを書いておく。廻を経ても、記録は残る。名前は残る。灯し手たちの記憶は、部分的に残る。なぜそういう構造になっているのかは、まだ完全には分からない。バインダーに書いてあったから従っているが、それを書いた者がなぜそう設計したのかは、答えとしては残っていない。それでも続ける理由は、少しだけ分かる気がする。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 2
          },
          {
            type: "facility.level",
            facilityId: "unnamedTheater",
            level: 3
          },
          {
            type: "song.purchased",
            songId: "theLastName"
          },
          {
            type: "idol.bond",
            idolId: "shiragiriRin",
            amount: 5
          }
        ]
      }
    ]
  },
  {
    id: "unnamedTheaterResidualPerformance",
    title: "名前のない劇場・残響公演",
    category: "観測記録",
    revealLevel: "deep",
    body:
      "最後の名前を、名前のない劇場で演目に加えた。歌い終わった後、劇場の奥で一拍だけ違う残響が返った。今の声ではない。けれど、過去の声だと断定するには近すぎる。燐はその反響を追わず、もう一度だけ客席を見た。誰かがそこにいたのか、そこにいたことがあるのかは分からない。劇場は、何も答えなかった。",
    introducedAtVersion: CH9_REINFORCEMENT_RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "all",
        requirements: [
          {
            type: "meguri.count",
            count: 2
          },
          {
            type: "facility.level",
            facilityId: "unnamedTheater",
            level: 1
          },
          {
            type: "song.purchased",
            songId: "theLastName"
          }
        ]
      }
    ]
  }
] as const satisfies readonly RecordDefinition[]);

export type RecordId = ContentId<typeof RECORD_DEFINITIONS>;

export const RECORDS: Record<RecordId, RecordDefinition> = toContentMap(RECORD_DEFINITIONS);

export const RECORD_ORDER: RecordId[] = toContentOrder(RECORD_DEFINITIONS);
