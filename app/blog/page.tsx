import { getAllPosts } from "@/lib/blog";
import BlogClient from "@/components/BlogClient";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogClient posts={posts} />;
}
