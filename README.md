# NEON REQUIEM

NEON REQUIEM は、地下都市・ネオン・歌・アイドルをモチーフにした、ブラウザ向けの静的インクリメンタルゲームです。

プレイヤーは、地下都市で歌うアイドルたちを支え、ライブによって灯りを集め、壊れかけた区画を少しずつ復興していきます。

現在は MVP v0.1 を土台に、Phase 2 以降の拡張として 7アイドル・11施設・歌アップグレード・アイテム・記録に対応しています。

## 世界観・用語体系

プロダクト方針から要件・設計・タスク候補へ段階的に落とす文書群は [docs/product/](docs/product/) に置いています。世界観と用語体系は [docs/worldbuilding.md](docs/worldbuilding.md)、承認済みの物語・コンテンツ正史は [docs/fiction/](docs/fiction/) を基準にします。現在の実装仕様は [docs/current_spec.md](docs/current_spec.md)、手動確認手順は [docs/manual_qa_checklist.md](docs/manual_qa_checklist.md) に整理しています。
長期方針と未実装計画は [docs/planning/](docs/planning/) に置いています。

- 「聖歌」は通常システム名ではなく、危険な深層用語として扱います。
- `docs/fiction/world_design.md` で定義された「廻（めぐり）」は正式システム名として扱います。
- 今後は、歌アップグレードの通常名として「楽曲」「公演」「演目」「アップグレード」などを検討します。
- 地下礼拝堂は削除せず、名前の記録壁の後に出る中盤以降の深層施設として扱います。
- 序盤では深層語を出しすぎず、表向きにはアイドル拠点運営・復興ゲームとして始めます。

## 実装済みの機能

- 「ライブする」ボタンによる手動灯るさ獲得
- ライブ時の注目アイドル `bond` 加算
- 基本リソース「灯るさ」
- アイドル「音羽 灯里」「朝霧 結」「響木 遠子」「深月 詩乃」「紙野 巡」「陽向 小春」「継ノ端 桜子」
- 注目アイドル枠とアイドル切替
- 注目アイドル枠とアイドルタブでの交流値表示
- 解放済みアイドルによる全体パッシブ効果
- 未解放アイドルの解放条件表示
- 施設「路地裏ステージ」「ネオン掲示板」「薄明通り案内所」「仮設配信ブース」「記憶図書館」「録音保管庫」「古い放送室」「地下広場」「名前の記録壁」「地下礼拝堂」「地下通路修復区画」
- 施設ごとの解放条件と強化
- 施設による灯るさの自動生産
- 歌タブと、1回購入型の恒久アップグレード
- アイテムタブと、購入済み状態が保存される最小アイテム
- 記録タブと、進行条件で解放される読み物
- 記録の既読状態保存
- 経過時間に基づく自動生産
- `localStorage` による保存・読み込み
- v1〜v8 セーブデータから v9 セーブデータへの移行
- 最終保存時刻に基づく簡易オフライン報酬
- コンテンツ定義の整合性チェック
- 上部操作パネル、メッセージバー、注目アイドル枠、復興区画パネルのUI構成
- GitHub Pages 用の Vite 相対パス設定
- GitHub Actions による GitHub Pages デプロイ workflow
- Console から使う開発用デバッグAPI

## 現在の主な数式

