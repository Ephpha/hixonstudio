/**
 * Accepts https://github.com/owner/repo[.git][/...] or github.com/owner/repo.
 * Returns normalized { owner, repo } or null.
 */
export function parseGithubRepoUrl(
  input: string,
): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");

  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(owner)) {
    return null;
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(repo) || repo === "." || repo === "..") {
    return null;
  }

  return { owner, repo };
}

export function githubRepoDisplay(owner: string, repo: string): string {
  return `${owner}/${repo}`;
}
