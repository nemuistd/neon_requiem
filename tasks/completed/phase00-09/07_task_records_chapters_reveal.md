# Codexタスク07: 記録・章・開示レベル整理

## 目的

世界観の開示順を管理し、序盤に深層語が出すぎないようにするため、記録に章または開示レベルを導入してください。

## 作業内容

1. `RevealLevel` を追加してください。

```ts
export type RevealLevel = "surface" | "uncanny" | "technical" | "deep";
```

2. `RecordDefinition` に `revealLevel` を追加してください。
3. 既存記録に適切な `revealLevel` を設定してください。

目安:

- `surface`: 復興、街、ライブ、灯りが戻る
- `uncanny`: 忘却が物理的に影響している気配
- `technical`: 観測者、アンカー、認知固定率、霞曝露耐性
- `deep`: 祈念工学、聖歌、主人公の記憶封印

4. `contentValidation.ts` に以下の警告またはエラーを追加してください。
   - `surface` の記録に `祈念工学`, `アンカー`, `聖歌`, `祈念負荷` が出ていたら警告またはエラー。
   - `聖歌` が通常UI文言に出ていないか、可能な範囲で検査。
5. 記録タブに `revealLevel` を表示するかどうかは任意です。表示する場合は露骨になりすぎないラベルにしてください。

## 注意点

- 世界観の新事実を勝手に追加しない。
- 未記載の設定を確定しない。
- 既存記録の雰囲気は維持する。

## 完了条件

- 既存記録がすべて `revealLevel` を持つ。
- `npm run check:content` で開示レベルの検証が走る。
- `npm run build` 成功。
- `npm run check:content` 成功。
