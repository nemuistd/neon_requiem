# Phase 22: GameState.idols 基盤実装

## 目的

アイドル交流MVPのために、アイドル個別状態をGameStateへ追加する。

## 作業

### 1. GameState拡張

```ts
type IdolState = {
  bond: number;
  eventIdsRead: string[];
};

type GameState = {
  ...
  idols: Record<IdolId, IdolState>;
}
```

### 2. 初期状態

- `createInitialIdols()` を追加。
- 全アイドル `bond: 0`, `eventIdsRead: []`。

### 3. storage正規化

- 旧セーブに `idols` がなくても補完する。
- 不正なbondは0へ正規化。
- `eventIdsRead` が配列でない場合は空配列へ。
- `SAVE_VERSION` を9へ上げるか判断する。セーブ構造が変わるため、原則9を推奨。

### 4. debug save更新

READMEやdocsのデバッグセーブ例を必要に応じて更新する。

### 5. テスト

- 新規状態で全アイドルbond 0。
- 旧セーブ正規化でidolsが補完される。
- 不正セーブでクラッシュしない。

## 禁止

- ライブ時bond加算はまだ行わない。
- UI表示はまだ行わない。
- 交流メモはまだ追加しない。

## 検証

```sh
npm run build
npm run check:content
npm run test
```
