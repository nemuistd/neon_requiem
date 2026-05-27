import { describe, expect, it } from "vitest";
import { formatRate } from "./ui/format";

describe("ui formatting", () => {
  it("formats per-second rates with thousands separators and two decimals", () => {
    expect(formatRate(1234.5)).toBe("1,234.50");
    expect(formatRate(9876543.219)).toBe("9,876,543.22");
  });
});
