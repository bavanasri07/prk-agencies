import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("media.list", () => {
  it("returns active media records as an array", async () => {
    const records = await appRouter.createCaller(createPublicContext()).media.list();
    expect(Array.isArray(records)).toBe(true);
    records.forEach((record) => {
      expect(record).toHaveProperty("sectionKey");
      expect(record.isActive).toBe(1);
    });
  });

  it("includes the PRK Approach intro record for the homepage", async () => {
    const records = await appRouter.createCaller(createPublicContext()).media.list();
    const intro = records.find((record) => record.sectionKey === "intro");
    expect(intro).toBeDefined();
    expect(intro?.imageUrl).toBeTruthy();
    expect(intro?.caption).toBe("THE WORK BEHIND THE ROUTE");
  });
});
