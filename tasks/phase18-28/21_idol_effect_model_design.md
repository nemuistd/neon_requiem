# Phase 21: アイドル効果モデル設計

## 目的

アイドル10人以上に備えて、現在の単一 `passiveEffect` から将来の `passiveEffects` / `focusEffects` への移行設計をdocs化する。

## 作業

`docs/planning/idol_roster_expansion_design.md` または新規 `docs/planning/idol_effect_model_design.md` に以下をまとめる。

- 現在の全員全体生産倍率モデルの限界。
- `passiveEffects: Effect[]` 導入案。
- `focusEffects?: Effect[]` 導入案。
- 注目アイドルの意味を増やす方針。
- 10人以上に増やす際の効果カテゴリ。
- 実装PR分割案。

## 推奨PR分割

1. `passiveEffect` 単数を `passiveEffects` 複数へ移行。
2. 既存3人の効果は維持。
3. `focusEffects` は型だけ入れるか、後続に回す。
4. UI表示は既存の `passiveDescription` を維持し、後で整理する。

## 禁止

- このPRで実装しない。
- 既存アイドル効果を変えない。
- 新アイドル追加をしない。

## 検証

```sh
npm run build
npm run check:content
npm run test
```
