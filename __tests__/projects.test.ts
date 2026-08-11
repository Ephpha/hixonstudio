import { projects } from "@/lib/projects";

describe("projects", () => {
  it("keeps the requested live project order", () => {
    const liveProjects = projects
      .filter((project) => project.status === "live")
      .map((project) => project.name);

    expect(liveProjects.slice(0, 3)).toEqual([
      "Hackyard",
      "DemoBro",
      "Ephpha",
    ]);
  });

  it("does not list JotLabs as in progress", () => {
    const inProgressProjects = projects
      .filter((project) => project.status === "in-progress")
      .map((project) => project.name);

    expect(inProgressProjects).not.toContain("JotLabs");
  });
});
