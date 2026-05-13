# Codexタスク02: コンテンツ登録ヘルパー導入

## 目的

現在の `content/types.ts` では、`IdolId`、`FacilityId`、`SongId`、`RecordId` が手書きunionになっています。今後の大量追加に備え、定義配列からID型・map・orderを派生できる基盤を導入してください。

## 作業範囲

まずは施設定義だけに適用してください。全カテゴリ一括移行は避けてください。

## 実装案

`src/content/defineContent.ts` を追加し、以下のようなヘルパーを作ってください。

```ts
export function defineContent<const T extends readonly { id: string }[]>(definitions: T): T {
  return definitions;
}

export type ContentId<T extends readonly { id: string }[]> = T[number]["id"];

export function toContentMap<T extends readonly { id: string }[]>(definitions: T): Record<T[number]["id"], T[number]> {
  return definitions.reduce((map, definition) => {
    return {
      ...map,
      [definition.id]: definition
    };
  }, {} as Record<T[number]["id"], T[number]>);
}

export function toContentOrder<T extends readonly { id: string }[]>(definitions: T): T[number]["id"][] {
  return definitions.map((definition) => definition.id);
}
```

必要に応じて型安全性を改善して構いません。

## 施設への適用

`src/content/facilities.ts` を以下の思想へ変更してください。

- `FACILITY_DEFINITIONS` を `defineContent([...])` として定義する。
- `FacilityId` を `ContentId<typeof FACILITY_DEFINITIONS>` から派生する。
- `FACILITIES` を `toContentMap(FACILITY_DEFINITIONS)` から作る。
- `FACILITY_ORDER` を `toContentOrder(FACILITY_DEFINITIONS)` から作る。

`src/content/types.ts` 側にある `FacilityId` の手書きunionは削除または再エクスポートに置き換えてください。
既存importが壊れないようにしてください。

## 注意点

- 今回は施設のみ。アイドル・歌・記録は次以降に残してください。
- 既存のUI、数式、解放条件を変えないでください。
- `contentValidation.ts` が通るように更新してください。

## 完了条件

- `npm run build` 成功。
- `npm run check:content` 成功。
- 施設強化・施設解放の既存挙動が変わっていないことを説明する。
