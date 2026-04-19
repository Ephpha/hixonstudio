import { getAllPosts } from "@/lib/blog";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 2);
  return <HomeClient recentPosts={recentPosts} />;
}
