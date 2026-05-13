# Phase 28: 次施設と章進行設計

## 目的

地下礼拝堂を急がない方針に従い、次に追加する施設・章進行をdocsで設計する。

## 作業

新規docs候補:

- `docs/chapter_progression_design.md`
- `docs/next_facility_candidates.md`

### 設計する内容

- Chapter 1: 路地裏の灯
- Chapter 2: 名前を掲げる場所
- Chapter 3: 薄明通り
- Chapter 4: 記憶施設
- Chapter 5: 地下礼拝堂
- Chapter 6以降: 深層 / 転生後

### 次施設候補

地下礼拝堂前に挟む候補を検討する。

- 薄明通り案内所
- 仮設配信ブース
- 記憶図書館入口
- 古い放送室
- 地下駅跡

推奨は、朝霧結の導線として「薄明通り案内所」を第一候補にすること。
ただし、このPRでは実装しない。

## 禁止

- 新施設実装
- 地下礼拝堂の削除
- 世界観核心の確定
- 転生システム実装

## 検証

```sh
npm run build
npm run check:content
npm run test
```
