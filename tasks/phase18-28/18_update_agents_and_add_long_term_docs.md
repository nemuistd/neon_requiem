# Phase 18: AGENTS更新と長期方針docs追加

## 目的

ChatGPTとの会話で共有された長期方針を、Codexが参照可能なリポジトリ内docsとして固定する。
このPRでは実装コードを変更しない。

## 作業

### 1. AGENTS.md更新

AGENTS.mdに以下を追加・修正する。

- AGENTS.md内の「初期MVP」は履歴扱いであること。
- 現在仕様は `docs/current_spec.md` を優先すること。
- 世界観正史は `docs/worldbuilding.md` を優先すること。
- アイドルは将来的に10人以上へ増加する予定であること。
- 現在の3アイドルだけで物語を完結させないこと。
- 施設も多数追加される予定であること。
- 世界観の核心開示は急がず、転生 / 再固定 / 再観測後の新しい気付きとして解放してよいこと。
- 地下礼拝堂のような強い意味を持つ施設は、序盤メイン導線に組み込む前に慎重に検討すること。
- 主人公の正体、霞の意志、旧計画の全貌をCodexが勝手に確定しないこと。
- 「聖歌」を通常システム名にしないこと。

### 2. docs追加

以下のdocsを追加する。

- `docs/planning/project_long_term_direction.md`
- `docs/planning/idol_roster_expansion_design.md`
- `docs/planning/facility_progression_strategy.md`
- `docs/planning/world_reveal_and_prestige_plan.md`
- `docs/planning/phase18_plus_implementation_plan.md`

このパック内の同名ファイルをベースにしてよい。

### 3. 既存docsへのリンク

必要なら `docs/current_spec.md` またはREADMEに、上記長期方針docsへの短い導線を追加する。

## 禁止

- 実装コード変更
- 新アイドル追加
- 新施設追加
- セーブ構造変更
- 世界観の新規重大設定確定

## 検証

```sh
npm run build
npm run check:content
npm run test
```

## 報告

- 追加・更新したdocs
- AGENTS.mdで更新した要点
- 今回あえて実装しなかったこと
