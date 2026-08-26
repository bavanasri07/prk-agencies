import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { listSiteMedia, upsertSiteMedia } from "./db";
import { z } from "zod";

const mediaUrl = z.string().refine((value) => /^https?:\/\//.test(value) || value.startsWith("/manus-storage/"), "Use an https URL or /manus-storage path");

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  media: router({
    list: publicProcedure.query(() => listSiteMedia()),
    upsert: adminProcedure
      .input(z.object({
        sectionKey: z.string().min(1).max(64),
        imageUrl: mediaUrl.nullable().optional(),
        videoUrl: mediaUrl.nullable().optional(),
        posterUrl: mediaUrl.nullable().optional(),
        altText: z.string().max(500).nullable().optional(),
        caption: z.string().max(500).nullable().optional(),
        isActive: z.number().int().min(0).max(1).optional(),
      }))
      .mutation(({ input }) => upsertSiteMedia(input)),
  }),
});

export type AppRouter = typeof appRouter;
