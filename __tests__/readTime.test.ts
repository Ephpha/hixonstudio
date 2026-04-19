import { estimateReadTime } from "@/lib/readTime";

describe("estimateReadTime", () => {
  it("returns '1 min read' for fewer than 200 words", () => {
    const content = "word ".repeat(100).trim();
    expect(estimateReadTime(content)).toBe("1 min read");
  });

  it("returns '2 min read' for 250 words", () => {
    const content = "word ".repeat(250).trim();
    expect(estimateReadTime(content)).toBe("2 min read");
  });

  it("returns '5 min read' for 900 words", () => {
    const content = "word ".repeat(900).trim();
    expect(estimateReadTime(content)).toBe("5 min read");
  });

  it("returns '1 min read' for empty string", () => {
    expect(estimateReadTime("")).toBe("1 min read");
  });
});
