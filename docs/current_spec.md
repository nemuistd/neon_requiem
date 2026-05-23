# NEON REQUIEM 現行仕様

## 位置づけ

この文書は、現在の実装状態をドキュメント側で参照するための仕様メモである。

世界観・用語体系は [worldbuilding.md](worldbuilding.md) を正史とする。承認済みの物語・コンテンツ正史は [fiction/](fiction/) 配下を参照する。README とこの文書に差分が出た場合は、実装と README を確認して同期する。
長期方針と未実装計画は [planning/](planning/) 配下を参照する。

`docs/fiction/world_design.md` で定義された **廻（めぐり）** は正式システム名として扱う。ただし、現在の実装にはまだ廻システム本体、記憶断片リソース、廻後アノテーションは入っていない。

## 技術構成

- 静的ブラウザアプリ
- Vite + TypeScript
- バックエンドなし
- localStorage 保存
- GitHub Pages に載せやすい相対パス構成

主なコマンド:

```sh
npm run build
npm run check:content
```

GitHub Pages のデプロイ workflow では、`npm ci` の後に `npm run check:content` を実行し、コンテンツ定義の整合性を確認してから `npm run build` を実行する。

## 基本ループ

1. 「ライブする」で灯るさを得て、注目アイドルの `bond` が 1 増える。
2. 灯るさを使って施設を強化する。
3. 施設が毎秒灯るさを生産する。
4. 歌やアイテムを購入して恒久効果を得る。
5. アイドル解放により全体生産倍率が増える。
6. 記録を読み、世界観の開示を進める。
7. localStorage に保存され、離脱時間に応じたオフライン報酬を得る。

`bond` は注目アイドル枠とアイドルタブで「交流」として表示する。自動生産やオフライン報酬では増えない。

オフライン報酬は、同じ時間のオンライン自然生産を基準にした簡易進行として扱う。基礎効率は `0.5` で、実効値は `現在の秒間灯るさ量 * 離脱秒数 * 0.5 * オフライン報酬倍率` とする。`offline.reward.multiplier` はこの基礎効率に乗算する補助効果であり、追加時は同時間のオンライン自然生産を超える前提にしない。

## リソース

現在の数値リソースは1種類。

- id: `tomorusa`
- 表示名: 灯るさ
- 意味: 街や施設が霞に抗って安定している度合い

演出文としての「灯り」は残してよい。

## 施設

| id | 表示名 | 解放条件 | baseCost | costMultiplier | productionPerLevel |
| --- | --- | --- | ---: | ---: | ---: |
| `alleyStage` | 路地裏ステージ | 初期 | 10 | 1.15 | 0.1 |
| `neonBoard` | ネオン掲示板 | 路地裏ステージ Lv10 | 80 | 1.18 | 0.35 |
| `twilightPathGuide` | 薄明通り案内所 | ネオン掲示板 Lv5 | 3000 | 1.22 | 3 |
| `temporaryBroadcastBooth` | 仮設配信ブース | 薄明通り案内所 Lv1 | 5000 | 1.22 | 4 |
| `memoryLibrary` | 記憶図書館 | 仮設配信ブース Lv5 | 15000 | 1.25 | 8 |
| `recordingStorage` | 録音保管庫 | 記憶図書館 Lv1 | 12000 | 1.23 | 6 |
| `oldBroadcastRoom` | 古い放送室 | 録音保管庫 Lv2 | 26000 | 1.24 | 11 |
| `undergroundPlaza` | 地下広場 | 記憶図書館 Lv3 | 20000 | 1.25 | 10 |
| `undergroundChapel` | 地下礼拝堂 | ネオン掲示板 Lv10 | 900 | 1.25 | 1 |

地下礼拝堂は序盤施設ではなく、中盤以降の深層施設として扱う。

## アイドル