- 路地裏ステージ強化コスト: `floor(10 * 1.15 ^ level)`
- 路地裏ステージ生産量: `level * 0.1 灯るさ / 秒`
- ネオン掲示板強化コスト: `floor(80 * 1.18 ^ level)`
- ネオン掲示板生産量: `level * 0.35 灯るさ / 秒`
- 薄明通り案内所強化コスト: `floor(3000 * 1.22 ^ level)`
- 薄明通り案内所生産量: `level * 3 灯るさ / 秒`
- 仮設配信ブース強化コスト: `floor(5000 * 1.22 ^ level)`
- 仮設配信ブース生産量: `level * 4 灯るさ / 秒`
- 記憶図書館強化コスト: `floor(15000 * 1.25 ^ level)`
- 記憶図書館生産量: `level * 8 灯るさ / 秒`
- 録音保管庫強化コスト: `floor(12000 * 1.23 ^ level)`
- 録音保管庫生産量: `level * 6 灯るさ / 秒`
- 古い放送室強化コスト: `floor(26000 * 1.24 ^ level)`
- 古い放送室生産量: `level * 11 灯るさ / 秒`
- 地下広場強化コスト: `floor(20000 * 1.25 ^ level)`
- 地下広場生産量: `level * 10 灯るさ / 秒`
- 名前の記録壁強化コスト: `floor(45000 * 1.26 ^ level)`
- 名前の記録壁生産量: `level * 14 灯るさ / 秒`
- 地下礼拝堂強化コスト: `floor(900 * 1.25 ^ level)`
- 地下礼拝堂生産量: `level * 1 灯るさ / 秒`
- 地下通路修復区画強化コスト: `floor(60000 * 1.28 ^ level)`
- 地下通路修復区画生産量: `level * 20 灯るさ / 秒`
- 音羽 灯里パッシブ: 全灯るさ生産 `x1.20`
- 深月 詩乃パッシブ: 全灯るさ生産 `x1.10`
- 朝霧 結パッシブ: 全灯るさ生産 `x1.15`
- 響木 遠子パッシブ: ライブ1回の灯るさ獲得に全施設合計の秒間灯るさ `x0.05` を加算
- 紙野 巡パッシブ: 全アイドルの交流増加量 `x1.25`
- 陽向 小春パッシブ: 全灯るさ生産 `x1.08`、アイテム購入コスト `x0.90`
- 継ノ端 桜子パッシブ: オフライン灯るさ報酬 `x1.15`
- 路地裏のイントロ: 80 灯るさ、ライブ1回の灯るさ `+1`
- 配信前夜のアカペラ: 6000 灯るさ、ライブ1回の灯るさ `+8`
- 記録の歌: 20000 灯るさ、施設の灯るさ生産 `x1.15`
- 広場のアンセム: 30000 灯るさ、ライブ1回の灯るさ獲得に全施設合計の秒間灯るさ `x0.08` を加算
- 礼拝堂のハーモニー: 450 灯るさ、施設の灯るさ生産 `x1.10`
- 薄明のコーラス: 1800 灯るさ、施設の灯るさ生産 `x1.25`
- 修復の仮歌: 80000 灯るさ、オフライン灯るさ報酬 `x1.10`
- 古いネオン管: 100 灯るさ、施設の灯るさ生産 `x1.05`
- 手書きの告知ポスター: 140 灯るさ、ライブ1回の灯るさ `+1`
- 半券の束: 220 灯るさ、ライブ1回の灯るさ `+1`
- 携帯スポットライト: 260 灯るさ、施設の灯るさ生産 `x1.04`
- 録音済みの短い挨拶: 600 灯るさ、施設の灯るさ生産 `x1.03`
- 交代用連絡ボード: 500 灯るさ、オフライン灯るさ報酬 `x1.10`
- 古い電波塔の残骸: 3000 灯るさ、ライブ1回の灯るさ `+5`
- 手書きのリスナー名簿: 4000 灯るさ、施設の灯るさ生産 `x1.06`
- 色あせた書名ラベル: 10000 灯るさ、交流増加量 `x1.10`
- 放送室の機材マニュアル: 15000 灯るさ、オフライン灯るさ報酬 `x1.10`
- 修復用の工具一式: 50000 灯るさ、施設の灯るさ生産 `x1.08`
- オフライン報酬: `現在の秒間灯るさ量 * 離れていた秒数 * 0.5 * オフライン報酬倍率`
- オフライン報酬倍率は基礎効率50%に掛かる補助効果です。交代用連絡ボード購入後は `0.5 * 1.10 = 0.55` になり、同じ時間のオンライン自然生産の55%が復帰時に加算されます。
- `再固定中枢` 以降の廻本体、記憶断片リソース、廻ボーナスは未実装です。

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

ゲームロジックの軽量テストを実行します。
```sh
npm run test
```

ビルド結果をローカルで確認する場合は、以下を実行します。

```sh
npm run preview
```

## GitHub Pages

GitHub Pages 公開用に `.github/workflows/deploy.yml` を用意しています。

workflow は `npm ci`、`npm run build`、`upload-pages-artifact`、`deploy-pages` を使って `dist/` を公開します。

