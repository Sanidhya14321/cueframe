import { z } from 'zod';

export const INVITE_SCRIPT_FONTS = ['great-vibes', 'parisienne', 'pinyon-script'] as const;

export type InviteScriptFont = (typeof INVITE_SCRIPT_FONTS)[number];

export const inviteScriptFontSchema = z.enum(INVITE_SCRIPT_FONTS);

export const INVITE_SERIF_FONTS = ['cinzel', 'marcellus', 'bodoni'] as const;

export type InviteSerifFont = (typeof INVITE_SERIF_FONTS)[number];

export const inviteSerifFontSchema = z.enum(INVITE_SERIF_FONTS);