| id | 表示名 | 解放条件 | 効果 |
| --- | --- | --- | --- |
| `otowaAkari` | 音羽 灯里 | 初期 | 全灯るさ生産 x1.20 |
| `asagiriYui` | 朝霧 結 | ネオン掲示板 Lv5 | 全灯るさ生産 x1.15 |
| `hibikiTooko` | 響木 遠子 | 仮設配信ブース Lv3 | ライブ1回の灯るさ獲得に全施設合計の秒間灯るさ x0.05 を加算 |
| `mizukiShino` | 深月 詩乃 | 地下礼拝堂 Lv3 | 全灯るさ生産 x1.10 |
| `kaminoMeguri` | 紙野 巡 | 記憶図書館 Lv2 | 全アイドルの交流増加量 x1.25 |
| `hinataKoharu` | 陽向 小春 | 地下広場 Lv1 | 全灯るさ生産 x1.08 / アイテム購入コスト x0.90 |

アイドル効果は `passiveEffects: Effect[]` として定義する。解放済みなら常時発動する。灯里・結・詩乃は `facility.production.multiplier`、遠子は `manual.gain.add.production.ratio`、巡は `bond.rate.multiplier`、小春は `facility.production.multiplier` と `item.cost.multiplier` を持つ。`focusEffects` は型だけ用意しているが、注目アイドルは「好きなアイドルを画面に置く」ための枠でもあるため、進行効率に直結する注目アイドル限定効果の適用は保留する。

立ち絵制作はコンテンツ実装と分ける。`imageUrl` が未設定のアイドルは、アイドルタブと注目アイドル枠で記名札風の簡易表示を出す。

効果エンジンは、追加アイドル・追加施設に備えて以下の効果タイプを扱える。

- `manual.gain.add`
- `manual.gain.add.production.ratio`
- `facility.production.multiplier`
- `facility.production.multiplier.tag`
- `offline.reward.multiplier`
- `bond.rate.multiplier`
- `item.cost.multiplier`
- `song.cost.multiplier`
- `record.unlock.cost.multiplier`
- `memory.fragment.production.add`
- `rebirth.bonus.multiplier`

このうち、記録解放コスト、記憶断片、廻ボーナスは型・検証上の受け口であり、対応するUIやゲームシステムは未実装。

## 歌

| id | 表示名 | 解放条件 | cost | 効果 |
| --- | --- | --- | ---: | --- |
| `rojiuraIntro` | 路地裏のイントロ | 路地裏ステージ Lv5 | 80 | ライブ1回の灯るさ +1 |
| `prebroadcastAcapella` | 配信前夜のアカペラ | 仮設配信ブース Lv2 | 6000 | ライブ1回の灯るさ +8 |
| `songOfRecords` | 記録の歌 | 記憶図書館 Lv3 | 20000 | 施設の灯るさ生産 x1.15 |
| `plazaAnthem` | 広場のアンセム | 地下広場 Lv3 | 30000 | ライブ1回の灯るさ獲得に全施設合計の灯るさ/秒 x0.08 を加算 |
| `chapelHarmony` | 礼拝堂のハーモニー | 地下礼拝堂 Lv1 | 450 | 施設の灯るさ生産 x1.10 |
| `twilightChorus` | 薄明のコーラス | 地下礼拝堂 Lv5 | 1800 | 施設の灯るさ生産 x1.25 |

「聖歌」は通常システム名にしない。

## アイテム

| id | 表示名 | 解放条件 | cost | 効果 |
| --- | --- | --- | ---: | --- |
| `oldNeonTube` | 古いネオン管 | 路地裏ステージ Lv3 | 100 | 施設の灯るさ生産 x1.05 |
| `handwrittenPoster` | 手書きの告知ポスター | 路地裏ステージ Lv4 | 140 | ライブ1回の灯るさ +1 |
| `ticketStubBundle` | 半券の束 | 路地裏ステージ Lv5 | 220 | ライブ1回の灯るさ +1 |
| `portableSpotlight` | 携帯スポットライト | 路地裏ステージ Lv6 | 260 | 施設の灯るさ生産 x1.04 |
| `recordedGreeting` | 録音済みの短い挨拶 | ネオン掲示板 Lv3 | 600 | 施設の灯るさ生産 x1.03 |
| `shiftNoticeBoard` | 交代用連絡ボード | ネオン掲示板 Lv2 | 500 | オフライン灯るさ報酬 x1.10 |
| `oldRadioTowerDebris` | 古い電波塔の残骸 | 仮設配信ブース Lv1 | 3000 | ライブ1回の灯るさ +5 |
| `handwrittenListenerLog` | 手書きのリスナー名簿 | 仮設配信ブース Lv3 | 4000 | 施設の灯るさ生産 x1.06 |
| `fadedBookLabel` | 色あせた書名ラベル | 記憶図書館 Lv2 | 10000 | 交流増加量 x1.10 |
| `broadcastEquipmentManual` | 放送室の機材マニュアル | 録音保管庫 Lv2 | 15000 | オフライン灯るさ報酬 x1.10 |

