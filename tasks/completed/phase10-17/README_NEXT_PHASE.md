# NEON REQUIEM 次フェーズ Codex実行パック

このパックは、Codexが 01〜08 の一連作業を完了した後に使う次フェーズ用タスク集です。

## 現状前提

- 対象repo: `nemuistd/neon_requiem`
- `SAVE_VERSION = 8`
- 基本資源は `resources.tomorusa`
- 表示名は「灯るさ」
- 施設に「ネオン掲示板」が追加済み
- 地下礼拝堂は序盤2施設目から後退済み
- アイテムタブMVP実装済み
- Requirement / Effect の共通型導入済み
- 記録に `revealLevel` 導入済み
- `src/ui.ts` は再エクスポート化済み
- ただし `src/ui/renderState.ts` に描画関数がまだ集中している
- README以外のdocsに旧記述が残っている
- ブラウザでの手動QA記録がまだない

## 推奨実行順

1. `10_task_docs_sync.md`
2. `11_task_ui_split_finalization.md`
3. `12_task_manual_browser_qa.md`
4. `13_task_logic_tests.md`
5. `14_task_content_id_derivation.md`
6. `15_task_effect_engine_refactor.md`
7. `16_task_balance_pass.md`
8. `17_task_next_gameplay_phase_design.md`

最初の3つは残課題清算です。
4〜6は拡張基盤の安定化です。
7〜8は次のゲーム内容拡張に入るための準備です。

各タスクの最後には必ず以下を実行してください。

```sh
npm run build
npm run check:content
```

テスト導入後は、該当タスクの指示に従って追加テストも実行してください。
