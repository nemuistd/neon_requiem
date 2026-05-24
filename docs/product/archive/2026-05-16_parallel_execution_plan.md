# Parallel Execution Plan (Archived)

> 履歴文書。2026-05-16 に実施した Product Docs 初期整備の並列作業計画を残す。
> 現在の並列実行方針は `docs/product/50_parallel_execution_plan.md` を参照する。

## 位置づけ

この文書は、[Task Backlog](../40_task_backlog.md) のタスクを、並列ユニット、write scope、合流順へ割り当てるための計画である。

ここで定義する並列ユニットは、複数エージェント、別worktree、または人間の分担作業に渡せる粒度を想定する。実際に並列実行する場合は、各ユニットが自分のwrite scopeを守り、最後にIntegration Unitが統合する。

## 実行単位一覧

| Unit | 担当 | Task ID | Write scope | 並列可否 |
| --- | --- | --- | --- | --- |
| Unit A | QA / Documentation | `P-M1-QA-01` | `docs/manual_qa_checklist.md`, 必要なら `docs/product/40_task_backlog.md` | 可 |
| Unit B | UI Copy / Initial Experience | `P-M1-COPY-02` | `src/data.ts`, 必要なら `docs/current_spec.md` | 可 |
| Unit C | Records / Reveal Layer | `P-M4-RECORD-03` | `src/content/records.ts`, 必要なら `docs/current_spec.md` | 可 |
| Unit D | Idol Interaction Design | `P-M3-IDOL-04` | `docs/planning/idol_roster_expansion_design.md`, 必要なら `docs/product/30_milestone_roadmap.md` | 可 |
| Unit E | Template / Process | `P-M5-TEMPLATE-05` | `docs/product/content_addition_acceptance_template.md`, 必要なら `docs/product/40_task_backlog.md` | 可 |
| Integration Unit | 統合レビュー | `P-INTEGRATE-06` | `docs/product/40_task_backlog.md`, `docs/product/50_parallel_execution_plan.md`, 必要な同期先 | 不可 |

## 並列実行ルール

- Unit A、B、C、D、Eは同時に開始できる。
- Unit BとUnit Cは並列可だが、両方が文言トーンに影響するため、合流後にIntegration Unitが確認する。
- Unit AとUnit Eはどちらもproduct/QA文書に近いが、主なwrite scopeが異なるため並列可。`docs/product/40_task_backlog.md` を同時に触る必要が出た場合はIntegration Unitへ回す。
- Unit Dはplanning docs中心のため、ほかのユニットと並列可。
- Integration Unitは、すべてのユニットが完了してから実行する。

## 合流順

1. Unit A、B、C、D、Eを並列実行する。
2. Unit BとUnit Cの成果を先に確認し、UI文言と記録文言のトーン差を調整する。
3. Unit AのQA項目が、Unit B/Cの変更を確認できる内容になっているか確認する。
4. Unit Dの交流イベント設計が、Unit B/Cの文言や記録方針と矛盾していないか確認する。
5. Unit Eのテンプレートが、Unit A-Dの受け入れ条件を再利用できる形になっているか確認する。
6. Integration Unitが旧参照、上位文書との矛盾、必要な検証コマンドを確認する。

## 実施結果

2026-05-16に、Unit A-EとIntegration Unitを実施した。

| Unit | Task ID | 結果 |
| --- | --- | --- |
| Unit A | `P-M1-QA-01` | 初回3分導線QAを `docs/manual_qa_checklist.md` に追加。 |
| Unit B | `P-M1-COPY-02` | `src/data.ts` の序盤メッセージを最小改善。 |
| Unit C | `P-M4-RECORD-03` | 記録を点検し、深層語の出現レイヤーに問題なし。本文修正なし。 |
| Unit D | `P-M3-IDOL-04` | `docs/planning/idol_roster_expansion_design.md` に交流イベント最小仕様を追加。 |
| Unit E | `P-M5-TEMPLATE-05` | `docs/product/content_addition_acceptance_template.md` を追加。 |
| Integration Unit | `P-INTEGRATE-06` | 旧参照、文書参照、検証コマンドを確認。 |

実行した確認:

