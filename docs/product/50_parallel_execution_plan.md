# Parallel Execution Plan

## 位置づけ

この文書は、`docs/product/40_task_backlog.md` にある現行タスクを、複数の作業単位に分ける必要が出た時だけ使う。

現在、常時有効な並列作業計画はない。完了済みの 2026-05-16 Product Docs 初期整備計画は `docs/product/archive/2026-05-16_parallel_execution_plan.md` に移した。

## 運用ルール

- ひとつの実装タスクを進めるだけなら、この文書を更新しない。
- 複数エージェント、別 worktree、人間との分担など、write scope の衝突管理が必要な時に更新する。
- 並列化する場合は、各ユニットに `目的`, `write scope`, `依存関係`, `合流条件`, `確認方法` を明記する。
- 統合担当は、最後に `docs/current_spec.md`, `docs/worldbuilding.md`, `docs/fiction/`, 関連する `docs/planning/` と矛盾しないか確認する。

## 現在の状態

- Active parallel plan: なし。
- Active backlog: `docs/product/40_task_backlog.md` を参照。
- Historical plans: `docs/product/archive/` を参照。
