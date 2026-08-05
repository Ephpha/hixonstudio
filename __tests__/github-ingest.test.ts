import { ingestGithubRepo } from "@/lib/github-ingest";

describe("ingestGithubRepo (live GitHub)", () => {
  jest.setTimeout(30_000);

  it("parses vercel/next.js into title, description, and badges", async () => {
    const result = await ingestGithubRepo("https://github.com/vercel/next.js");
    if (!result.ok) {
      // Rate limits shouldn't fail the suite as a code bug — surface clearly.
      if (result.code === "rate_limited") {
        console.warn("GitHub rate limited during test:", result.message);
        return;
      }
      throw new Error(`ingest failed: ${result.code} ${result.message}`);
    }

    expect(result.owner).toBe("vercel");
    expect(result.repo).toBe("next.js");
    expect(result.title.length).toBeGreaterThan(0);
    expect(result.description.length).toBeGreaterThan(0);
    expect(result.badges.length).toBeGreaterThanOrEqual(3);
    expect(result.badges.length).toBeLessThanOrEqual(5);
    expect(result.htmlUrl).toContain("github.com/vercel/next.js");
  });

  it("falls back with allowManualTitle for a missing repo", async () => {
    const result = await ingestGithubRepo(
      "https://github.com/demobro-does-not-exist-xyz/nope-repo-404",
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.allowManualTitle).toBe(true);
    expect(["not_found", "rate_limited", "upstream"]).toContain(result.code);
  });
});
