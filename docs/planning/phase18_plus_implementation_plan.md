# Phase 18以降 実装計画

## 方針

実ブラウザQAの運用方針はAGENTS.mdに追記済みであり、当面は各PRの検証手順として扱う。

Phase 18以降では、まず会話由来の長期前提をリポジトリ内docsへ固定する。
その後、アイドル10人以上・施設多数・転生後開示に耐える基盤を整える。

## Phase 18: 長期方針docsとAGENTS更新

- AGENTS.mdを現在仕様・長期方針に合わせて更新。
- `project_long_term_direction.md`
- `idol_roster_expansion_design.md`
- `facility_progression_strategy.md`
- `world_reveal_and_prestige_plan.md`
- `phase18_plus_implementation_plan.md`

## Phase 19: アイドルロスター拡張設計

- 現在3人をプロローグ組として整理。
- 追加アイドルのカテゴリを設計。
- 10人以上でも破綻しない役割分類を決める。
- 全員を全体倍率にしない方針を明記。

## Phase 20: 施設進行戦略

- 施設カテゴリを整理。
- 地下礼拝堂の位置づけを慎重に扱う。
- 薄明通り、記憶施設、深層施設、転生後施設の導線を設計。

## Phase 21: アイドル効果モデル設計

- `passiveEffect` 単数から `passiveEffects` 複数へ移行する計画。
- `focusEffects` は型や検証上の余地として扱い、進行効率差を作る注目効果は保留する。
- この段階では実装せず、設計を固める。

## Phase 22: GameState.idols 基盤

- `GameState` にアイドル個別状態を追加。
- `bond` と `eventIdsRead` を持たせる。
- SAVE_VERSION更新を検討。
- storage正規化とテストを追加。

## Phase 23: ライブによるbond加算

- 注目アイドルでライブするとbond +1。
- 自動生産では増やさない。
- 既存の灯るさ獲得量を変えない。

## Phase 24: bond UI表示

- 注目アイドル枠に交流値を表示。
- アイドルタブに交流値を表示。
- 詳細ボタンはまだ無効のままでもよい。

## Phase 25: idol.bond Requirement

- Requirementに `idol.bond` を追加。
- contentValidation対応。
- ロジックテスト追加。

## Phase 26: 交流メモ追加

- 音羽灯里、朝霧結、深月詩乃に短い交流メモを追加。
- ただし世界観核心は解決しない。
- 今後10人以上へ拡張できる命名にする。

## Phase 27: アイドル効果モデルrefactor

- `passiveEffect` → `passiveEffects`
- `focusEffects` は型だけに留め、注目アイドル限定の数値効果は実装しない
- 既存効果は維持。
- 10人以上追加前の基盤にする。

## Phase 28: 次施設・章進行設計

- 薄明通り案内所など、地下礼拝堂前に挟める施設を設計。
- 章進行、ファン資源、転生後開示との接続を検討。
- 詳細は `chapter_progression_design.md` と `next_facility_candidates.md` を参照する。

## Phase 29: 廻本体仕様検討

- 地下通路修復区画までは最小実装済み。
- 次の `再固定中枢` は廻本体の起点になる。
- 基本方針は `docs/planning/meguri_system_spec.md` に整理済み。
- 実装前に、記憶断片の具体的な算出式、初期廻後バフ、バフと記録アノテーションの対応表、廻実行前の獲得見込み表示を詰める。
