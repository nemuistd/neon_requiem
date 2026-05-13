# Phase 23: ライブによるbond加算

## 目的

注目アイドル状態で「ライブする」を押したとき、対象アイドルのbondを増やす。

## 作業

- `gainManualTomorusa` とは別に、または統合して、手動ライブ時にbond +1する。
- 自動生産ではbondを増やさない。
- 未解放アイドルには注目切替できない既存仕様を維持する。
- 注目アイドルが何らかの理由で未解放なら `resolveActiveIdolId` 後のアイドルに加算する。
- 既存の灯るさ獲得量は変えない。

## 実装候補

```ts
function gainActiveIdolBond(state: GameState, amount = 1): GameState
```

または

```ts
function performManualLive(state: GameState): GameState
```

`performManualLive` を導入する場合は、灯るさ獲得とbond加算を1つのユーザー行動として扱う。

## テスト

- 初期状態でライブすると音羽灯里bond +1。
- 注目アイドルを朝霧結にしてライブすると朝霧結bond +1。
- 灯るさ獲得量は変わらない。
- 自動生産ではbondが増えない。

## 禁止

- UI表示追加はまだしない。
- 交流メモ追加はまだしない。
- 新アイドル追加はしない。

## 検証

```sh
npm run build
npm run check:content
npm run test
```

必要に応じて実ブラウザQAも行う。
