import { NextResponse } from "next/server";
import { ingestGithubRepo } from "@/lib/github-ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")?.trim() ?? "";

  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_url",
        message: "Pass ?url=https://github.com/owner/repo",
        allowManualTitle: false,
      },
      { status: 400 },
    );
  }

  const result = await ingestGithubRepo(url);

  if (!result.ok) {
    const status =
      result.code === "invalid_url"
        ? 400
        : result.code === "rate_limited"
          ? 429
          : result.code === "not_found" || result.code === "private"
            ? 404
            : 502;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  let body: { url?: string } = {};
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_url",
        message: "Send JSON { \"url\": \"https://github.com/owner/repo\" }",
        allowManualTitle: false,
      },
      { status: 400 },
    );
  }

  const url = body.url?.trim() ?? "";
  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_url",
        message: "Send JSON { \"url\": \"https://github.com/owner/repo\" }",
        allowManualTitle: false,
      },
      { status: 400 },
    );
  }

  const result = await ingestGithubRepo(url);
  if (!result.ok) {
    const status =
      result.code === "invalid_url"
        ? 400
        : result.code === "rate_limited"
          ? 429
          : result.code === "not_found" || result.code === "private"
            ? 404
            : 502;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
