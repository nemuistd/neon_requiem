# Codexタスク03: lightsからresources.tomorusaへの移行

## 目的

今後の複数資源化に備え、トップレベルの `lights` を `resources.tomorusa` に移行してください。

リリース前なので旧セーブ互換性は優先しなくて構いません。最新版セーブデータが良い形になることを優先してください。

## 方針

- 内部ID: `tomorusa`
- 表示名: `灯るさ`
- 既存の「灯りが戻る」などの雰囲気ある文言は残してよい。
- 数値資源としては `灯るさ` を使う。

## 作業内容

1. `ResourceId` と `ResourceDefinition` を追加してください。
2. `src/content/resources.ts` を追加し、少なくとも以下を定義してください。

```ts
export const RESOURCE_DEFINITIONS = defineContent([
  {
    id: "tomorusa",
    name: "灯るさ",
    description: "街や施設が霞に抗って安定している度合い。"
  }
] as const);
```

3. `GameState` を以下の方向へ変更してください。

```ts
resources: Record<ResourceId, number>;
```

4. 以下のヘルパーを追加してください。

- `createInitialResources()`
- `getResourceAmount(state, resourceId)`
- `addResource(state, resourceId, amount)`
- `spendResource(state, resourceId, amount)`
- `canSpendResource(state, resourceId, amount)`

5. 既存の `lights` 参照を `tomorusa` に置き換えてください。

対象例:

- 手動ライブ獲得
- 施設強化コスト
- 歌購入コスト
- 自動生産
- オフライン報酬
- UI表示
- READMEまたはデバッグAPIのテストセーブ例

6. `SAVE_VERSION` は `8` に上げてください。
7. 旧セーブ互換は最低限で構いません。旧形式を検出したら初期化しても構いません。ただし、壊れたセーブでアプリがクラッシュしないようにしてください。

## 注意点

- `window.__NEON_DEBUG__` は維持してください。
- 設定画面からセーブ削除できる機能は維持してください。
- `formatAmount` は流用可。
- 表示文言の全置換をやりすぎないでください。ゲーム内演出として「灯り」は使ってよいです。

## 完了条件

- 新規セーブで `resources.tomorusa` が作られる。
- ライブで灯るさが増える。
- 施設強化で灯るさが消費される。
- 歌購入で灯るさが消費される。
- オフライン報酬が動く。
- `npm run build` 成功。
- `npm run check:content` 成功。
