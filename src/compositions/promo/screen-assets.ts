import { staticFile } from 'remotion';
import type { PromoCardId, PromoPhone, PromoScreenId } from '@/schemas';
import cardGoal from './assets/card-goal.png';
import cardGrowth from './assets/card-growth.png';
import cardIncome from './assets/card-income.png';
import iconArt from './assets/icon-art.png';
import iconGlyph from './assets/icon-glyph.png';
import activity from './assets/screen-activity.jpg';
import analytics from './assets/screen-analytics.jpg';
import calendar from './assets/screen-calendar.jpg';
import chat from './assets/screen-chat.jpg';
import feed from './assets/screen-feed.jpg';
import home from './assets/screen-home.jpg';
import map from './assets/screen-map.jpg';
import messages from './assets/screen-messages.jpg';
import music from './assets/screen-music.jpg';
import onboarding from './assets/screen-onboarding.jpg';
import profile from './assets/screen-profile.jpg';
import rideNearby from './assets/screen-ride-nearby.jpg';
import rideReceipt from './assets/screen-ride-receipt.jpg';
import rideUnlock from './assets/screen-ride-unlock.jpg';
import rideWelcome from './assets/screen-ride-welcome.jpg';
import settings from './assets/screen-settings.jpg';
import tasks from './assets/screen-tasks.jpg';
import wallet from './assets/screen-wallet.jpg';

type ImportedAsset = string | { src: string };

const url = (asset: ImportedAsset): string => (typeof asset === 'string' ? asset : asset.src);

const SCREENS: Record<PromoScreenId, ImportedAsset> = {
  home,
  onboarding,
  analytics,
  tasks,
  calendar,
  messages,
  wallet,
  chat,
  activity,
  feed,
  music,
  map,
  profile,
  settings,
  'ride-welcome': rideWelcome,
  'ride-unlock': rideUnlock,
  'ride-nearby': rideNearby,
  'ride-receipt': rideReceipt,
};

const CARDS: Record<PromoCardId, ImportedAsset> = {
  income: cardIncome,
  growth: cardGrowth,
  goal: cardGoal,
};

const TALL_SCREENS = new Set<PromoScreenId>(['feed']);

const ABSOLUTE = /^(https?:|data:|blob:|\/)/;

export const resolveCustom = (value: string): string =>
  ABSOLUTE.test(value) ? value : staticFile(value);

export const screenUrl = (phone: PromoPhone): string =>
  phone.customScreen.length > 0 ? resolveCustom(phone.customScreen) : url(SCREENS[phone.screen]);

export const isTallScreen = (phone: PromoPhone): boolean =>
  phone.customScreen.length === 0 && TALL_SCREENS.has(phone.screen);

export const cardUrl = (id: PromoCardId): string => url(CARDS[id]);

export const glyphUrl = (customGlyph: string): string =>
  customGlyph.length > 0 ? resolveCustom(customGlyph) : url(iconGlyph);

export const artUrl = (customArt: string): string =>
  customArt.length > 0 ? resolveCustom(customArt) : url(iconArt);
