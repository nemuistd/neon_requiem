# 15 Effect処理集約タスク

## 目的

現在 `game.ts` に散らばっているEffect解釈を `engine/effects.ts` 側へ集約し、今後の効果追加を楽にする。

## 現状

`Effect` 型はあるが、実際の効果解釈は主に `game.ts` の以下に直接書かれている。

- `getFacilityProductionMultiplier`
- `getManualTomorusaGain`

## 作業内容

### 1. effect収集ヘルパーを作る

`engine/effects.ts` または `engine/effectRuntime.ts` を追加する。

例:

```ts
export function getPurchasedEffects(state, definitions): Effect[]
```

ただし循環importを避けること。

### 2. 効果集計関数を作る

例:

```ts
export function getManualGainBonus(effects, resourceId): number
export function getFacilityProductionMultiplierFromEffects(effects): number
```

### 3. game.tsを薄くする

`game.ts` は、購入済み歌・購入済みアイテム・解放済みアイドルの効果を集め、engine側の集計関数を呼ぶだけにする。

### 4. 将来効果の追加準備

次の効果型を追加しやすい設計にする。

- `offline.reward.multiplier`
- `facility.production.add`
- `facility.specific.production.multiplier`
- `resource.gain.multiplier`

このPRでは新効果を実装しなくてもよい。

## 注意

- 既存効果の数値を変えない。
- 既存アイテム・歌の効果を変えない。
- 大きなDSLを作らない。
- Effect型が過度に抽象化されないようにする。

## 完了条件

- `game.ts` のEffect解釈が減る。
- 既存の歌・アイテム効果が同じ結果になる。
- `npm run build`
- `npm run check:content`
- テストがある場合は `npm run test`
