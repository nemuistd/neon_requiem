# NEON REQUIEM Product Docs

このフォルダは、NEON REQUIEM の最上位方針を、少しずつ具体的な設計とタスクへ落としていくための文書群である。

急いでタスク化するための場所ではない。上位の意図から順に、体験、設計判断、マイルストーン、実装可能なバックログへ段階的に降りる。下位の文書を書いている途中で上位方針の不足や矛盾が見つかった場合は、先に上位文書へ戻って直す。

## 文書階層

1. [00_product_charter.md](00_product_charter.md): なぜ作るか、何を守るか、最上位の判断基準。
2. [10_product_requirements.md](10_product_requirements.md): Product Charter を、初回体験、中期体験、長期体験、受け入れ信号へ落としたもの。
3. [20_design_translation.md](20_design_translation.md): 体験要件を、UI、文言、コンテンツ、進行設計の判断基準へ翻訳したもの。
4. [30_milestone_roadmap.md](30_milestone_roadmap.md): タスクではなく、段階的に満たすべき状態と未解決論点を整理したもの。
5. [40_task_backlog.md](40_task_backlog.md): マイルストーンから十分具体化できたものだけを、順序付きタスク候補として置く場所。
6. [50_parallel_execution_plan.md](50_parallel_execution_plan.md): 実行可能なタスクを、並列ユニット、write scope、合流順へ割り当てたもの。
7. [90_feedback_loop.md](90_feedback_loop.md): 下位レイヤから上位レイヤへ戻る条件、更新手順、同期先を定義する運用ルール。

補助文書:

- [content_addition_acceptance_template.md](content_addition_acceptance_template.md): 新しい施設、歌、アイテム、アイドル、記録、交流イベントを追加する時の受け入れ条件テンプレート。

## 基本の進め方

文書を書く順序は `00 -> 10 -> 20 -> 30 -> 40 -> 50` を基本にする。

実装タスクへ進めるのは、`40_task_backlog.md` で目的、対象範囲、受け入れ条件、確認方法が明確になり、`50_parallel_execution_plan.md` で実行順と並列可否が整理された項目だけにする。タスク化の途中で前提が曖昧になった場合は、`90_feedback_loop.md` に従って上位文書を更新してから下位へ戻る。

## 参照順

プロダクト判断で迷った場合は、この順に確認する。

1. `docs/product/00_product_charter.md`
2. `docs/product/10_product_requirements.md`
3. `docs/product/20_design_translation.md`
4. `docs/product/30_milestone_roadmap.md`
5. `docs/product/40_task_backlog.md`
6. `docs/product/50_parallel_execution_plan.md`
7. `docs/current_spec.md`
8. `docs/worldbuilding.md`
9. `docs/planning/`

ただし、実装済み仕様は [current_spec.md](../current_spec.md)、世界観・用語体系は [worldbuilding.md](../worldbuilding.md)、長期構想は [planning/](../planning/) を正とする。このフォルダの文書は、それらを置き換えるものではなく、実装判断に使える段階へ翻訳するための入口である。

## 更新ルール

- `00_product_charter.md` は頻繁に変えない。作品の約束が変わる時だけ更新する。
- `10_product_requirements.md` は、プレイヤー体験や成功信号の理解が変わった時に更新する。
- `20_design_translation.md` は、UI、文言、コンテンツ、進行設計の判断基準が変わった時に更新する。
- `30_milestone_roadmap.md` は、どの段階を先に満たすべきか、未解決論点が変わった時に更新する。
- `40_task_backlog.md` は、実装可能な粒度まで具体化できた項目だけを追加・並べ替えする。
- `50_parallel_execution_plan.md` は、タスクの依存関係、write scope、並列ユニット、合流順が変わった時に更新する。
- `content_addition_acceptance_template.md` は、新規コンテンツの受け入れ条件や同期先が変わった時に更新する。
- 実装済み内容が変わったら、必要に応じて [current_spec.md](../current_spec.md) も同期する。
- 世界観や用語の正史を変える場合は、まず [worldbuilding.md](../worldbuilding.md) を確認する。
