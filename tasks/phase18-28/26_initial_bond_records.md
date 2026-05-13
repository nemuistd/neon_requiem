# Phase 26: 初期交流メモ追加

## 目的

bond条件で解放される短い交流メモを追加する。

## 作業

記録カテゴリに「交流メモ」を追加するか、既存カテゴリに入れるか判断する。
MVPではカテゴリ「交流メモ」追加を推奨する。

追加候補:

### 音羽灯里 bond 5

- id候補: `idolBondAkariFirstVoice`
- revealLevel: `surface`
- 内容: 路地裏ステージで名前を呼ばれることへの小さな反応。
- 深層語は禁止。

### 音羽灯里 bond 20

- id候補: `idolBondAkariRegularSeat`
- revealLevel: `surface`
- 内容: 小さな常連席、ライブを覚えている人の描写。

### 朝霧結 bond 5

- id候補: `idolBondYuiGuideNote`
- revealLevel: `uncanny`
- 内容: ネオン掲示板や道案内、薄明通りへの導線。
- 霞は出してよいが、祈念工学や聖歌は出さない。

### 深月詩乃 bond 5

- id候補: `idolBondShinoStorageShelf`
- revealLevel: `uncanny`
- 内容: 地下礼拝堂の保管棚や失われた響き。
- 聖歌を通常語として扱わない。

## 注意

- 現在の3人だけで物語を完結させない。
- 世界観核心は解決しない。
- 主人公の正体は確定しない。
- deep記録はこのPRでは増やさなくてよい。

## 検証

```sh
npm run build
npm run check:content
npm run test
```

実ブラウザQAで確認:
- bond到達前は未解放。
- bond到達後に記録が解放。
- 既読保存が残る。
