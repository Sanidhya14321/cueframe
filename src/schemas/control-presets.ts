export const LOOK = {
  showBackdrop: { path: 'look.showBackdrop', label: 'Show background' },
  background: { path: 'look.background', label: 'Background' },
  backgroundEdge: {
    path: 'look.backgroundEdge',
    label: 'Background edge',
    hint: 'Color the background fades to at the corners',
  },
  ink: { path: 'look.ink', label: 'Text color' },
  muted: { path: 'look.muted', label: 'Secondary text color' },
  accent: { path: 'look.accent', label: 'Accent color' },
  grain: { path: 'look.grain', label: 'Film grain' },
  liveGrain: { path: 'look.liveGrain', label: 'Animate grain' },
  spotlight: { path: 'look.spotlight', label: 'Spotlight glow' },
  paper: { path: 'look.paper', label: 'Paper pattern' },
  paperLine: { path: 'look.paperLine', label: 'Paper line color' },
  paperSpacing: { path: 'look.paperSpacing', label: 'Paper line spacing' },
  paperMargin: { path: 'look.paperMargin', label: 'Paper margin line' },
} as const;

export const MOTION = {
  enter: { path: 'motion.enter', label: 'Entrance' },
  enterFrames: { path: 'motion.enterFrames', label: 'Entrance length', hint: 'In frames' },
  exit: { path: 'motion.exit', label: 'Exit' },
  exitFrames: { path: 'motion.exitFrames', label: 'Exit length', hint: 'In frames' },
  float: { path: 'motion.float', label: 'Idle float', hint: 'Gentle drift while on screen' },
  speed: {
    path: 'motion.speed',
    label: 'Animation speed',
    hint: 'Speeds up the scene itself; the entrance and exit keep their own length',
  },
} as const;

export const PLACEMENT = {
  horizontal: { path: 'placement.horizontal', label: 'Horizontal align' },
  vertical: { path: 'placement.vertical', label: 'Vertical align' },
  insetX: { path: 'placement.insetX', label: 'Side margin' },
  insetY: { path: 'placement.insetY', label: 'Top and bottom margin' },
  width: { path: 'placement.width', label: 'Text box width' },
} as const;

export const STAGE = {
  cameraDistance: { path: 'stage.cameraDistance', label: 'Camera distance' },
  fieldOfView: { path: 'stage.fieldOfView', label: 'Field of view' },
  keyLight: { path: 'stage.keyLight', label: 'Key light' },
  reflections: { path: 'stage.reflections', label: 'Reflections' },
  shadow: { path: 'stage.shadow', label: 'Shadow strength' },
  shadowSoftness: { path: 'stage.shadowSoftness', label: 'Shadow softness' },
  cameraDrift: { path: 'stage.cameraDrift', label: 'Camera drift' },
} as const;
