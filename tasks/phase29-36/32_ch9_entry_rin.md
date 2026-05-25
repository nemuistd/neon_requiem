# Phase 32: Ch.9 起点と白霧 燐

状態: 実装済み（2026-05-25）。

## 目的

Ch.8 の祈念工学実験跡地に続く廻2後の進行として、Ch.9 起点の `再観測拠点`、`名前のない劇場`、`白霧 燐` を最小実装する。

このタスクは Ch.9 の物語収束を実装するものではない。バインダー封書の全文解読、主人公の正体、霞の意志、旧計画の全貌は次以降のタスクで扱う。

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
- `docs/planning/meguri_system_spec.md`

## 作業

- `src/content/facilities.ts` に `reobservationBase` と `unnamedTheater` を追加する。
- `src/content/idols.ts` に `shiragiriRin` を追加する。
- Ch.9入口の記録を追加する。
  - 名前のない劇場・残響記録。
  - 燐・最初の言葉。
- 燐の通常交流イベントを1件追加する。
- `docs/current_spec.md`、`docs/manual_qa_checklist.md`、product / planning の関連箇所を同期する。
- 旧セーブ正規化は既存の ID 一覧補完で足りるため、`SAVE_VERSION` は変更しない。

## 禁止

- 廻1で白霧 燐を人物として表示しない。
- 燐を廻の証人や説明役として固定しない。
- Ch.9 収束、バインダー封書の全文解読を実装しない。
- 主人公の正体、霞の意志、旧計画の全貌を確定しない。
- 大規模なUI再構成をしない。
- 新しい `chapter` 保存フィールドを、このタスクのついでに追加しない。

## 受け入れ条件

- 廻1では、再観測拠点、名前のない劇場、白霧 燐が通常UIに表示されない。
- 廻2後、祈念工学実験跡地 Lv3 で再観測拠点が表示される。
- 再観測拠点 Lv3 で名前のない劇場が表示される。
- 名前のない劇場 Lv1 で白霧 燐に声をかけられる。
- 燐加入後、廻後の施設生産倍率と記憶断片の獲得見込みが増える。
- 名前のない劇場 Lv1 で、Ch.9入口の記録が解放される。
- 燐の交流5イベントを読める。
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

- `window.__NEON_DEBUG__` で廻1状態を作り、Ch.9施設と燐が非表示であることを確認する。
- `window.__NEON_DEBUG__` で廻2 + 祈念工学実験跡地 Lv3 状態を作り、再観測拠点が見えることを確認する。
- 再観測拠点 Lv3 + 名前のない劇場 Lv1 + 燐 交流5 状態を作り、燐の加入と交流イベント読了を確認する。
- コンソールエラーがないことを確認する。
