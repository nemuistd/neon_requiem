# NEON REQUIEM Codex実行パック

このパックは、`nemuistd/neon_requiem` に対して Codex に段階的に作業させるための指示書です。

## 使い方

1. Codex にリポジトリ `nemuistd/neon_requiem` を開かせる。
2. まず `00_codex_global_context.md` の内容を Codex の最初のメッセージに渡す。
3. 以後、`01_...` から順に、1タスクずつ Codex に渡す。
4. 各タスク完了後、必ず以下を確認する。
   - `npm run build`
   - `npm run check:content`
   - 変更内容の要約
   - 変更ファイル一覧
   - 未完了事項の明記
5. 原則として、1タスク = 1 PR で進める。

## 推奨順序

1. `01_task_worldbuilding_docs.md`
2. `02_task_content_foundation.md`
3. `03_task_resources_v8.md`
4. `04_task_requirements_effects.md`
5. `05_task_early_progression_relayout.md`
6. `06_task_items_mvp.md`
7. `07_task_records_chapters_reveal.md`
8. `08_task_ui_split.md`
9. `09_review_checklist.md`

## Codexに守らせる大原則

- 一度に全計画を実装しない。
- 既存のMVPとして動くゲームを壊さない。
- React等のUIフレームワークは導入しない。
- 依存追加は原則禁止。必要なら理由を明記する。
- 世界観は `docs/worldbuilding.md` を正史とする。
- 添付された「世界観設定.txt」は、`docs/worldbuilding.md` と同等の基準文書として扱う。
- 序盤UIでは「祈念工学」「アンカー」「聖歌」などの深層語を前面に出しすぎない。
- 「聖歌」は通常システム名にしない。
- 地下礼拝堂は削除せず、中盤以降の施設として再配置する。
- リリース前なので旧セーブ互換性より、新しいセーブ構造の良さを優先する。