Vite 設定では `base: ""` を使っており、リポジトリ名が変わってもビルド後のアセットを相対パスで読み込めるようにしています。

## 手動確認チェックリスト

- アプリがローカルで起動する。
- 新規セーブで灯るさが 0 から始まる。
- 「ライブする」を押すと灯るさが 1 増える。
- 灯るさ 10 で路地裏ステージを強化できる。
- 路地裏ステージ Lv 10 到達前は、ネオン掲示板が未解放として表示される。
- 未解放アイドルに解放条件が表示される。
- 路地裏ステージ Lv 10 到達後、ネオン掲示板が解放される。
- ネオン掲示板 Lv 5 到達前は、朝霧 結が未解放として表示される。
- ネオン掲示板 Lv 5 到達後、朝霧 結が解放される。
- 朝霧 結を注目アイドルに切り替えられる。
- 地下広場 Lv 4 到達後、名前の記録壁が解放される。
- 名前の記録壁 Lv 3 到達前は、地下礼拝堂が未解放として表示される。
- 名前の記録壁 Lv 3 到達後、地下礼拝堂が解放される。
- 地下礼拝堂 Lv 3 到達前は、深月 詩乃が未解放として表示される。
- 地下礼拝堂 Lv 3 到達後、深月 詩乃が解放される。
- 深月 詩乃を注目アイドルに切り替えられる。
- 地下礼拝堂 Lv 5 到達後、地下通路修復区画が解放される。
- 地下通路修復区画 Lv 2 到達後、継ノ端 桜子が解放される。
- 継ノ端 桜子を注目アイドルに切り替えられる。
- 歌タブを開ける。
- 路地裏ステージ Lv 5 かつ 80 灯るさで「路地裏のイントロ」を取得できる。
- 「路地裏のイントロ」取得後、ライブ1回の獲得灯るさが 2 になる。
- 地下礼拝堂 Lv 1 かつ 450 灯るさで「礼拝堂のハーモニー」を取得できる。
- 地下礼拝堂 Lv 5 かつ 1800 灯るさで「薄明のコーラス」を取得できる。
- 地下通路修復区画 Lv 3 かつ 80000 灯るさで「修復の仮歌」を取得できる。
- 生産倍率系の歌を取得すると秒間灯るさ量が増える。
- アイテムタブを開ける。
- 路地裏ステージ Lv 3 かつ 100 灯るさで「古いネオン管」を購入できる。
- 路地裏ステージ Lv 4 かつ 140 灯るさで「手書きの告知ポスター」を購入できる。
- 「手書きの告知ポスター」購入後、ライブ1回の獲得灯るさがさらに 1 増える。
- 路地裏ステージ Lv 5 かつ 220 灯るさで「半券の束」を購入できる。
- 「半券の束」購入後、ライブ1回の獲得灯るさがさらに 1 増える。
- 路地裏ステージ Lv 6 かつ 260 灯るさで「携帯スポットライト」を購入できる。
- 「携帯スポットライト」購入後、毎秒灯るさの表示が増える。
- ネオン掲示板 Lv 2 かつ 500 灯るさで「交代用連絡ボード」を購入できる。
- 「交代用連絡ボード」購入後、オフライン報酬は同じ時間のオンライン自然生産の55%になる。
- ネオン掲示板 Lv 3 かつ 600 灯るさで「録音済みの短い挨拶」を購入できる。
- 地下通路修復区画 Lv 1 かつ 50000 灯るさで「修復用の工具一式」を購入できる。
- 購入済みアイテムがリロード後も購入済みとして残る。
- 記録タブを開ける。
- 初期解放の記録が読める。
- 施設Lvや歌取得に応じて記録が解放される。
- 記録を読むと既読になり、リロード後も既読が残る。
- 記録を読んでも灯るさや生産量は変化しない。
- 再固定中枢以降の廻本体UIや記憶断片リソースはまだ表示されない。
- 施設強化時に灯るさが消費され、秒間灯るさ量が増える。
- クリックしなくても時間経過で灯るさが増える。
- ページ再読み込み後も灯るさと施設 Lv が残る。
- 離れていた時間に応じてオフライン灯るさが加算される。
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
  saveVersion: 9,
  resources: {
    tomorusa: 0
  },
  activeIdolId: "otowaAkari",
  recordTabLastSeenContentVersion: 0,
  facilities: {
    alleyStage: { level: 0 },
    neonBoard: { level: 0 },
    undergroundChapel: { level: 0 }
  },
  idols: {
    otowaAkari: { bond: 0, eventIdsRead: [] },
    asagiriYui: { bond: 0, eventIdsRead: [] },
    mizukiShino: { bond: 0, eventIdsRead: [] }
  },
  items: {
    oldNeonTube: { purchased: false },
    ticketStubBundle: { purchased: false },
    handwrittenPoster: { purchased: false },
    portableSpotlight: { purchased: false },
    shiftNoticeBoard: { purchased: false },
    recordedGreeting: { purchased: false }
  },
  songs: {
    rojiuraIntro: { purchased: false },
    chapelHarmony: { purchased: false },
    twilightChorus: { purchased: false }
  },
  records: {
    alleyStageRestorationMemo: { read: false },
    firstAudienceNote: { read: false },
    lightResponseObservation: { read: false },
    posterNameMemo: { read: false },
    neonBoardNoticeLog: { read: false },
    recordedGreetingEcho: { read: false },
    undergroundChapelRestorationReport: { read: false },
    chapelStorageSlip: { read: false },
    observerCountFragment: { read: false },
    songAndHymnDistinction: { read: false },
    mistAndAnchorFacilityLog: { read: false }
  },
  lastSavedAt: Date.now()
})
```

解放済み状態のテストセーブを書き込んでリロード:

```js
window.__NEON_DEBUG__.setSaveForTest({
  saveVersion: 9,
  resources: {
    tomorusa: 3000
  },
  activeIdolId: "mizukiShino",
  recordTabLastSeenContentVersion: 0,
  facilities: {
    alleyStage: { level: 10 },
    neonBoard: { level: 10 },
    undergroundChapel: { level: 5 }
  },
  idols: {
    otowaAkari: { bond: 0, eventIdsRead: [] },
    asagiriYui: { bond: 0, eventIdsRead: [] },
    mizukiShino: { bond: 0, eventIdsRead: [] }
  },
  items: {
    oldNeonTube: { purchased: true },
    ticketStubBundle: { purchased: true },
    handwrittenPoster: { purchased: true },
    portableSpotlight: { purchased: false },
    shiftNoticeBoard: { purchased: false },
    recordedGreeting: { purchased: false }
  },
  songs: {
    rojiuraIntro: { purchased: true },
    chapelHarmony: { purchased: true },
    twilightChorus: { purchased: false }
  },
  records: {
    alleyStageRestorationMemo: { read: true },
    firstAudienceNote: { read: true },
    lightResponseObservation: { read: false },
    posterNameMemo: { read: false },
    neonBoardNoticeLog: { read: false },
    recordedGreetingEcho: { read: false },
    undergroundChapelRestorationReport: { read: false },
    chapelStorageSlip: { read: false },
    observerCountFragment: { read: false },
    songAndHymnDistinction: { read: false },
    mistAndAnchorFacilityLog: { read: false }
  },
  lastSavedAt: Date.now()
})
```

このAPIは、テスト用セーブを書き込む直前/直後に通常の自動保存や `beforeunload` 保存で上書きされないようにしています。

## 既知の制限

- リソースは「灯るさ」1種類のみです。
- 右側タブのうち、現在は復興区画、歌、アイテム、アイドル、記録が実質的な表示対象です。
- 詳細ボタンは未実装です。
- オフライン報酬は最大12時間分まで加算されます。将来的に転生機能で上限拡張を検討しています。
- セーブデータ破損時の詳細な復旧 UI はありません。
- 音声、ストーリーシステムは未実装です。
- モバイル向けの本格的な最適化はまだ行っていません。

## 今後の開発予定

- アイテムの追加とバランス調整
- 歌アップグレードの通常名整理とバランス調整
- アイドルごとの交流イベント追加
- 復旧報告・観測記録の追加
- ゲームバランス調整
- ビジュアル、立ち絵、短いフレーバーテキストの改善

