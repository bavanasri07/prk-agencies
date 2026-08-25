import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("media.list", () => {
  it("returns active media records as an array", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const records = await appRouter.createCaller(ctx).media.list();
    expect(Array.isArray(records)).toBe(true);
    records.forEach((record) => {
      expect(record).toHaveProperty("sectionKey");
      expect(record.isActive).toBe(1);
    });
  });
});
