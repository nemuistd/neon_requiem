# Phase 29: 廻本体仕様検討

## 目的

地下通路修復区画の次に出る `再固定中枢` は、廻本体の起点になる。
実装に入る前に、廻で何がリセットされ、何が持ち越され、どのリソースやボーナスが発生するかを決める。

## 参照

- `docs/current_spec.md`
- `docs/worldbuilding.md`
- `docs/fiction/world_design.md`
- `docs/fiction/content_design.md`
- `docs/planning/meguri_system_spec.md`
- `docs/planning/world_reveal_and_prestige_plan.md`
- `docs/planning/next_facility_candidates.md`

## 作業

基本方針は `docs/planning/meguri_system_spec.md` に整理済み。

- 初回廻に必要な再固定中枢レベルと、主要コンテンツ完了条件を決める。
- 記憶断片の具体的な算出式を決める。
- 廻実行前に表示する記憶断片獲得見込みの表示形式を決める。
- 購入済みの記憶断片獲得量バフを反映したプレビュー値と、廻実行時の実付与値が一致するテスト方針を決める。
- 初期廻後バフの種類、価格、効果量を決める。
- バフと記録アノテーションの対応表を決める。
- 廻後バフ専用画面の表示位置と購入可能タイミングを決める。
- 実装PRの分割を決める。

## 禁止

- 廻本体の実装
- 再固定中枢の実装
- 記憶断片リソースの実装
- 主人公の正体、霞の意志、旧計画の全貌の確定
- 立ち絵制作

## 成果物

- 廻本体の実装前仕様メモ（`docs/planning/meguri_system_spec.md`）
- 実装PR分割案
- 実装前にユーザーへ確認すべき未決事項

## 検証

このタスクは原則docsのみ。
必要なら以下を実行する。

```sh
npm run build
npm run check:content
npm run test
```
