import { parseGithubRepoUrl } from "@/lib/github-url";

describe("parseGithubRepoUrl", () => {
  it("parses https URLs", () => {
    expect(parseGithubRepoUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("strips .git and ignores extra path", () => {
    expect(
      parseGithubRepoUrl("https://github.com/owner/repo.git/tree/main"),
    ).toEqual({ owner: "owner", repo: "repo" });
  });

  it("accepts host without scheme", () => {
    expect(parseGithubRepoUrl("github.com/acme/demo")).toEqual({
      owner: "acme",
      repo: "demo",
    });
  });

  it("rejects non-GitHub hosts", () => {
    expect(parseGithubRepoUrl("https://gitlab.com/acme/demo")).toBeNull();
  });

  it("rejects incomplete paths", () => {
    expect(parseGithubRepoUrl("https://github.com/only-owner")).toBeNull();
  });
});
