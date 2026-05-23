# Feedback Loop

## 位置づけ

この文書は、`docs/product/` の下位レイヤを書いている途中で、上位レイヤへ戻るための運用ルールを定義する。

NEON REQUIEM のプロダクト文書は、一方向に降りるだけではない。タスク化や実装検討の途中で上位方針の不足、矛盾、古さが見つかった場合は、上位文書へ戻って改善してから、再び下位文書へ降りる。

## 基本ループ

通常は次の順に降りる。

1. `00_product_charter.md`
2. `10_product_requirements.md`
3. `20_design_translation.md`
4. `30_milestone_roadmap.md`
5. `40_task_backlog.md`
6. `50_parallel_execution_plan.md`
7. 実装タスク

途中で問題が見つかった場合は、必要なレイヤまで戻る。

## 上位へ戻る条件

### Charterへ戻る

次の場合は、[00_product_charter.md](00_product_charter.md) を見直す。

- 作品の中心的な魅力が変わりそうな時。
- プレイヤーとアイドルの関係性の解釈が揺れている時。
- 暗さ、回復、居場所づくり、復興の優先順位が判断できない時。
- 新機能が NEON REQUIEM らしいか判定できない時。

### Experience Requirementsへ戻る

次の場合は、[10_product_requirements.md](10_product_requirements.md) を見直す。

- 初回体験、中期体験、長期体験のどこに属するか分からない時。
- 成功したと言えるプレイヤーの状態が曖昧な時。
- 受け入れ信号が画面やQAで確認できない時。

### Design Translationへ戻る

次の場合は、[20_design_translation.md](20_design_translation.md) を見直す。

- UI、文言、コンテンツ、進行設計の判断基準が足りない時。
- 要件は分かるが、設計へどう翻訳するか決めきれない時。
- 深層語、通常UI名、記録文言の扱いが揺れている時。

### Milestone Roadmapへ戻る

次の場合は、[30_milestone_roadmap.md](30_milestone_roadmap.md) を見直す。

- どの順番で進めるべきか判断できない時。
- タスク化するには未解決論点が多すぎる時。
- あるマイルストーンの達成状態が曖昧な時。

### Task Backlogへ戻る

次の場合は、[40_task_backlog.md](40_task_backlog.md) を見直す。

- タスクの目的、対象範囲、受け入れ条件、確認方法が揃っていない時。
- タスクが大きすぎてレビューしにくい時。
- 実装中に、別タスクとして切り出すべき内容が見つかった時。

### Parallel Execution Planへ戻る

次の場合は、[50_parallel_execution_plan.md](50_parallel_execution_plan.md) を見直す。

- タスクのwrite scopeが重なり、並列実行が危うい時。
- 並列ユニットの成果をどの順で合流すべきか判断できない時。
- 実装中に、担当ユニットを分けるべき作業が見つかった時。

## 正史ドキュメントとの同期

`docs/product/` はプロダクト判断の階層であり、正史そのものではない。

- 実装済み仕様が変わった場合は、[current_spec.md](../current_spec.md) を確認し、必要なら同期する。
- 世界観や用語体系が変わる場合は、[worldbuilding.md](../worldbuilding.md) を確認し、必要なら同期する。
- 長期構想や未実装計画が変わる場合は、[planning/](../planning/) を確認し、必要なら該当文書を同期する。
- 実装済み内容と文書が食い違う場合は、`src/content/*` と `src/data.ts` を確認してから判断する。

## 更新手順

1. どのレイヤで問題が見つかったかを短く書き出す。
2. 戻るべき上位文書を1つ選ぶ。
3. 上位文書を必要最小限で更新する。
4. 更新した上位文書に合わせて、下位文書を再確認する。
5. 実装済み仕様や世界観正史に影響する場合は、該当ドキュメントも同期する。
6. 最後に、旧参照や矛盾が残っていないか検索する。

## 実装中に見つかった改善点の扱い

実装中に上位文書の改善点が見つかった場合、ただちに大きな書き換えを始めない。

まず、現在のタスクに必要な範囲かを判断する。必要なら上位文書を小さく更新し、タスクへ戻る。必要でない場合は、`40_task_backlog.md` か関連する `docs/planning/` に候補として残す。

このループによって、NEON REQUIEM はタスクを消化するだけでなく、作りながら上位方針も磨いていく。
