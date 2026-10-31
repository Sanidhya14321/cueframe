import { Cake, Camera, Car, Coffee, Gift, Heart, Moon, Music, Snowflake } from 'lucide-react';
import type { ComponentType } from 'react';
import type { SnowDayIcon } from '@/sites/templates/birthdays/snow-day-one';
import { Mitten } from './ornaments';

const MittenIcon = ({ className }: { className: string }) => (
  <Mitten className={className} cuff="var(--sd-ice)" />
);

const ICONS: Record<SnowDayIcon, ComponentType<{ className: string }>> = {
  snowflake: Snowflake,
  mitten: MittenIcon,
  cocoa: Coffee,
  cake: Cake,
  gift: Gift,
  camera: Camera,
  music: Music,
  moon: Moon,
  car: Car,
  heart: Heart,
};

export const PartyIcon = ({ icon, className }: { icon: SnowDayIcon; className: string }) => {
  const Icon = ICONS[icon];
  return <Icon className={className} />;
};
