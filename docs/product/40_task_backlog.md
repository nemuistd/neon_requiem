# Task Backlog

## 位置づけ

この文書は、[Milestone Roadmap](30_milestone_roadmap.md) から十分に具体化できた項目だけを、実行可能なタスク候補として置く場所である。

ここに書かれた項目は、ただちにゲーム実装を行う指示ではない。実装に進む時は、対象タスクを1つ選び、関連する上位文書、現在仕様、世界観正史、実装済みコードを確認してから着手する。

## バックログ投入条件

`40_task_backlog.md` に入れるタスクは、次を満たす必要がある。

- 目的が明確である。
- 対象範囲がレビューしやすい大きさである。
- 依存関係と推奨実行順が分かる。
- 並列可否とwrite scopeが分かる。
- 受け入れ条件が確認可能である。
- 確認方法が、手動QA、コンテンツ検証、テスト、ビルドのいずれかに落ちている。
- [Product Charter](00_product_charter.md) と [Experience Requirements](10_product_requirements.md) に反していない。

## 推奨実行順

1. `P-M1-QA-01`
2. `P-M1-COPY-02`
3. `P-M4-RECORD-03`
4. `P-M3-IDOL-04`
5. `P-M5-TEMPLATE-05`
6. `P-INTEGRATE-06`

`P-M1-QA-01`、`P-M1-COPY-02`、`P-M4-RECORD-03`、`P-M3-IDOL-04`、`P-M5-TEMPLATE-05` は並列に着手できる。`P-INTEGRATE-06` は全ユニット完了後に実行する。

## 実施状況

2026-05-16時点で、以下のタスクは実施済み。

| Task ID | 状態 | 実施結果 |
| --- | --- | --- |
| `P-M1-QA-01` | 完了 | `docs/manual_qa_checklist.md` に初回3分導線QAを追加した。 |
| `P-M1-COPY-02` | 完了 | `src/data.ts` の初期メッセージ、ライブ、灯るさ不足、施設復旧、歌、アイテム、オフライン報酬文言を最小改善した。 |
| `P-M4-RECORD-03` | 完了 | `src/content/records.ts` を点検し、深層語は `deep` / `technical` の記録に限られていたため本文修正なしとした。 |
| `P-M3-IDOL-04` | 完了 | `docs/planning/idol_roster_expansion_design.md` に交流イベントの最小仕様を追加した。 |
| `P-M5-TEMPLATE-05` | 完了 | `docs/product/content_addition_acceptance_template.md` を追加した。 |
| `P-INTEGRATE-06` | 完了 | 文書参照、深層語、コンテンツ検証、テスト、ビルドを確認した。 |

実施済み確認:

- UTF-8読み取り: 完了。
- 旧参照確認: 完了。
- `npm.cmd run check:content`: 成功。
- `npm.cmd run test`: 成功。
- `npm.cmd run build`: 成功。

## Tasks

### P-M1-QA-01: 初回3分導線QAを既存チェックリストへ落とす

目的:

- M1の「初回3分体験」を確認できるようにする。

対象範囲:

- 新規セーブ開始から、ライブ、灯るさ獲得、路地裏ステージ強化、自動生産確認まで。
- 既存の手動QA文書への追記候補整理。

依存タスク:

- なし。

推奨実行順:

- 1番目。ほかのタスクと並列開始可。

並列可否:

- 並列可。

担当ユニット種別:

- Unit A: QA / Documentation。

Write scope:

- `docs/manual_qa_checklist.md`
- 必要なら `docs/product/40_task_backlog.md`

受け入れ条件:

- 初回3分で確認する操作と期待結果が明文化されている。
- 既存QA項目との重複が最小限に整理されている。
- 深層語を理解しなくても序盤の目標が分かるか確認できる。

確認方法:

- `Get-Content -Raw -Encoding UTF8 docs/manual_qa_checklist.md`
- 旧QA項目との重複確認。

実施結果:

- `docs/manual_qa_checklist.md` に「初回3分導線」を追加した。
- 既存の「ライブ / 生産 / 保存」と重なりすぎないよう、初回3分で見るべき順序と期待される理解に絞った。

