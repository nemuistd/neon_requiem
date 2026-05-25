# Ch.7以降 実装計画

## 位置づけ

この文書は、Ch.7以降の新施設・新アイドルを現在実装へ入れるための実装計画である。

正史上の施設名、アイドル名、章配置は `docs/fiction/world_design.md` と `docs/fiction/content_design.md` を優先する。
現在の実装仕様は `docs/current_spec.md` を優先する。

2026-05-25 時点で、M9 を優先実装ラインへ繰り上げ、Ch.7、Ch.8、Ch.9 起点、Ch.9 収束補強の最小縦切りを実装済み。
M8 の残り交流イベントや廻後バランス調整は保留ではなく、Ch.7〜Ch.9 通しプレイ確認と合わせて再判断する。

## 優先判断

実装順は、Ch.7 の `深層観測所` と `霞山 澪` から始め、Ch.8 の `工学記録保管区` / `祈念工学実験跡地` / `七城 皐月` を経て、Ch.9 起点の `再観測拠点` / `名前のない劇場` / `白霧 燐`、Ch.9 収束補強の `最後の名前` / `バインダー封書・全文` / オープンエンド導線へ進めた。

理由:

- Ch.7 は fiction 正史上、廻1後の最初の大型展開である。
- 既存コードには `meguri.count`、施設タグ、tag限定施設倍率、加入済みアイドル効果、記録・交流イベント基盤が揃っている。
- Ch.9 と白霧 燐を先に出すと、廻1で積むべき澪・皐月の座標が薄くなる。
- 通しバランス調整より先に、廻後の次目標を画面へ段階的に出す方が、初回廻後から廻2までの手触りを確認しやすい。

## 実装境界

この計画で決めること:

- Ch.7以降の実装順。
- 最初に入れる施設・アイドル・記録・交流イベントの最小範囲。
- 既存 `Requirement` で扱う条件と、まだ増やさない保存フィールド。
- 各実装タスクの受け入れ条件。

この計画で確定しないこと:

- 主人公の正体。
- 霞の意志。
- 旧計画の全貌。
- 白霧 燐が何をどこまで知っているかの断定。
- Ch.9 の最終演出本文。
- 大規模なUI再構成。

## 条件方針

Ch.7の最初の実装では、新しい `chapter` 保存フィールドや章フラグは追加しない。

`docs/fiction/content_design.md` には Ch.7フラグが記載されているが、現在実装では以下の既存条件で代替する。

| 対象 | 実装条件 |
| --- | --- |
| `deepLayerObservatory` | `meguri.count >= 1` かつ `restabilizationCore` Lv3 |
| `kasumiyamaMio` | `meguri.count >= 1` かつ `deepLayerObservatory` Lv1 |
| `engineeringArchive` | `meguri.count >= 1` かつ `deepLayerObservatory` Lv5 |
| `prayerEngineeringRuins` | `meguri.count >= 1` かつ `engineeringArchive` Lv5 |
| `nanashiroSatsuki` | `meguri.count >= 1` かつ `engineeringArchive` Lv3 |
| `reobservationBase` | `meguri.count >= 2` かつ `prayerEngineeringRuins` Lv3 |
| `unnamedTheater` | `reobservationBase` Lv3 |
| `shiragiriRin` | `meguri.count >= 2` かつ `unnamedTheater` Lv1 |

将来、章進行をUIや記録分類で明示する必要が出た場合にだけ、`chapter` 相当の状態を別タスクで検討する。

## 実装順

### P-M9-PLAN-19: Ch.7以降の優先繰り上げ

状態: 実施済み。

内容:

- M9 を現優先ラインへ繰り上げる。
- Ch.7からCh.9までの実装分割を明文化する。
- product backlog と task ファイルへ、次に実装する単独タスクを置く。

検証:

- docs の参照先と正史優先順が矛盾しない。
- `git diff --check`。

### P-M9-CH7-20: Ch.7 最小縦切り

状態: 実装済み。

最初に実装したコード変更。

対象:

- 施設 `deepLayerObservatory`。
- アイドル `kasumiyamaMio`。
- 霞山 澪の通常交流イベント1件。
- Ch.7入口の記録1〜2件。
- 必要な manual QA 項目。

実装方針:

- `deepLayerObservatory` は `deep` タグを持つ。
- 解放条件は `meguri.count >= 1` かつ `restabilizationCore` Lv3。
- 澪の解放条件は `meguri.count >= 1` かつ `deepLayerObservatory` Lv1。
- 澪の効果は `facility.production.multiplier.tag` で deep施設生産に限定する。
- 立ち絵は必須にしない。既存の記名札風プレースホルダーでよい。
- 新しい保存フィールドと `SAVE_VERSION` 変更は追加していない。

受け入れ条件:

- 廻0では `deepLayerObservatory` と澪がUIに表示されない。
- 廻1後、再固定中枢 Lv3 で `deepLayerObservatory` が表示される。
- `deepLayerObservatory` Lv1 で澪に声をかけられる。
- 澪加入後、deepタグ施設だけに倍率が乗る。
- 交流イベント読了で灯るさ、生産量、交流値が変化しない。
- 主人公の正体、霞の意志、旧計画の全貌を確定しない。

