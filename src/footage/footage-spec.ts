export const PLATE_STAMP = { rows: 16, bits: 8 } as const;

type FootageStill = {
  name: string;
  model: string;
  prompt: string;
  aspectRatio: string;
  from?: string;
  publishWidth?: number;
};

type Corner = [number, number];

type PageCorners = [Corner, Corner, Corner, Corner];

export type FootageTracking = {
  anchors: {
    frame: number;
    quads: Record<string, PageCorners>;
    range?: [number, number];
    margin?: number;
    color?: { rgb: [number, number, number]; reach: number };
  }[];
  shared?: [string, number, string, number][];
  doors?: { band: [number, number]; doorway: [number, number] };
};

type FootageShot = {
  name: string;
  model: string;
  prompt: string;
  providerOptions?: Record<string, { parameters: Record<string, unknown> }>;
  seconds: number;
  firstFrame: string;
  lastFrame?: string;
  tracking: FootageTracking;
};

export type PlateSegment = {
  shot: string;
  from: number;
  to: number;
  step?: number;
  blend?: number;
};

export type FootageSpec = {
  id: string;
  aspectRatio: '9:16' | '16:9';
  resolution: '720p' | '1080p';
  width: number;
  height: number;
  fps: number;
  stills: FootageStill[];
  shots: FootageShot[];
  plate: PlateSegment[];
};