### P-M1-COPY-02: 初期メッセージ・灯るさ説明・主要フィードバック文言を点検する

目的:

- M1/M2の「操作理解」と「復興感」を強める。

対象範囲:

- 初期メッセージ。
- 灯るさ説明。
- ライブ時、施設強化時、歌取得時、アイテム購入時の短いフィードバック。

依存タスク:

- なし。

推奨実行順:

- 2番目。`P-M1-QA-01` と並列開始可。

並列可否:

- 並列可。
- `P-M4-RECORD-03` と並列可。ただし、最終的な文言トーンは `P-INTEGRATE-06` で確認する。

担当ユニット種別:

- Unit B: UI Copy / Initial Experience。

Write scope:

- `src/data.ts`
- 必要なら `docs/current_spec.md`

受け入れ条件:

- 灯るさが単なる通貨ではなく、街や施設の安定と結びついて読める。
- プレイヤーとアイドルの関係が、所有や搾取に見えない。
- 通常UIで「聖歌」をシステム名として扱っていない。
- 変更が最小限で、初回導線を複雑にしていない。

確認方法:

- 文言差分確認。
- UI文言やコンテンツ定義を変えた場合は `npm.cmd run check:content`。
- 表示崩れが懸念される場合は `npm.cmd run build`。

実施結果:

- `src/data.ts` の序盤メッセージを、灯るさが街や施設の安定と結びついて読める方向へ調整した。
- 数値バランス、ゲームロジック、深層語は変更していない。

### P-M4-RECORD-03: 既存記録の開示レイヤーを点検する

目的:

- M4の「深層開示と長期進行」を安定させる。

対象範囲:

- 既存記録の `revealLevel`。
- `surface`、`uncanny`、`technical`、`deep` の文言の出し分け。
- 通常UI名と深層用語の混在確認。

依存タスク:

- なし。

推奨実行順:

- 3番目。`P-M1-COPY-02` と並列開始可。

並列可否:

- 並列可。
- `src/content/records.ts` を触るため、同じファイルを触る別タスクとは並列不可。

担当ユニット種別:

- Unit C: Records / Reveal Layer。

Write scope:

- `src/content/records.ts`
- 必要なら `docs/current_spec.md`

受け入れ条件:

- `surface` の記録に、祈念工学、アンカー、聖歌、祈念負荷などの深層語を出しすぎていない。
- `technical` / `deep` の記録でも、通常UI名と深層用語の役割が混ざっていない。
- 主人公の正体、霞の意志、旧計画の全貌を確定していない。
- 現在仕様の記録一覧と実装が食い違う場合は同期方針が明確である。

確認方法:

- [worldbuilding.md](../worldbuilding.md) と照合する。
- `npm.cmd run check:content`
- 記録解放条件やテストに影響する場合は `npm.cmd run test`

実施結果:

- `src/content/records.ts` を点検し、祈念工学、アンカー、聖歌、祈念負荷が `surface` 記録に出ていないことを確認した。
- 深層語は `songAndHymnDistinction` の `deep` と `mistAndAnchorFacilityLog` の `technical` に限定されているため、本文修正は行わなかった。

### P-M3-IDOL-04: アイドル交流イベントの最小仕様を設計文書化する

目的:

- M3の「アイドルを個人として感じられる導線」を前に進める。

対象範囲:

- 実装前の仕様整理。
- `bond` と交流イベントの関係。
- イベントが数値報酬だけにならないための方針。

依存タスク:

- なし。

推奨実行順:

- 4番目。実装変更を伴わないため、ほかの点検タスクと並列開始可。

並列可否:

- 並列可。

担当ユニット種別:

- Unit D: Idol Interaction Design。

Write scope:

- `docs/planning/idol_roster_expansion_design.md`
- 必要なら `docs/product/30_milestone_roadmap.md`

受け入れ条件:

- 交流イベントの役割が、効率、居場所、物語上の意味のどれに属するか整理されている。
- `bond` の既存仕様と矛盾していない。
- 初期3アイドルだけで物語を閉じない。
- 追加アイドル設計と矛盾しない。

