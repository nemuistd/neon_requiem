import { describe, expect, it } from "vitest";
import { formatAmount, formatDetailedAmount, formatDetailedRate, formatRate } from "./ui/format";
import { renderNumberDetail } from "./ui/numberDetail";

describe("ui formatting", () => {
  it("formats per-second rates with thousands separators and two decimals before compact values", () => {
    expect(formatRate(1234.5)).toBe("1,234.50");
    expect(formatRate(98765.432)).toBe("98,765.43");
  });

  it("formats large amounts and rates with Japanese compact units", () => {
    expect(formatAmount(99999.9)).toBe("99,999");
    expect(formatAmount(123456)).toBe("12.3万");
    expect(formatRate(123456.789)).toBe("12.3万");
    expect(formatRate(9876543.219)).toBe("987.7万");
    expect(formatRate(123456789.219)).toBe("1.23億");
    expect(formatRate(1234567890123.219)).toBe("1.23兆");
  });

  it("keeps detailed values available for tooltips", () => {
    expect(formatDetailedAmount(123456.789)).toBe("123,456.79");
    expect(formatDetailedRate(9876543.219)).toBe("9,876,543.22");
  });

  it("renders custom number detail markup for compact values", () => {
    expect(renderNumberDetail("1.23兆", "1,234,567,890,123.22 灯るさ")).toContain("class=\"number-detail\"");
    expect(renderNumberDetail("1.23兆", "1,234,567,890,123.22 灯るさ")).toContain("class=\"number-detail-popover\"");
    expect(renderNumberDetail("1.23兆", "1,234,567,890,123.22 灯るさ")).toContain("tabindex=\"0\"");
    expect(renderNumberDetail("1.23兆", "1,234,567,890,123.22 灯るさ")).toContain("1,234,567,890,123.22 灯るさ");
  });

  it("escapes number detail markup text", () => {
    expect(renderNumberDetail("<表示>", "\"詳細\" & '値'")).toContain("&lt;表示&gt;");
    expect(renderNumberDetail("<表示>", "\"詳細\" & '値'")).toContain("&quot;詳細&quot; &amp; &#39;値&#39;");
  });
});
