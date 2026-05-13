# Codexタスク08: UI描画ファイルの分割

## 目的

`src/ui.ts` が肥大化しているため、今後のアイテム・章・イベント追加に備えてUI描画を分割してください。

## 作業内容

以下のような分割を行ってください。厳密にこの構成でなくてもよいですが、機能別に見通しをよくしてください。

```txt
src/ui/
  setupUi.ts
  renderState.ts
  renderFacilities.ts
  renderIdols.ts
  renderSongs.ts
  renderItems.ts
  renderRecords.ts
  tabs.ts
  format.ts
  events.ts
```

既存の `src/ui.ts` は、互換用の再エクスポートにするか、段階的に小さくしてください。

## 注意点

- このタスクでは見た目やゲーム挙動を変えない。
- CSSの大規模変更はしない。
- DOM構造を大きく変えない。
- イベント取得関数が壊れないようにする。

## 完了条件

- 既存画面の見た目と挙動が維持される。
- `main.ts` のimportが整理される。
- `npm run build` 成功。
- `npm run check:content` 成功。
