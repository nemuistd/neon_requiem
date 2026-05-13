# Codex 作業指示置き場

このディレクトリには、Codexへ渡すPR単位の作業指示を置く。

## 構成

- `tasks/`: これから実行する、または実行中のCodexタスク
- `tasks/completed/`: 完了済みタスク
- `archive/`: 履歴として残すが通常参照しないタスク

## 使い方

Codexに作業を依頼するときは、対象タスクファイルを1つ指定する。
複数タスクをまとめて実行しない。

各タスク完了後は以下を実行する。

```sh
npm run build
npm run check:content
npm run test