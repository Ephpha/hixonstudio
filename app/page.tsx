import { getAllPosts } from "@/lib/blog";
import { getGithubData } from "@/lib/github";
import HomeClient from "@/components/HomeClient";

export const revalidate = 300;

export default async function HomePage() {
  const recentPosts = getAllPosts().slice(0, 2);
  const github = await getGithubData();
  return <HomeClient recentPosts={recentPosts} github={github} />;
}