検証:

- `npm.cmd run test`
- `npm.cmd run check:content`
- `npm.cmd run build`
- 実ブラウザQAは、廻1状態を `window.__NEON_DEBUG__` で作り、深層観測所と澪の表示・加入・交流イベントを確認する。

### P-M9-CH7-21: Ch.7 体験補強

P-M9-CH7-20 の後に実装する。

対象候補:

- `deepLayerSilence`
- `coverlessObservationLog`
- 深層観測所 Lv2〜Lv3 で開く記録。
- 澪の交流20相当記録または通常イベント2件目。

受け入れ条件:

- Ch.7の深層感を補うが、Ch.8の祈念工学解読へ踏み込みすぎない。
- surface UIで「聖歌」を通常システム名にしない。
- deepタグ倍率が過剰に積み上がらない。

### P-M9-CH8-22: Ch.8 施設と皐月

状態: 実装済み。

対象:

- `engineeringArchive`
- `prayerEngineeringRuins`
- `nanashiroSatsuki`
- 皐月の通常交流イベント1件。
- 工学記録保管区の記録1〜2件。

受け入れ条件:

- 皐月は `engineeringArchive` Lv3 で解放される。
- 祈念工学は通常会話に入るが、全貌や旧計画の答えを確定しない。
- 皐月は説明役ではなく、分からないものを丁寧に読む役として扱う。
- 新しい保存フィールドと `SAVE_VERSION` 変更は追加していない。

### P-M9-CH8-23: Ch.8 補強

対象候補:

- `fragmentMelody`
- `sortedEngineeringFragment`
- 実験跡地の記録。
- 澪・皐月の深層接続イベント。

受け入れ条件:

- 主人公の旧計画関与は示唆に留める。
- 工学記録と夢の一致を、断定ではなく違和感として扱う。

### P-M9-CH9-24: Ch.9 起点

状態: 実装済み。

対象:

- `reobservationBase`
- `unnamedTheater`
- `shiragiriRin`
- 燐の通常交流イベント1件。
- 名前のない劇場の記録。

実装条件:

- Ch.7とCh.8の最小縦切りが実装済みである。
- 廻2までの進行がテストで作れる。

受け入れ条件:

- 燐は廻2 / Ch.9 で初めて姿と声を持つ。
- 廻1では、名前の影以上には出さない。
- 燐を廻の証人や説明役として固定しない。
- Ch.9到達後も、物語上の解決は提示しない。

### P-M9-CH9-25: Ch.9 収束補強

P-M9-CH9-24 の後に最小実装済み。

実装内容:

- 歌 `theLastName` / 「最後の名前」。
- 記録「バインダー封書・全文」。
- 記録「名前のない劇場・残響公演」。
- 廻タブの「再び灯るものへ」導線。

受け入れ条件:

- 主人公の正体、霞の意志、旧計画の全貌を単一の答えとして確定しない。
- 燐を廻の証人や説明役として固定しない。
- Ch.9到達後も、物語上の解決ではなく、続けることも再び廻ることも選べる状態に留める。
- 新しい章保存フィールドや `SAVE_VERSION` は追加せず、`meguri.count`、名前のない劇場 Lv、歌取得状態で判定する。

### P-M9-CH9-27: 燐の名前の影の先出し補強

P-M9-CH9-24 / P-M9-CH9-25 の後に再判断する補強候補。

対象候補:

- 廻1で読める記録の末尾または追記に、白霧 燐の名前の痕跡を1箇所だけ置く。
- バインダー系の追記に、本文と異なる筆跡で名前の一部が残っている程度の痕跡を置く。

受け入れ条件:

- 燐は廻2 / Ch.9 まで人物として表示しない。
- 廻1で追加するのは名前の影に留め、会話、加入、効果、交流イベントは追加しない。
- 燐を廻の証人、説明役、旧計画の答えを持つ人物として固定しない。
- 主人公の正体、霞の意志、旧計画の全貌を確定しない。
- 既存の Ch.9 起点と Ch.9 収束補強の解放条件を変えない。

## 実装時に同期する文書

コード実装を伴うタスクでは、次を同期対象にする。

- `docs/current_spec.md`
- `docs/manual_qa_checklist.md`
- `docs/product/30_milestone_roadmap.md`
- `docs/product/40_task_backlog.md`
- 必要に応じて `docs/planning/facility_progression_strategy.md`
- 必要に応じて `docs/planning/idol_roster_expansion_design.md`

## 既知の注意

- `docs/fiction/content_design.md` の効果タイプ実装状況は、現在の `src/engine/effects.ts` より古い箇所がある。実装判断は `src` と `docs/current_spec.md` を優先する。
- 新コンテンツIDを増やす場合、旧セーブ正規化が不足しないか必ずテストする。
- Ch.7以降は deep / technical の記録が増えるため、記録タブの量と分類は別途見直し候補になる。
- Ch.9 起点と収束補強は最小縦切りとして成立しているが、fiction 方針上は廻1で燐の名前の影を先出しする余地が残っている。補強する場合も、燐の人物登場は Ch.9 / 廻2以降に限定する。
