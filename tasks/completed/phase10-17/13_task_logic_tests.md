# 13 ロジックテスト導入タスク

## 目的

ブラウザ手動確認に加えて、ゲームロジックの最低限の自動テストを導入する。

## 方針

最小でよい。
依存追加が必要な場合は Vitest を推奨する。
依存追加が過剰に感じられる場合は、Nodeで実行する小さなTypeScriptテストスクリプトでもよい。

## 推奨: Vitest導入

```sh
npm install -D vitest
```

`package.json` に追加:

```json
"test": "vitest run"
```

## テスト対象

### resource tests

- `createInitialState` で `resources.tomorusa` が0
- `addResource` が増やす
- 0以下の追加は状態を変えない
- `canSpendResource`
- `spendResource`

### production tests

- 初期状態の秒間生産が0
- 路地裏ステージLv1で秒間生産が増える
- `applyProduction` で灯るさが増える
- オフライン報酬が上限でcapされる

### purchase tests

- 灯るさ不足では施設強化不可
- 十分な灯るさがあれば施設強化できる
- 歌購入で灯るさが消費され、購入済みになる
- アイテム購入で灯るさが消費され、購入済みになる

### unlock tests

- 路地裏ステージLv10でネオン掲示板が解放される
- ネオン掲示板Lv10で地下礼拝堂が解放される
- 記録の解放条件が満たされる

### storage normalization tests

可能であれば `storage.ts` の純粋関数化を先に行う。
localStorage依存が強い場合は、このPRでは無理にテストしなくてよい。

## 注意

- テストのために本体ロジックを複雑にしない。
- ブラウザDOMテストはこの段階では不要。
- まず純粋関数のテストに集中する。

## 完了条件

- `npm run test` が通る。
- `npm run build` が通る。
- `npm run check:content` が通る。
- READMEまたはdocsにテストコマンドを追記する。
