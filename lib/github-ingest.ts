import { parseGithubRepoUrl } from "@/lib/github-url";

export type RepoIngestSuccess = {
  ok: true;
  owner: string;
  repo: string;
  htmlUrl: string;
  title: string;
  description: string;
  badges: string[];
  language: string | null;
  stars: number;
  readmeExcerpt: string | null;
  hasPackageJson: boolean;
  packageName: string | null;
};

export type RepoIngestFailure = {
  ok: false;
  code: "invalid_url" | "not_found" | "private" | "rate_limited" | "upstream";
  message: string;
  /** Allow the user to type a title manually and continue. */
  allowManualTitle: boolean;
};

export type RepoIngestResult = RepoIngestSuccess | RepoIngestFailure;

type GhRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  homepage: string | null;
  topics?: string[];
};

type GhLanguageMap = Record<string, number>;

type PackageJson = {
  name?: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const GITHUB_API = "https://api.github.com";
const USER_AGENT = "DemoBro/0.1 (demobro.video)";

function ghHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function ghFetch(path: string): Promise<Response> {
  return fetch(`${GITHUB_API}${path}`, {
    headers: ghHeaders(),
    // Repo metadata changes; don't serve a stale ingest mid-demo.
    cache: "no-store",
  });
}

function rateLimitFailure(res: Response): RepoIngestFailure {
  const reset = res.headers.get("x-ratelimit-reset");
  const resetHint = reset
    ? ` Try again after ${new Date(Number(reset) * 1000).toLocaleTimeString()}.`
    : "";
  return {
    ok: false,
    code: "rate_limited",
    message: `GitHub rate limit hit.${resetHint} You can still enter a title manually.`,
    allowManualTitle: true,
  };
}

async function fetchJson<T>(
  path: string,
): Promise<{ ok: true; data: T } | { ok: false; failure: RepoIngestFailure } | { ok: false; status: number }> {
  const res = await ghFetch(path);
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (res.status === 429 || remaining === "0") {
      return { ok: false, failure: rateLimitFailure(res) };
    }
  }
  if (res.status === 404) {
    return { ok: false, status: 404 };
  }
  if (!res.ok) {
    return { ok: false, status: res.status };
  }
  return { ok: true, data: (await res.json()) as T };
}

async function fetchRawFile(
  owner: string,
  repo: string,
  path: string,
): Promise<string | null> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`,
    { headers: { "User-Agent": USER_AGENT }, cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.text();
}

async function fetchReadmeExcerpt(
  owner: string,
  repo: string,
): Promise<string | null> {
  const res = await ghFetch(`/repos/${owner}/${repo}/readme`);
  if (res.status === 404) return null;
  if (res.status === 403 || res.status === 429) return null;
  if (!res.ok) return null;
  const body = (await res.json()) as { content?: string; encoding?: string };
  if (!body.content || body.encoding !== "base64") return null;
  try {
    const text = Buffer.from(body.content.replace(/\n/g, ""), "base64").toString(
      "utf8",
    );
    return excerptReadme(text);
  } catch {
    return null;
  }
}

function excerptReadme(markdown: string): string {
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[#>*_`|-]+/g, " ");
  const lines = cleaned
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 24)
    .filter((l) => !/^https?:\/\//i.test(l));
  const prose = lines[0] ?? "";
  return prose.slice(0, 220);
}

