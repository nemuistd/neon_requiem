export type Effect =
  | { type: "manual.gain.add"; resourceId: string; amount: number }
  | { type: "facility.production.multiplier"; multiplier: number };
