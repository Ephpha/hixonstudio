"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { PostMeta } from "@/lib/blog";
import { estimateReadTime } from "@/lib/readTime";
import BlogCanvas from "@/components/BlogCanvas";

export default function BlogClient({ posts }: { posts: PostMeta[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );

      const entries = listRef.current?.querySelectorAll(".blog-entry");
      if (entries?.length) {
        gsap.fromTo(
          entries,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.3,
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <BlogCanvas />
      <div ref={headerRef} style={{ opacity: 0 }}>
        <h1
          className="mb-2"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "3rem",
            color: "#fff",
          }}
        >
          Writing
        </h1>
        <p
          className="mb-16 text-sm"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Personal thoughts and technical deep dives.
        </p>
      </div>

      <div ref={listRef} className="flex flex-col gap-12" style={{ paddingBottom: "180px" }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="blog-entry group flex flex-col gap-2"
            style={{ opacity: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                className="text-xl group-hover:opacity-100 transition-opacity"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {post.title}
              </h2>
              <span
                className="shrink-0 text-xs px-2 py-0.5 rounded-full mt-1 capitalize"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {post.tag}
              </span>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {post.excerpt}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · {estimateReadTime(post.excerpt)}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}
