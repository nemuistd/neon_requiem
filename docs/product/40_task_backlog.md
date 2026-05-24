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

### P-M7-MEGURI-12: 廻後再進行の軽量設計

目的:

- 初回廻後に、再進行する意味と見え方を増やす前に、追加範囲を小さく設計する。

対象範囲:

- 廻後の軽い再読・再進行表示。
- 廻回数、購入済み廻後バフ、記録追記の使い道。
- Ch.7 以降の大型展開に入らない範囲の整理。

依存:

- 廻 v1/v2 実装済み。
- `docs/planning/meguri_system_spec.md`
- `docs/planning/world_reveal_and_prestige_plan.md`

Write scope:

- 主に `docs/planning/meguri_system_spec.md`
- 必要なら `docs/product/30_milestone_roadmap.md`

受け入れ条件:

- 廻後に何を増やすか、何をまだ増やさないかが分かる。
- Ch.7 以降、新アイドル、白霧 燐、Ch.9 収束を勝手に確定しない。
- 実装タスクに落とせる小さな候補が1〜3個に絞られている。

確認方法:

- `docs/current_spec.md` と `docs/fiction/` との矛盾確認。
- `rg "白霧|Ch.7|Ch.9|再固定|廻" docs src`

### P-M3-IDOL-13: 交流イベント最小実装の仕様化

目的:

- `bond` と `eventIdsRead` を、アイドル個別の短い交流イベントへつなぐための最小仕様を決める。

対象範囲:

- 初期実装済みアイドルのうち、対象人数を絞った交流イベント候補。
- イベント解放条件。
- 既読管理。
- 記録タブとの役割分離。

依存:

- アイドル加入導線実装済み。
- `docs/planning/idol_roster_expansion_design.md`

Write scope:

- 主に `docs/planning/idol_roster_expansion_design.md`
- 実装に進む場合は `src/game.ts`, `src/storage.ts`, `src/ui/renderIdols.ts`, テスト。

受け入れ条件:

- 交流イベントが数値報酬だけになっていない。
- アイドルを所有・搾取しているように見えない。
- `eventIdsRead` と記録既読状態の役割が分かれている。
- 初期実装済みアイドルだけで物語を閉じない。

確認方法:

- `docs/current_spec.md` と `docs/planning/idol_roster_expansion_design.md` の照合。
- 実装する場合は `npm.cmd run test`, `npm.cmd run check:content`, 必要ならブラウザQA。

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

## 保留中の候補

以下は、まだ実装タスク化しない。

- Ch.7 以降の大型展開。
- 白霧 燐。
- Ch.9 収束。
- 主人公の正体、霞の意志、旧計画の全貌の確定。
- 10人以上のアイドル全員の具体設計。
- 大規模なUI再構成。

これらは、上位文書、`docs/fiction/`、関連する `docs/planning/` の整理が進んでから、必要に応じてバックログへ降ろす。