確認方法:

- `Get-Content -Raw -Encoding UTF8 docs/planning/idol_roster_expansion_design.md`
- `rg "bond|交流|eventIdsRead|idol.bond" src docs/planning docs/product`

実施結果:

- `docs/planning/idol_roster_expansion_design.md` に「交流イベントの最小仕様」を追加した。
- `bond`、`eventIdsRead`、将来のイベント解放条件、禁止事項、受け入れ条件を整理した。

### P-M5-TEMPLATE-05: 新規コンテンツ追加時の受け入れ条件テンプレートを作る

目的:

- M5の「タスクバックログ運用」を安定させる。

対象範囲:

- 施設、歌、アイテム、アイドル、記録を追加する時の確認項目。
- Product Charterとの対応。
- current_spec / worldbuilding / planning との同期条件。

依存タスク:

- なし。

推奨実行順:

- 5番目。ほかの文書作業と並列開始可。

並列可否:

- 並列可。

担当ユニット種別:

- Unit E: Template / Process。

Write scope:

- 新規 `docs/product/content_addition_acceptance_template.md`
- 必要なら `docs/product/40_task_backlog.md`

受け入れ条件:

- 新規コンテンツが、何を増やし、何を戻し、どんな判断や気持ちの変化を生むか確認できる。
- 実装済み仕様と世界観正史の同期が必要な場合に見落とさない。
- 施設、歌、アイテム、アイドル、記録の役割が混ざらない。

確認方法:

- `Get-Content -Raw -Encoding UTF8 docs/product/content_addition_acceptance_template.md`
- `rg "current_spec|worldbuilding|planning|Product Charter" docs/product`

実施結果:

- `docs/product/content_addition_acceptance_template.md` を追加した。
- 施設、歌、アイテム、アイドル、記録、交流イベントごとの受け入れ条件を分けて整理した。

### P-INTEGRATE-06: 並列作業後の統合レビュー

目的:

- 並列作業後に、文書、文言、コンテンツ、検証方針の整合を確認する。

対象範囲:

- `docs/product/40_task_backlog.md`
- `docs/product/50_parallel_execution_plan.md`
- 並列ユニットが触った文書やコード。

依存タスク:

- `P-M1-QA-01`
- `P-M1-COPY-02`
- `P-M4-RECORD-03`
- `P-M3-IDOL-04`
- `P-M5-TEMPLATE-05`

推奨実行順:

- 6番目。全ユニット完了後に実行する。

並列可否:

- 並列不可。

担当ユニット種別:

- Integration Unit。

Write scope:

- `docs/product/40_task_backlog.md`
- `docs/product/50_parallel_execution_plan.md`
- 必要に応じて同期先文書。

受け入れ条件:

- 旧参照や矛盾が残っていない。
- Product Charter、Experience Requirements、worldbuilding、current_spec と矛盾していない。
- コンテンツやUI文言に触れた場合、必要な確認コマンドが実行されている。
- 必要なら上位文書へのフィードバックが行われている。

確認方法:

- `rg "20_[i]mplementation_task_plan|docs/[p]roduct_charter|(^|[^0-9A-Za-z_])[p]roduct_charter\\.md" README.md AGENTS.md docs`
- `rg "docs/product/|50_parallel_execution_plan|P-M1|P-M3|P-M4|P-M5" README.md AGENTS.md docs`
- 必要に応じて `npm.cmd run check:content`
- 必要に応じて `npm.cmd run build`

実施結果:

- 旧参照が残っていないことを確認した。
- `docs/product/README.md` に新規テンプレートを補助文書として追加した。
- `npm.cmd run check:content`、`npm.cmd run test`、`npm.cmd run build` が成功した。

## 保留中の候補

以下はまだタスク化しない。

- 再固定 / 再観測の実装。
- 主人公の正体や旧計画の核心開示。
- 10人以上のアイドル全員の具体設計。
- 大規模なUI再構成。

これらは、上位文書と関連する `docs/planning/` の整理が進んでから、必要に応じてバックログへ降ろす。
