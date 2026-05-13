# Codexタスク04: Requirement / Effect 共通化

## 目的

今後のアイテム、交流イベント、章進行、複数資源に備え、解放条件と効果を共通化してください。

## 作業内容

1. `src/engine/requirements.ts` を追加してください。
2. `src/engine/effects.ts` を追加してください。
3. 既存の `UnlockRequirement` を、より拡張しやすい `Requirement` に置き換えてください。

最初に対応するRequirement:

```ts
export type Requirement =
  | { type: "facility.level"; facilityId: FacilityId; level: number }
  | { type: "song.purchased"; songId: SongId }
  | { type: "resource.amount"; resourceId: ResourceId; amount: number }
  | { type: "all"; requirements: Requirement[] }
  | { type: "any"; requirements: Requirement[] }
  | { type: "not"; requirement: Requirement };
```

必要に応じて実装しやすい形に調整して構いません。

4. 既存の `isRequirementMet` と `areRequirementsMet` を `requirements.ts` へ移してください。
5. `SongEffect` を `Effect[]` に寄せてください。

最初に対応するEffect:

```ts
export type Effect =
  | { type: "manual.gain.add"; resourceId: ResourceId; amount: number }
  | { type: "facility.production.multiplier"; multiplier: number };
```

6. 既存の歌3種が、従来と同じ効果を持つように移行してください。
7. `contentValidation.ts` でRequirementとEffectの参照IDを検証してください。

## 注意点

- 既存のプレイ感を変えない。
- 大きなDSLは作らない。
- まずは既存機能を共通型に載せ替えるだけにしてください。

## 完了条件

- 施設解放が従来通り動く。
- アイドル解放が従来通り動く。
- 歌解放・購入・効果が従来通り動く。
- 記録解放が従来通り動く。
- `npm run build` 成功。
- `npm run check:content` 成功。
