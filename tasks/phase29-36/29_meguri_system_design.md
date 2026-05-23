# Phase 29: 廻本体仕様検討

## 目的

地下通路修復区画の次に出る `再固定中枢` は、廻本体の起点になる。
実装に入る前に、廻で何がリセットされ、何が持ち越され、どのリソースやボーナスが発生するかを決める。

## 参照

- `docs/current_spec.md`
- `docs/worldbuilding.md`
- `docs/fiction/world_design.md`
- `docs/fiction/content_design.md`
- `docs/planning/world_reveal_and_prestige_plan.md`
- `docs/planning/next_facility_candidates.md`

## 作業

- 廻の発動条件を決める。
- リセット対象と持ち越し対象を決める。
- 記憶断片リソースを実装するか、表示だけ先行するかを決める。
- 初回廻ボーナスの種類と倍率範囲を決める。
- 再固定中枢を、施設・廻開始ボタン・記憶断片生成装置のどれとして扱うかを決める。
- 廻後記録や廻後アノテーションを、どのタイミングで表示するかを決める。

## 禁止

- 廻本体の実装
- 再固定中枢の実装
- 記憶断片リソースの実装
- 主人公の正体、霞の意志、旧計画の全貌の確定
- 立ち絵制作

## 成果物

- 廻本体の実装前仕様メモ
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
