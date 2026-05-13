# Phase 27: アイドル効果モデルrefactor

## 目的

アイドル10人以上に備え、単一 `passiveEffect` から `passiveEffects` 複数へ移行する。

## 作業

### 型変更

現在:

```ts
passiveEffect: IdolPassiveEffect;
```

将来:

```ts
passiveEffects: Effect[];
focusEffects?: Effect[];
```

ただし、既存UIの説明用に `passiveDescription` は維持してよい。

### 既存3人

既存3人の効果は変えない。

- 音羽灯里: 全灯るさ生産 x1.20
- 朝霧結: 全灯るさ生産 x1.15
- 深月詩乃: 全灯るさ生産 x1.10

### game.ts

`getGlobalMultiplierEffects` または関連関数を、Effect集約に寄せる。
必要ならidol effect用の関数を追加する。

## 注意

- このPRで新アイドルを追加しない。
- focusEffectsの実際の効果適用は後続でもよい。
- 既存バランスを変えない。

## 検証

```sh
npm run build
npm run check:content
npm run test
```