function humanizeRepoName(name: string): string {
  // Keep dotted package-style names readable: next.js → Next.js
  if (/^[a-z0-9]+(?:\.[a-z0-9]+)+$/i.test(name)) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const KNOWN_TECH: Array<{ match: RegExp; badge: string }> = [
  { match: /^react$/, badge: "React" },
  { match: /^next$/, badge: "Next.js" },
  { match: /^vue$/, badge: "Vue" },
  { match: /^nuxt$/, badge: "Nuxt" },
  { match: /^svelte$/, badge: "Svelte" },
  { match: /^@sveltejs\/kit$/, badge: "SvelteKit" },
  { match: /^angular$/, badge: "Angular" },
  { match: /^express$/, badge: "Express" },
  { match: /^fastify$/, badge: "Fastify" },
  { match: /^hono$/, badge: "Hono" },
  { match: /^nestjs$/, badge: "NestJS" },
  { match: /^@nestjs\/core$/, badge: "NestJS" },
  { match: /^prisma$/, badge: "Prisma" },
  { match: /^drizzle-orm$/, badge: "Drizzle" },
  { match: /^@supabase\/supabase-js$/, badge: "Supabase" },
  { match: /^firebase$/, badge: "Firebase" },
  { match: /^tailwindcss$/, badge: "Tailwind" },
  { match: /^typescript$/, badge: "TypeScript" },
  { match: /^zod$/, badge: "Zod" },
  { match: /^trpc$/, badge: "tRPC" },
  { match: /^@trpc\/server$/, badge: "tRPC" },
  { match: /^graphql$/, badge: "GraphQL" },
  { match: /^openai$/, badge: "OpenAI" },
  { match: /^@anthropic-ai\/sdk$/, badge: "Anthropic" },
  { match: /^three$/, badge: "Three.js" },
  { match: /^electron$/, badge: "Electron" },
  { match: /^django$/, badge: "Django" },
  { match: /^flask$/, badge: "Flask" },
  { match: /^fastapi$/, badge: "FastAPI" },
];

const LANGUAGE_BADGES: Record<string, string> = {
  TypeScript: "TypeScript",
  JavaScript: "JavaScript",
  Python: "Python",
  Go: "Go",
  Rust: "Rust",
  Swift: "Swift",
  Kotlin: "Kotlin",
  Java: "Java",
  Ruby: "Ruby",
  PHP: "PHP",
  "C++": "C++",
  C: "C",
  Shell: "Shell",
  Dart: "Dart",
  Elixir: "Elixir",
};

function badgesFromPackageJson(pkg: PackageJson | null): string[] {
  if (!pkg) return [];
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
  const found: string[] = [];
  for (const dep of Object.keys(deps)) {
    for (const rule of KNOWN_TECH) {
      if (rule.match.test(dep) && !found.includes(rule.badge)) {
        found.push(rule.badge);
      }
    }
  }
  return found;
}

function badgesFromLanguages(languages: GhLanguageMap): string[] {
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const out: string[] = [];
  for (const [lang] of sorted) {
    const badge = LANGUAGE_BADGES[lang] ?? lang;
    if (!out.includes(badge)) out.push(badge);
    if (out.length >= 5) break;
  }
  return out;
}

function pickBadges(opts: {
  languages: GhLanguageMap;
  pkg: PackageJson | null;
  primaryLanguage: string | null;
  topics: string[];
}): string[] {
  const fromPkg = badgesFromPackageJson(opts.pkg);
  const fromLang = badgesFromLanguages(opts.languages);
  const fromTopics = opts.topics
    .map((t) => t.replace(/-/g, " "))
    .map((t) => t.replace(/\b\w/g, (c) => c.toUpperCase()))
    .filter((t) => t.length <= 18);

  const merged: string[] = [];
  const push = (b: string) => {
    if (!merged.includes(b) && merged.length < 5) merged.push(b);
  };

  if (opts.primaryLanguage) {
    push(LANGUAGE_BADGES[opts.primaryLanguage] ?? opts.primaryLanguage);
  }
  for (const b of fromPkg) push(b);
  for (const b of fromLang) push(b);
  for (const b of fromTopics) push(b);

  return merged.slice(0, 5);
}

function deriveTitle(repo: GhRepo, pkg: PackageJson | null): string {
  const fromRepo = humanizeRepoName(repo.name);
  // Monorepo roots often use placeholder package names — prefer the GitHub name.
  if (pkg?.name) {
    const bare = pkg.name.replace(/^@[^/]+\//, "");
    const looksGeneric =
      /^(app|web|api|project|package|repo|monorepo)$/i.test(bare) ||
      bare.toLowerCase().includes("project") ||
      bare.length < 2;
    if (!looksGeneric && bare.toLowerCase() !== repo.name.toLowerCase()) {
      // Only prefer package.json when it's a real product name distinct from a dump.
      const humanized = humanizeRepoName(bare);
      if (humanized.length <= 40) return humanized;
    }
  }
  return fromRepo;
}

function deriveDescription(
  repo: GhRepo,
  pkg: PackageJson | null,
  readmeExcerpt: string | null,
): string {
  if (repo.description?.trim()) return repo.description.trim().slice(0, 160);
  if (pkg?.description?.trim()) return pkg.description.trim().slice(0, 160);
  if (readmeExcerpt) return readmeExcerpt.slice(0, 160);
  return `A ${repo.language ?? "software"} project from ${repo.full_name}.`;
}

export async function ingestGithubRepo(
  repoUrl: string,
): Promise<RepoIngestResult> {
  const parsed = parseGithubRepoUrl(repoUrl);
  if (!parsed) {
    return {
      ok: false,
      code: "invalid_url",
      message: "Use a public GitHub URL like https://github.com/owner/repo",
      allowManualTitle: false,
    };
  }

  const { owner, repo } = parsed;

  let repoJson: GhRepo;
  try {
    const result = await fetchJson<GhRepo>(`/repos/${owner}/${repo}`);
    if (!result.ok && "failure" in result) return result.failure;
    if (!result.ok) {
      if (result.status === 404) {
        return {
          ok: false,
          code: "not_found",
          message: `Couldn't read that repo — ${owner}/${repo} wasn't found (or it's private). Enter a title to continue.`,
          allowManualTitle: true,
        };
      }
      return {
        ok: false,
        code: "upstream",
        message: `GitHub returned ${result.status}. Enter a title to continue.`,
        allowManualTitle: true,
      };
    }
    repoJson = result.data;
  } catch {
    return {
      ok: false,
      code: "upstream",
      message: "Couldn't reach GitHub. Enter a title to continue.",
      allowManualTitle: true,
    };
  }

  if (repoJson.private) {
    return {
      ok: false,
      code: "private",
      message: "That repo is private. Enter a title to continue.",
      allowManualTitle: true,
    };
  }

  const [languagesResult, readmeExcerpt, packageRaw] = await Promise.all([
    fetchJson<GhLanguageMap>(`/repos/${owner}/${repo}/languages`),
    fetchReadmeExcerpt(owner, repo),
    fetchRawFile(owner, repo, "package.json"),
  ]);

  let languages: GhLanguageMap = {};
  if (languagesResult.ok && "data" in languagesResult) {
    languages = languagesResult.data;
  } else if (!languagesResult.ok && "failure" in languagesResult) {
    // Rate limited mid-flight — still return what we have from the main repo call.
    return languagesResult.failure;
  }

  let pkg: PackageJson | null = null;
  if (packageRaw) {
    try {
      pkg = JSON.parse(packageRaw) as PackageJson;
    } catch {
      pkg = null;
    }
  }

  const title = deriveTitle(repoJson, pkg);
  const description = deriveDescription(repoJson, pkg, readmeExcerpt);
  const badges = pickBadges({
    languages,
    pkg,
    primaryLanguage: repoJson.language,
    topics: repoJson.topics ?? [],
  });

  // Prefer 3–5 badges; pad from language breakdown when package.json is thin.
  for (const lang of Object.keys(languages)) {
    if (badges.length >= 3) break;
    const b = LANGUAGE_BADGES[lang] ?? lang;
    if (!badges.includes(b)) badges.push(b);
  }

  return {
    ok: true,
    owner,
    repo,
    htmlUrl: repoJson.html_url,
    title,
    description,
    badges: badges.slice(0, 5),
    language: repoJson.language,
    stars: repoJson.stargazers_count,
    readmeExcerpt,
    hasPackageJson: Boolean(pkg),
    packageName: pkg?.name ?? null,
  };
}
