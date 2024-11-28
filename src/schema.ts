import { z } from 'zod';

export const LHRJSONSchema = z.object({
  runtimeError: z.object({
    code: z.string().optional(),
    message: z.string().optional(),
  }).optional(),

  requestedUrl: z.string().optional(),

  categories: z.object({
    accessibility: z.object({
      score: z.number(),
    }).optional(),
    'best-practices': z.object({
      score: z.number(),
    }).optional(),
    performance: z.object({
      score: z.number(),
    }).optional(),
    pwa: z.object({
      score: z.number(),
    }).optional(),
    seo: z.object({
      score: z.number(),
    }).optional(),
  }),
  audits: z.object({
    'largest-contentful-paint': z.object({ numericValue: z.number() }).optional(),
    'first-contentful-paint': z.object({ numericValue: z.number() }).optional(),
    'cumulative-layout-shift': z.object({ numericValue: z.number() }).optional(),
    'max-potential-fid': z.object({ numericValue: z.number() }).optional(),
    interactive: z.object({ numericValue: z.number() }).optional(),
    'mainthread-work-breakdown': z.object({ numericValue: z.number() }).optional(),
    'unused-javascript': z.object({ numericValue: z.number() }).optional(),
    'unused-css-rules': z.object({ numericValue: z.number() }).optional(),
    'modern-image-formats': z.object({ numericValue: z.number() }).optional(),
    'uses-optimized-images': z.object({ numericValue: z.number() }).optional(),
    'render-blocking-resources': z.object({ numericValue: z.number() }).optional(),
    'bootup-time': z.object({ numericValue: z.number() }).optional(),
    'server-response-time': z.object({ numericValue: z.number() }).optional(),
    'speed-index': z.object({ numericValue: z.number() }).optional(),
    'dom-size': z.object({ numericValue: z.number() }).optional(),
    'total-blocking-time': z.object({ numericValue: z.number() }).optional(),
  }),
});

export type LHRJSONSchemaType = z.infer<typeof LHRJSONSchema>;
