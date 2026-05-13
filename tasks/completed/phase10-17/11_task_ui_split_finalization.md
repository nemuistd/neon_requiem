# 11 UI分割仕上げタスク

## 目的

`src/ui/renderState.ts` に集中している描画関数を、機能別ファイルに分割する。
挙動・DOM構造・CSSは原則変更しない。

## 現状

`src/ui.ts` は互換用再エクスポートになっている。
しかし `src/ui/renderState.ts` に以下が同居している。

- renderFacilityCards
- renderIdolCards
- renderSongCards
- renderItemCards
- renderRecordCards
- renderTabs
- updateFacilityLiveValues
- updateSongLiveValues
- updateItemLiveValues
- unlock requirement text helper

## 目標ファイル構成

```txt
src/ui/
  renderState.ts
  renderFacilities.ts
  renderIdols.ts
  renderSongs.ts
  renderItems.ts
  renderRecords.ts
  renderTabs.ts
  liveValues.ts
  requirementText.ts
  format.ts
  events.ts
  setupUi.ts
  types.ts
```

## 作業内容

### renderState.ts

責務を以下に限定する。

- `renderState`
- `renderActiveTabContent`
- `getContentListClassName`
- 各タブ描画関数の呼び出し

### renderFacilities.ts

以下を移動する。

- `renderFacilityCards`
- `renderFacilityCard`
- `renderFacilityStats`
- 施設表示に必要な小ヘルパー

### renderIdols.ts

以下を移動する。

- `renderIdolCards`
- `renderIdolSwitcher`
- `renderIdolTabCards`
- `renderIdolTabCard`

### renderSongs.ts

以下を移動する。

- `renderSongCards`
- `renderSongCard`

### renderItems.ts

以下を移動する。

- `renderItemCards`
- `renderItemCard`

### renderRecords.ts

以下を移動する。

- `renderRecordCards`
- `renderRecordCard`

### renderTabs.ts

以下を移動する。

- `renderTabs`
- `getUnlockableSongCount`
- `getUnlockableItemCount`
- `getUnreadRecordNotificationCount`

### liveValues.ts

以下を移動する。

- `renderLiveValues`
- `updateFacilityLiveValues`
- `updateSongLiveValues`
- `updateItemLiveValues`

### requirementText.ts

以下を移動する。

- `getUnlockRequirementText`
- `getIdolUnlockRequirementText`
- `getUnlockRequirementTextFromRequirement`
- `isFacilityId`
- `isSongId`

必要なら `isFacilityId`, `isSongId` は別ファイルでもよい。

## 注意

- 既存の `src/ui.ts` 再エクスポートAPIは維持する。
- `main.ts` のimportは現状の分割importでもよいが、最終的に見通しのよい形にする。
- CSSクラス名は変えない。
- HTML構造を大きく変えない。
- このタスクでは新機能を追加しない。

## 完了条件

- `npm run build`
- `npm run check:content`
- 分割前後で表示と操作が変わらないことを報告する。
