# 14 コンテンツID派生の横展開タスク

## 目的

施設だけでなく、アイドル、歌、アイテム、記録、資源も `defineContent` 方式へ寄せる。

## 現状

施設は `FACILITY_DEFINITIONS` から `FACILITIES` と `FACILITY_ORDER` を派生している。
一方、`types.ts` には `IdolId`, `SongId`, `ItemId`, `RecordId` が手書きunionとして残っている。

## 作業方針

段階的に行う。

1. アイテム
2. 歌
3. 資源
4. 記録
5. アイドル

循環importが起きそうな場合は、無理に一括移行しない。

## 目標

各contentファイルで以下の形を目指す。

```ts
export const ITEM_DEFINITIONS = defineContent([...]);
export type ItemId = ContentId<typeof ITEM_DEFINITIONS>;
export const ITEMS = toContentMap(ITEM_DEFINITIONS);
export const ITEM_ORDER = toContentOrder(ITEM_DEFINITIONS);
```

## 注意

- `content/types.ts` と各contentファイルの循環importに注意。
- 必要なら型を以下のように分離する。
  - `content/baseTypes.ts`
  - `content/idTypes.ts`
  - `content/types.ts`
- 既存の `definitions.ts` の外部APIは維持する。
- `GameState` の型が壊れないようにする。
- `contentValidation.ts` が通ること。

## 完了条件

- 手書きID unionが可能な範囲で削減される。
- 少なくとも item/song/resource は派生型になる。
- 施設・歌・アイテム・記録・アイドルの挙動が変わらない。
- `npm run build`
- `npm run check:content`
- テストがある場合は `npm run test`
