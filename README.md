# NEON REQUIEM

NEON REQUIEM は、地下都市・ネオン・歌・アイドルをモチーフにした、ブラウザ向けの静的インクリメンタルゲームです。

プレイヤーは、地下都市で歌うアイドルたちを支え、ライブによって灯りを集め、壊れかけた区画を少しずつ復興していきます。

現在は MVP v0.1 を土台に、Phase 2 の拡張として 3アイドル・2施設・歌アップグレード・記録に対応しています。

## 実装済みの機能

- 「ライブする」ボタンによる手動灯り獲得
- 基本リソース「灯り」
- アイドル「音羽 灯里」「深月 詩乃」「朝霧 結」
- 注目アイドル枠とアイドル切替
- 解放済みアイドルによる全体パッシブ効果
- 未解放アイドルの解放条件表示
- 施設「路地裏ステージ」と「地下礼拝堂」
- 施設ごとの解放条件と強化
- 施設による灯りの自動生産
- 歌タブと、1回購入型の恒久アップグレード
- 記録タブと、進行条件で解放される読み物
- 記録の既読状態保存
- 経過時間に基づく自動生産
- `localStorage` による保存・読み込み
- v1/v2/v3/v4/v5/v6 セーブデータから v7 セーブデータへの移行
- 最終保存時刻に基づく簡易オフライン報酬
- コンテンツ定義の整合性チェック
- 上部操作パネル、メッセージバー、注目アイドル枠、復興区画パネルのUI構成
- GitHub Pages 用の Vite 相対パス設定
- GitHub Actions による GitHub Pages デプロイ workflow
- Console から使う開発用デバッグAPI

## 現在の主な数式

- 路地裏ステージ強化コスト: `floor(10 * 1.15 ^ level)`
- 路地裏ステージ生産量: `level * 0.1 灯り / 秒`
- 地下礼拝堂強化コスト: `floor(100 * 1.2 ^ level)`
- 地下礼拝堂生産量: `level * 0.5 灯り / 秒`
- 音羽 灯里パッシブ: 全灯り生産 `x1.20`
- 深月 詩乃パッシブ: 全灯り生産 `x1.10`
- 朝霧 結パッシブ: 全灯り生産 `x1.15`
- 路地裏のイントロ: ライブ1回の灯り `+1`
- 礼拝堂のハーモニー: 施設の灯り生産 `x1.10`
- 薄明のコーラス: 施設の灯り生産 `x1.25`
- オフライン報酬: `現在の秒間灯り量 * 離れていた秒数`

## ローカル起動方法

依存関係をインストールします。

```sh
npm install
```

開発サーバーを起動します。

```sh
npm run dev
```

表示されたローカル URL をブラウザで開いてください。通常は以下です。

```text
http://localhost:5173/
```

## ビルド方法

本番用ファイルを生成します。

```sh
npm run build
```

生成物は `dist/` に出力されます。

コンテンツ定義の整合性を確認します。

```sh
npm run check:content
```

ビルド結果をローカルで確認する場合は、以下を実行します。

```sh
npm run preview
```

## GitHub Pages

GitHub Pages 公開用に `.github/workflows/deploy.yml` を用意しています。

workflow は `npm ci`、`npm run build`、`upload-pages-artifact`、`deploy-pages` を使って `dist/` を公開します。

Vite 設定では `base: "./"` を使っており、リポジトリ名が変わってもビルド後のアセットを相対パスで読み込めるようにしています。

## 手動確認チェックリスト

