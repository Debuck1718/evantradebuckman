import { describe, expect, it } from "vitest";

import { KnowledgeWorkspace } from "../index";

describe("KnowledgeWorkspace", () => {
  it("creates linked knowledge clusters", () => {
    const knowledge = new KnowledgeWorkspace();
    const scope = { ownerAccountId: "acc_1" };

    const note = knowledge.createItem({
      scope,
      type: "note",
      title: "University Application",
      content: "Main checklist and deadlines.",
      tags: ["education", "application"],
    });

    const research = knowledge.createItem({
      scope,
      type: "research",
      title: "Scholarship options",
      content: "Funding programs and requirements.",
      tags: ["education", "funding"],
    });

    knowledge.relate(note.id, research.id);

    const cluster = knowledge.relatedCluster(note.id);

    expect(cluster.map(item => item.id)).toContain(note.id);
    expect(cluster.map(item => item.id)).toContain(research.id);
  });
});
