import { getAllPosts, getPostBySlug } from "@/lib/blog";

describe("getAllPosts", () => {
  it("returns an array of post metadata", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("returns posts sorted newest first", () => {
    const posts = getAllPosts();
    for (let i = 0; i < posts.length - 1; i++) {
      expect(new Date(posts[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i + 1].date).getTime()
      );
    }
  });

  it("each post has required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("date");
      expect(post).toHaveProperty("excerpt");
      expect(post).toHaveProperty("tag");
    }
  });
});

describe("getPostBySlug", () => {
  it("returns post content and metadata for a valid slug", () => {
    const post = getPostBySlug("building-in-public");
    expect(post).not.toBeNull();
    expect(post!.title).toBe("Why I Build in Public");
    expect(post!.content).toContain("uncomfortable");
  });

  it("returns null for an unknown slug", () => {
    const post = getPostBySlug("does-not-exist");
    expect(post).toBeNull();
  });
});