- アプリがローカルで起動する。
- 新規セーブで灯りが 0 から始まる。
- 「ライブする」を押すと灯りが 1 増える。
- 灯り 10 で路地裏ステージを強化できる。
- 路地裏ステージ Lv 10 到達前は、地下礼拝堂と深月 詩乃が未解放として表示される。
- 未解放アイドルに解放条件が表示される。
- 路地裏ステージ Lv 10 到達後、地下礼拝堂と深月 詩乃が解放される。
- 深月 詩乃を注目アイドルに切り替えられる。
- 地下礼拝堂 Lv 5 到達前は、朝霧 結が未解放として表示される。
- 地下礼拝堂 Lv 5 到達後、朝霧 結が解放される。
- 朝霧 結を注目アイドルに切り替えられる。
- 歌タブを開ける。
- 路地裏ステージ Lv 5 かつ 100 灯りで「路地裏のイントロ」を取得できる。
- 「路地裏のイントロ」取得後、ライブ1回の獲得灯りが 2 になる。
- 地下礼拝堂 Lv 1 かつ 500 灯りで「礼拝堂のハーモニー」を取得できる。
- 地下礼拝堂 Lv 5 かつ 2000 灯りで「薄明のコーラス」を取得できる。
- 生産倍率系の歌を取得すると秒間灯り量が増える。
- 記録タブを開ける。
- 初期解放の記録が読める。
- 施設Lvや歌取得に応じて記録が解放される。
- 記録を読むと既読になり、リロード後も既読が残る。
- 記録を読んでも灯りや生産量は変化しない。
- 施設強化時に灯りが消費され、秒間灯り量が増える。
- クリックしなくても時間経過で灯りが増える。
- ページ再読み込み後も灯りと施設 Lv が残る。
- 離れていた時間に応じてオフライン灯りが加算される。
- オートセーブが通常通り動くが、メインメッセージを上書きしない。
- Console の `window.__NEON_DEBUG__` でテスト用セーブを投入できる。

## 開発用デバッグAPI

ゲーム画面の Console から以下を使えます。

セーブデータを削除してリロード:

```js
window.__NEON_DEBUG__.resetSave()
```

初期状態のテストセーブを書き込んでリロード:

```js
window.__NEON_DEBUG__.setSaveForTest({
  saveVersion: 7,
  lights: 0,
  activeIdolId: "otowaAkari",
  recordTabLastSeenContentVersion: 0,
  facilities: {
    alleyStage: { level: 0 },
    undergroundChapel: { level: 0 }
  },
  songs: {
    rojiuraIntro: { purchased: false },
    chapelHarmony: { purchased: false },
    twilightChorus: { purchased: false }
  },
  records: {
    alleyStageRestorationMemo: { read: false },
    lightResponseObservation: { read: false },
    undergroundChapelRestorationReport: { read: false },
    songAndHymnDistinction: { read: false },
    mistAndAnchorFacilityLog: { read: false }
  },
  lastSavedAt: Date.now()
})
```

解放済み状態のテストセーブを書き込んでリロード:

```js
window.__NEON_DEBUG__.setSaveForTest({
  saveVersion: 7,
  lights: 3000,
  activeIdolId: "mizukiShino",
  recordTabLastSeenContentVersion: 0,
  facilities: {
    alleyStage: { level: 10 },
    undergroundChapel: { level: 5 }
  },
  songs: {
    rojiuraIntro: { purchased: true },
    chapelHarmony: { purchased: true },
    twilightChorus: { purchased: false }
  },
  records: {
    alleyStageRestorationMemo: { read: true },
    lightResponseObservation: { read: false },
    undergroundChapelRestorationReport: { read: false },
    songAndHymnDistinction: { read: false },
    mistAndAnchorFacilityLog: { read: false }
  },
  lastSavedAt: Date.now()
})
```

このAPIは、テスト用セーブを書き込む直前/直後に通常の自動保存や `beforeunload` 保存で上書きされないようにしています。

## 既知の制限

- リソースは「灯り」1種類のみです。
- 右側タブのうち、現在は復興区画、歌、アイドル、記録が実質的な表示対象です。
- 詳細ボタンは未実装です。
- オフライン報酬は最大12時間分まで加算されます。将来的に転生機能で上限拡張を検討しています。
- セーブデータ破損時の詳細な復旧 UI はありません。
- 音声、ストーリーシステムは未実装です。
- モバイル向けの本格的な最適化はまだ行っていません。

## 今後の開発予定

- アイテムタブの実装
- 歌アップグレードの追加とバランス調整
- アイドルごとの交流イベント追加
- 復旧報告・観測記録の追加
- ゲームバランス調整
- ビジュアル、立ち絵、短いフレーバーテキストの改善

