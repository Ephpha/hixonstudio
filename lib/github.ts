const USER = "Hixly";

type GithubUserRaw = {
  public_repos: number;
  followers: number;
  html_url: string;
};

type GithubRepoRaw = {
  name: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
  private: boolean;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
  stars: number;
  url: string;
};

export type GithubData = {
  publicRepos: number;
  followers: number;
  profileUrl: string;
  totalStars: number;
  lastPushedAt: string | null;
  repos: GithubRepo[];
};

const FETCH_OPTS = {
  cache: "force-cache" as const,
  next: { revalidate: 3600 },
  headers: {
    "User-Agent": "hixon.studio",
    Accept: "application/vnd.github+json",
  },
};

export async function getGithubData(): Promise<GithubData | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, FETCH_OPTS),
      fetch(
        `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=20&type=owner`,
        FETCH_OPTS
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user: GithubUserRaw = await userRes.json();
    const allRepos: GithubRepoRaw[] = await reposRes.json();

    const visible = allRepos.filter((r) => !r.fork);
    const repos: GithubRepo[] = visible.slice(0, 4).map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      pushedAt: r.pushed_at,
      stars: r.stargazers_count,
      url: r.html_url,
    }));

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      profileUrl: user.html_url,
      totalStars: visible.reduce((acc, r) => acc + r.stargazers_count, 0),
      lastPushedAt: visible[0]?.pushed_at ?? null,
      repos,
    };
  } catch {
    return null;
  }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
