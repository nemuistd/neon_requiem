# Codex 作業指示置き場

このディレクトリには、Codexへ渡すPR単位の作業指示を置く。

現在の次候補は `tasks/phase29-36/34_ch7_ch9_balance_pass.md`。Ch.7〜Ch.9 収束補強までの最小縦切りを通し確認し、廻後バランスを小さく調整するためのタスクである。

## 構成

- `tasks/phase*/`: これから実行する、または履歴として残っているCodexタスク
- `tasks/completed/`: 完了済みタスク
- `docs/product/40_task_backlog.md`: 現在の優先候補と完了済みタスク概要

phase ディレクトリ内には過去に実行済みの指示も残っている。実行対象を選ぶ時は、各タスクファイルの状態記述と `docs/product/40_task_backlog.md` を確認する。

## 使い方

Codexに作業を依頼するときは、対象タスクファイルを1つ指定する。
複数タスクをまとめて実行しない。

各タスク完了後は以下を実行する。

```sh
npm run build
npm run check:content
npm run test
```