アイテムタブは実装済みで、購入済み状態は保存される。
`交代用連絡ボード` 購入後の実効オフライン効率は `0.5 * 1.10 = 0.55` で、同じ時間のオンライン自然生産の55%になる。

## 序盤30分の進行目安

以下は、数秒から十数秒に1回程度「ライブする」を押し、解放された要素を順に購入・強化する想定の目安である。

| 時点 | 想定進行 |
| --- | --- |
| 5分 | ライブ、路地裏ステージ強化、最初の記録解放を体験。路地裏ステージ Lv5 前後に到達し、「路地裏のイントロ」や序盤アイテムが見え始める。 |
| 15分 | 「路地裏のイントロ」、古いネオン管、手書きの告知ポスターを購入済みまたは購入圏内。路地裏ステージ Lv10 到達によりネオン掲示板が解放される。 |
| 30分 | ネオン掲示板を複数回強化し、録音済みの短い挨拶と朝霧 結の解放に届く。プレイ密度が高ければネオン掲示板 Lv10 と地下礼拝堂解放も視野に入る。 |

## 記録

記録は進行条件に応じて解放され、既読状態を保存する。数値効果は持たない。

現在の記録:

- 路地裏ステージの復興
- 最初の客席メモ
- 観測記録・灯り反応
- 灯里・最初の呼び声
- 灯里・いつもの席
- 告知ポスターの貼り替え
- ネオン掲示板・点灯確認
- 結・案内メモの端
- 短い挨拶の反響
- 薄明通り案内所・開設報告
- 路線図・読めない区画
- 霞の濃淡・定点観測
- 遠子・最初の放送
- 配信ブース・雑音の記録
- 記憶図書館・開架報告
- 出所不明の記録
- 古い放送室・機材確認
- 地下広場・初日
- 小春・名前の効果
- 観測記録・名称固定の効果
- 地下礼拝堂復旧報告
- 詩乃・保管棚の前
- 礼拝堂保管棚の札
- 観測者数メモ断片
- 歌の扱いに関する断片
- 施設ログ・霞とアンカー

revealLevel:

- `surface`: 復興、街、ライブ、灯りが戻る
- `uncanny`: 忘却が物理的に影響している気配
- `technical`: 観測者、アンカー、認知固定率、霞曝露耐性
- `deep`: 祈念工学、聖歌、主人公の記憶封印

surface の記録に、祈念工学、アンカー、聖歌、祈念負荷を出さない。

## 保存

- 保存キー: `neon-requiem-save-v1`
- セーブバージョン: `9`
- 保存形式: `resources.tomorusa`, `facilities`, `idols`, `items`, `songs`, `records`, `activeIdolId`, `recordTabLastSeenContentVersion`, `lastSavedAt`
- アイドル個別状態として `idols[id].bond` と `idols[id].eventIdsRead` を保存する。

v1〜v8 の旧セーブは可能な範囲で正規化する。`idols` がない旧セーブでは、全アイドルに `bond: 0`, `eventIdsRead: []` を補完する。壊れたセーブでアプリがクラッシュしないようにする。

## UI

現在の主なUI:

- 上部ヘッダー
- 灯るさ表示
- 毎秒表示
- ライブするボタン
- 設定ボタン
- メッセージバー
- 注目アイドル枠
- 復興区画 / 歌 / アイテム / アイドル / 記録タブ
- 設定パネル
- セーブ削除ボタン

`window.__NEON_DEBUG__` は開発用に維持する。

## Requirement

現在の Requirement は `facility.level`, `song.purchased`, `resource.amount`, `idol.bond`, `all`, `any`, `not` を扱う。
`idol.bond` は `state.idols[idolId]?.bond >= amount` で判定し、表示文は「アイドル名 交流 amount」を基本にする。
contentValidation は `idol.bond` の idolId 存在確認と正の有限 amount を検証する。
