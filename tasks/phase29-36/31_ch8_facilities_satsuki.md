# Phase 31: Ch.8 施設と皐月

状態: 実装済み（2026-05-25）。

## 目的

Ch.7 の深層観測所に続く廻1後の進行として、Ch.8 の `工学記録保管区`、`祈念工学実験跡地`、`七城 皐月` を最小実装する。

このタスクは Ch.9 収束を実装するものではない。白霧 燐、名前のない劇場、バインダー全文解読は次以降のタスクで扱う。

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

## 作業

- `src/content/facilities.ts` に `engineeringArchive` と `prayerEngineeringRuins` を追加する。
- `src/content/idols.ts` に `nanashiroSatsuki` を追加する。
- Ch.8入口の記録を追加する。
  - 祈念工学・記録断片。
  - 実験跡地・現地調査報告。
- 皐月の通常交流イベントを1件追加する。
- `docs/current_spec.md`、`docs/manual_qa_checklist.md`、product / planning の関連箇所を同期する。
- 旧セーブ正規化は既存の ID 一覧補完で足りるため、`SAVE_VERSION` は変更しない。

## 禁止

- 白霧 燐を実装しない。
- Ch.9 収束、名前のない劇場、バインダー封書の全文解読を実装しない。
- 主人公の正体、霞の意志、旧計画の全貌を確定しない。
- 大規模なUI再構成をしない。
- 新しい `chapter` 保存フィールドを、このタスクのついでに追加しない。

## 受け入れ条件

- 廻0では、工学記録保管区、祈念工学実験跡地、七城 皐月が通常UIに表示されない。
- 廻1後、深層観測所 Lv5 で工学記録保管区が表示される。
- 工学記録保管区 Lv3 で七城 皐月に声をかけられる。
- 皐月加入後、歌とアイテムの取得コストが下がる。
- 工学記録保管区 Lv5 で祈念工学実験跡地が表示される。
- 皐月の交流5イベントを読める。
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

- `window.__NEON_DEBUG__` で廻0状態を作り、Ch.8施設と皐月が非表示であることを確認する。
- `window.__NEON_DEBUG__` で廻1 + 深層観測所 Lv5 状態を作り、工学記録保管区が見えることを確認する。
- 工学記録保管区 Lv3 + 皐月 交流5 状態を作り、皐月の加入と交流イベント読了を確認する。
- コンソールエラーがないことを確認する。
