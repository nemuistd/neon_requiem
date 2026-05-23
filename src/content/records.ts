import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { RecordDefinition } from "./types.js";

export const RECORD_CONTENT_VERSION = 8;

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
    id: "idolBondAkariFirstVoice",
    title: "灯里・最初の呼び声",
    category: "交流メモ",
    revealLevel: "surface",
    body:
      "ライブの後、灯里は客席から名前を呼ばれたことに少し遅れて気づいた。返事は小さかったが、片づけの間もその席の方を何度か見ていた。次の告知にも、自分の名前をきちんと書いてほしいと頼まれた。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    id: "idolBondYuiGuideNote",
    title: "結・案内メモの端",
    category: "交流メモ",
    revealLevel: "uncanny",
    body:
      "結は、ネオン掲示板の横に小さな案内メモを足した。曲がり角の説明は妙に正確で、読んだ人は暗い通路でも迷いにくいという。本人は、前に誰かが教えてくれた気がするとだけ言っている。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    id: "twilightPathGuideOpeningReport",
    title: "薄明通り案内所・開設報告",
    category: "復旧報告",
    revealLevel: "surface",
    body:
      "薄明通り案内所を開設した。ネオン掲示板から南西、分岐点の手前に小さな窓口を置く。確認のために一時間立っていると、そこで足を止めて周囲を見回す人が確かに多かった。案内所設置後、通過人数を計測できるようになる予定。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
      "旧い放送室の機材を確認した。一部は動く。録音テープが数本残っていたため再生したところ、音声は入っているが内容を聞き取れない。劣化したのではなく、録音時から音質が低いように見える。削除ではなく、意図的に聞き取れないようにされた録音である可能性がある。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    introducedAtVersion: RECORD_CONTENT_VERSION,
    unlockRequirements: [
      {
        type: "facility.level",
        facilityId: "memoryLibrary",
        level: 5
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
    id: "idolBondShinoStorageShelf",
    title: "詩乃・保管棚の前",
    category: "交流メモ",
    revealLevel: "uncanny",
    body:
      "詩乃は地下礼拝堂の保管棚を開ける前に、必ず短く声をかける。返事はないが、棚札の番号が読みやすくなることがある。失われた歌の持ち主へ挨拶しているのだと、彼女は静かに説明した。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
    id: "chapelSecondShelfInvestigation",
    title: "礼拝堂・第二保管棚の調査",
    category: "観測記録",
    revealLevel: "uncanny",
    body:
      "詩乃が第二保管棚の内容を整理した。分類結果は、公演記録、復旧報告、名前の登録台帳。どれも通常の施設記録として扱える。例外として、表紙に何も書かれていない文書が一冊あった。内容は観測手順と思われるが、何を観測するものかは書かれていない。詩乃は、出所不明として保管すると記録した。",
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
    id: "shinoDeletedRecordTrace",
    title: "詩乃・消えた記録の痕跡",
    category: "施設ログ",
    revealLevel: "technical",
    body:
      "保管棚の一部の文書に、削除の痕跡がある。詩乃は、朽ちたのではなく、削除された跡だけが残っている、と観察した。削除された内容の種類も、削除した者の意図も不明。詩乃は、消えた記録を復元することはできない。でも、消えたことは記録できる、とだけ言った。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
      "歌を媒介にすることで、安全に人々の注意を集め、灯し手と区画を安定させることが出来るのではないか。アイドルの歌唱は聖歌隊のそれとは異なる。公演は儀式とはならず、歌は聖歌にはならないだろう。",
    introducedAtVersion: RECORD_CONTENT_VERSION,
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
