# Phase 30: Ch.7 最小縦切り

状態: 実装済み（2026-05-25）。

## 目的

M9 を優先ラインへ繰り上げ、廻1後の次目標として `深層観測所` と `霞山 澪` を最小実装する。

このタスクは、Ch.7以降すべてを一度に入れるものではない。
まず、廻1後に新施設と新アイドルが自然に見え、加入・効果・記録・交流イベントまで確認できる縦切りを作る。

## 参照

- `docs/current_spec.md`
- `docs/worldbuilding.md`
- `docs/fiction/world_design.md`
- `docs/fiction/content_design.md`
- `docs/fiction/idol_profiles.md`
- `docs/fiction/records_draft.md`
- `docs/planning/ch7_plus_implementation_plan.md`
- `docs/planning/chapter_progression_design.md`
- `docs/planning/facility_progression_strategy.md`
- `docs/planning/idol_roster_expansion_design.md`

## 作業

- `src/content/facilities.ts` に `deepLayerObservatory` を追加する。
  - 表示名: 深層観測所
  - tags: `["deep"]`
  - 解放条件: `meguri.count >= 1` かつ `restabilizationCore` Lv3
- `src/content/idols.ts` に `kasumiyamaMio` を追加する。
  - 表示名: 霞山 澪
  - 解放条件: `meguri.count >= 1` かつ `deepLayerObservatory` Lv1
  - 効果: deepタグ施設の灯るさ生産 x1.35
  - 立ち絵は必須にしない。
- Ch.7入口の記録を1〜2件追加する。
  - 例: 深層観測所・前室報告、澪・霞の観測記録。
  - revealLevel は technical / deep を慎重に選ぶ。
- 澪の通常交流イベントを1件追加する。
  - 交流5相当を基本にする。
  - 本文は、澪が廻を理解している断定ではなく、霞を観測対象として扱う距離感に留める。
- `docs/current_spec.md`、`docs/manual_qa_checklist.md`、product / planning の関連箇所を同期する。
- 旧セーブ正規化は既存の ID 一覧補完で足りるため、`SAVE_VERSION` は変更しない。

## 禁止

- Ch.8以降の施設を同時実装しない。
- 七城 皐月、白霧 燐を実装しない。
- 燐の名前を、正史で予定された範囲を超えて人物として出さない。
- 主人公の正体、霞の意志、旧計画の全貌を確定しない。
- 大規模なUI再構成をしない。
- 新しい `chapter` 保存フィールドを、このタスクのついでに追加しない。

## 受け入れ条件

- 廻0では、深層観測所と霞山 澪が通常UIに表示されない。
- 廻1後、再固定中枢 Lv3 で深層観測所が表示される。
- 深層観測所 Lv1 で霞山 澪に声をかけられる。
- 澪加入後、deepタグ施設だけに倍率が乗る。
- 澪の交流5イベントを読める。
- 交流イベント読了で、灯るさ、生産量、交流値が予期せず変化しない。
- 既存セーブから読み込んでも、新しい施設・アイドル・記録・イベントの欠損でクラッシュしない。

## 検証

通常の確認:

```sh
npm.cmd run test
npm.cmd run check:content
npm.cmd run build
```

実ブラウザQA:

- `window.__NEON_DEBUG__` で廻0状態を作り、深層観測所と澪が非表示であることを確認する。
- `window.__NEON_DEBUG__` で廻1 + 再固定中枢 Lv3 状態を作り、深層観測所が見えることを確認する。
- 深層観測所 Lv1 + 澪 交流5 状態を作り、澪の加入と交流イベント読了を確認する。
- コンソールエラーがないことを確認する。
