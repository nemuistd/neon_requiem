# Phase 25: idol.bond Requirement追加

## 目的

交流値を記録解放条件に使えるようにする。

## 作業

### Requirement追加

```ts
{ type: "idol.bond"; idolId: string; amount: number }
```

### 評価

- `state.idols[idolId]?.bond >= amount`

### contentValidation

- idolIdが存在すること。
- amountが正の有限数であること。

### UI表示

Requirement表示で以下のように出す。

```text
音羽 灯里 交流 5
```

## テスト

- bond条件が満たされる。
- bond不足では満たされない。
- all/any/not内でも動く。
- contentValidationが不正idolIdを検出する。

## 禁止

- このPRでは交流メモ追加をしない。
- 新アイドル追加をしない。

## 検証

```sh
npm run build
npm run check:content
npm run test
```
