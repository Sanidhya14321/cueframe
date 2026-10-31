import { loadFont as loadBodoniModa } from '@remotion/google-fonts/BodoniModa';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import type { BotanicalSaveTheDateProps } from '@/schemas';
import { inviteScriptFonts, inviteSerifFonts } from '../fonts';
import type { FloralInks } from './spray';
import type { Voice } from './type';

loadBodoniModa('normal', { weights: ['600', '700', '800', '900'], subsets: ['latin'] });
loadCinzel('normal', { weights: ['800', '900'], subsets: ['latin'] });

export const voiceOf = (props: BotanicalSaveTheDateProps): Voice => ({
  serif: inviteSerifFonts[props.serifFont],
  display: inviteSerifFonts[props.displayFont],
  script: inviteScriptFonts[props.scriptFont],
  ink: props.look.ink,
  muted: props.look.muted,
  accent: props.look.accent,
  tracking: props.lettering.tracking,
});

export const inksOf = (props: BotanicalSaveTheDateProps, id: string): FloralInks => ({
  greens: { id, base: props.florals.leaf },
  ghost: props.florals.ghost,
  gold: props.florals.gold,
  petal: props.florals.petal,
  heart: props.florals.heart,
  goldLines: props.florals.goldLines,
});