- UTF-8読み取り。
- 旧参照検索。
- `rg` による `bond` / `eventIdsRead` / 深層語確認。
- `npm.cmd run check:content`
- `npm.cmd run test`
- `npm.cmd run build`

## Unit A: QA / Documentation

Task ID:

- `P-M1-QA-01`

作業内容:

- 初回3分導線QAを既存チェックリストへ落とす。
- 既存QA項目と重複する場合は、初回3分用の小さな節として整理する。

禁止:

- ゲーム実装を変更しない。
- UI文言を直接変更しない。

完了条件:

- 初回3分で確認する操作と期待結果が明文化されている。
- UTF-8でQA文書を読める。

## Unit B: UI Copy / Initial Experience

Task ID:

- `P-M1-COPY-02`

作業内容:

- 初期メッセージ、灯るさ説明、ライブ時/施設強化時/歌取得時/アイテム購入時の文言を点検する。
- 必要な場合だけ、最小限の文言改善を行う。

禁止:

- ゲームロジックや数値バランスを変更しない。
- 新しい深層語を序盤UIに追加しない。

完了条件:

- 灯るさが街や施設の安定と結びついて読める。
- 所有や搾取に見える表現がない。
- 必要な確認コマンドが実行されている。

## Unit C: Records / Reveal Layer

Task ID:

- `P-M4-RECORD-03`

作業内容:

- 既存記録の `revealLevel` と深層語の出し分けを点検する。
- 必要な場合だけ、記録文言または `revealLevel` を最小限調整する。

禁止:

- 主人公の正体、霞の意志、旧計画の全貌を確定しない。
- `surface` に祈念工学、アンカー、聖歌、祈念負荷を入れない。

完了条件:

- `worldbuilding.md` と矛盾しない。
- `npm.cmd run check:content` が通る。
- 記録解放条件やテストに触れた場合は `npm.cmd run test` が通る。

## Unit D: Idol Interaction Design

Task ID:

- `P-M3-IDOL-04`

作業内容:

- アイドル交流イベントの最小仕様を設計文書化する。
- `bond`、`eventIdsRead`、将来のイベント解放条件の関係を整理する。

禁止:

- 交流イベントをこのタスクで実装しない。
- 初期3アイドルだけで物語を閉じる設計にしない。

完了条件:

- 交流イベントの役割が、効率、居場所、物語上の意味のどれに属するか整理されている。
- `docs/planning/idol_roster_expansion_design.md` と既存 `bond` 実装に矛盾しない。

## Unit E: Template / Process

Task ID:

- `P-M5-TEMPLATE-05`

作業内容:

- 新規コンテンツ追加時の受け入れ条件テンプレートを作る。
- 施設、歌、アイテム、アイドル、記録を追加する時の確認項目を整理する。

禁止:

- 新規コンテンツをこのタスクで実装しない。
- テンプレートを実装タスクの詳細設計で埋めすぎない。

完了条件:

- 新規コンテンツが、何を増やし、何を戻し、どんな判断や気持ちの変化を生むか確認できる。
- `current_spec.md`、`worldbuilding.md`、`planning/` との同期条件が含まれている。

## Integration Unit

Task ID:

- `P-INTEGRATE-06`

作業内容:

- Unit A-Eの成果を統合レビューする。
- 旧参照、文言トーン、上位文書との矛盾、必要な検証コマンドを確認する。
- 必要なら [Feedback Loop](../90_feedback_loop.md) に従って上位文書へ戻る。

完了条件:

- 旧参照が残っていない。
- Product Charter、Experience Requirements、worldbuilding、current_spec と矛盾していない。
- 必要な検証コマンドまたは手動確認が実行されている。

確認コマンド:

```sh
rg "20_[i]mplementation_task_plan|docs/[p]roduct_charter|(^|[^0-9A-Za-z_])[p]roduct_charter\\.md" README.md AGENTS.md docs
rg "docs/product/|50_parallel_execution_plan|P-M1|P-M3|P-M4|P-M5" README.md AGENTS.md docs
npm.cmd run check:content
```

UI表示やビルド構成に触れた場合は、追加で以下を実行する。

```sh
npm.cmd run build
```
