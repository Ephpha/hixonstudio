import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { estimateReadTime } from "@/lib/readTime";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <Link
        href="/blog"
        className="text-xs tracking-widest uppercase mb-12 inline-block transition-colors hover:text-white"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        ← Writing
      </Link>

      <header className="mb-12 mt-6">
        <h1
          className="mb-5"
          style={{
            fontFamily: "EB Garamond, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#fff",
            lineHeight: 1.15,
          }}
        >
          {post.title}
        </h1>
        <div
          className="flex items-center gap-3 text-xs flex-wrap"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{estimateReadTime(post.content)}</span>
          <span>·</span>
          <span
            className="px-2 py-0.5 rounded-full capitalize"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {post.tag}
          </span>
        </div>
      </header>

      <article className="prose-hixon">
        <MDXRemote source={post.content} />
      </article>

      <div
        className="mt-20 pt-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Link
          href="/blog"
          className="text-xs tracking-widest uppercase transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          ← Back to writing
        </Link>
      </div>
    </div>
  );
}
