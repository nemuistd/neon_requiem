# Task Backlog

## 位置づけ

この文書は、十分に具体化できた項目だけを、実行可能なタスク候補として置く場所である。

ここに書かれた項目は、ただちにゲーム実装を行う指示ではない。実装に進む時は、対象タスクを1つ選び、関連する上位文書、現在仕様、世界観正史、実装済みコードを確認してから着手する。

完了済みタスクの詳細な作業分担や古い実行計画は `docs/product/archive/` を参照する。現在仕様は `docs/current_spec.md` を優先する。

## バックログ投入条件

`40_task_backlog.md` に入れるタスクは、次を満たす必要がある。

- 目的が明確である。
- 対象範囲がレビューしやすい大きさである。
- 依存関係と推奨実行順が分かる。
- 並列可否と write scope が分かる。
- 受け入れ条件が確認可能である。
- 確認方法が、手動QA、コンテンツ検証、テスト、ビルドのいずれかに落ちている。
- [Product Charter](00_product_charter.md) と [Experience Requirements](10_product_requirements.md) に反していない。
- 実装済み仕様や正史に影響する場合は、同期先が明記されている。

## 現在の優先候補

### P-M7-RECORD-14: 追記索引の追加

目的:

- 廻後バフで解放された記録追記を、廻タブから見失わないようにする。

対象範囲:

- 廻タブ内の追記索引。
- 追記解放済み記録名、既読 / 未読、関連する廻後バフ名。
- 記録本文は記録タブに残し、廻タブへ重複表示しない。

依存:

- P-M7-MEGURI-12 設計済み。
- 記録追記と追記既読状態が実装済み。

Write scope:

- `src/ui/renderMeguri.ts`
- 必要なら `src/game.ts` の小さな表示 helper
- `src/meguri.test.ts` または UI表示テスト
- `docs/current_spec.md`

受け入れ条件:

- 廻後バフで追記が解放された記録を廻タブから確認できる。
- 既読 / 未読の区別が見える。
- 追記通知ポリシーと矛盾しない。
- Ch.7 以降や白霧 燐に触れない。

確認方法:

- `npm.cmd run test`
- `npm.cmd run build`
- 廻後バフ購入済み debug save でブラウザQA。

### P-M7-IDOL-15: 薄明の記憶イベント仕様化

目的:

- `idolRecognition` と交流イベント基盤を接続する前に、最初の対象と条件を小さく決める。

対象範囲:

- `idolRecognition` を Requirement 化するか、専用判定にするか。
- 最初に追加する対象アイドル 1〜2人。
- 通常交流イベントと「薄明の記憶」の表示差分。

依存:

- P-M7-MEGURI-12 設計済み。
- 交流イベント最小実装済み。

Write scope:

- `docs/planning/idol_roster_expansion_design.md`
- `docs/planning/meguri_system_spec.md`
- 必要なら `docs/product/40_task_backlog.md`

受け入れ条件:

- アイドルが廻を理解している、または記憶を保持していると断定しない。
- Ch.7 以降、新アイドル、白霧 燐、Ch.9 収束に入らない。
- 実装タスクへ落とす場合の対象ファイルと確認方法が分かる。

確認方法:

- `docs/current_spec.md`, `docs/fiction/meguri_after_design.md`, `docs/planning/meguri_system_spec.md` との照合。

## 完了済みタスク概要

### Product Docs 初期整備

2026-05-16 実施済み。

- `P-M1-QA-01`: 初回3分導線QAを追加。
- `P-M1-COPY-02`: 序盤メッセージを最小改善。
- `P-M4-RECORD-03`: 記録の開示レイヤーを点検。
- `P-M3-IDOL-04`: 交流イベント最小仕様を文書化。
- `P-M5-TEMPLATE-05`: 新規コンテンツ追加時の受け入れ条件テンプレートを追加。
- `P-INTEGRATE-06`: 並列作業後の統合レビュー。

詳細な並列実行計画は `docs/product/archive/2026-05-16_parallel_execution_plan.md` を参照する。

### 廻 v2 / アイドル加入導線

2026-05-25 実装済み。

- `P-M4-MEGURI-07`: 廻清算専用画面と終了導線。
- `P-M4-MEGURI-08`: 記憶断片の次断片ゲージ。
- `P-M4-RECORD-09`: 廻後の記録通知ポリシー調整。
- `P-M3-IDOL-10`: アイドル加入アクションと効果発動分離。
- `P-INTEGRATE-11`: 廻 v2 / アイドル加入統合QA。

現在仕様は `docs/current_spec.md`、詳細仕様は `docs/planning/meguri_system_spec.md` と `docs/planning/idol_roster_expansion_design.md` を参照する。

### Product / Planning 整理

2026-05-25 実施済み。

- product のロードマップとバックログを、廻 v1/v2 とアイドル加入導線後の現状へ更新。
- 完了済みの並列計画を `docs/product/archive/` へ移動。
- 古い Phase 18+ 実装計画を `docs/planning/archive/` へ移動。
- planning の廻前提、再固定中枢、アイドル効果モデル、施設候補の表現を現行仕様に同期。
- `docs/planning/README.md` と archive 入口を追加し、現役文書と履歴文書の参照先を明確化。

### 交流イベント最小実装

2026-05-25 実施済み。

- `IdolEventDefinition` と `src/content/idolEvents.ts` を追加。
- 音羽 灯里の `otowaAkari.firstSeat` を交流 5 で解放。
- `eventIdsRead` で既読を保存し、アイドルタブに交流イベント表示を追加。
- 交流イベント読了では、灯るさ、生産量、交流値を変化させない。

### 廻後再進行の軽量設計

2026-05-25 実施済み。

- 廻後に増やすものを、廻後ダッシュボード、追記索引、薄明の記憶イベント入口の3つへ絞った。
- まだ増やさないものとして、Ch.7以降、新アイドル、白霧 燐、Ch.9収束、施設レベル持ち越し、記憶断片常時生産を明記した。
- 次の実装候補を `P-M7-MEGURI-13`, `P-M7-RECORD-14`, `P-M7-IDOL-15` に分割した。

### 廻後ダッシュボード最小実装

2026-05-25 実装済み。

- `P-M7-MEGURI-13` として、初回廻後の通常進行中に廻タブへ「廻後の見取り図」を追加。
- 廻回数、記憶断片、取得済み廻後バフ数、追記解放数、痕跡アイドル数、次の小さな目印を既存 state から集計する。
- 新しい保存フィールド、Ch.7以降、新アイドル、白霧 燐、Ch.9収束は追加していない。

## 保留中の候補

以下は、まだ実装タスク化しない。

- Ch.7 以降の大型展開。
- 白霧 燐。
- Ch.9 収束。
- 主人公の正体、霞の意志、旧計画の全貌の確定。
- 10人以上のアイドル全員の具体設計。
- 大規模なUI再構成。

これらは、上位文書、`docs/fiction/`、関連する `docs/planning/` の整理が進んでから、必要に応じてバックログへ降ろす。
