import type { SiteTemplate } from '../types';
import {
  pumpkinPatchDefaults,
  pumpkinPatchMeta,
  pumpkinPatchSchema,
} from './baby-showers/pumpkin-patch';
import { pumpkinPatchControls } from './baby-showers/pumpkin-patch-controls';
import { snowDayOneDefaults, snowDayOneMeta, snowDayOneSchema } from './birthdays/snow-day-one';
import { snowDayOneControls } from './birthdays/snow-day-one-controls';
import {
  midnightCrownDefaults,
  midnightCrownMeta,
  midnightCrownSchema,
} from './quinceaneras/midnight-crown';
import { midnightCrownControls } from './quinceaneras/midnight-crown-controls';
import { emeraldRoseDefaults, emeraldRoseMeta, emeraldRoseSchema } from './weddings/emerald-rose';
import { emeraldRoseControls } from './weddings/emerald-rose-controls';
import { inkAndLaceDefaults, inkAndLaceMeta, inkAndLaceSchema } from './weddings/ink-and-lace';
import { inkAndLaceControls } from './weddings/ink-and-lace-controls';

export const SITE_TEMPLATES: readonly SiteTemplate[] = [
  {
    id: emeraldRoseMeta.id,
    meta: emeraldRoseMeta,
    schema: emeraldRoseSchema,
    defaults: emeraldRoseDefaults,
    controls: emeraldRoseControls,
    headline: (content) => {
      const parsed = emeraldRoseSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.couple.firstName} & ${parsed.data.couple.secondName}`
        : emeraldRoseMeta.title;
    },
  },
  {
    id: inkAndLaceMeta.id,
    meta: inkAndLaceMeta,
    schema: inkAndLaceSchema,
    defaults: inkAndLaceDefaults,
    controls: inkAndLaceControls,
    headline: (content) => {
      const parsed = inkAndLaceSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.couple.firstName} & ${parsed.data.couple.secondName}`
        : inkAndLaceMeta.title;
    },
  },
  {
    id: snowDayOneMeta.id,
    meta: snowDayOneMeta,
    schema: snowDayOneSchema,
    defaults: snowDayOneDefaults,
    controls: snowDayOneControls,
    headline: (content) => {
      const parsed = snowDayOneSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.child.name} turns ${parsed.data.child.ageWord}`
        : snowDayOneMeta.title;
    },
  },
  {
    id: midnightCrownMeta.id,
    meta: midnightCrownMeta,
    schema: midnightCrownSchema,
    defaults: midnightCrownDefaults,
    controls: midnightCrownControls,
    headline: (content) => {
      const parsed = midnightCrownSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.celebrant.firstName}'s ${parsed.data.celebrant.years}`
        : midnightCrownMeta.title;
    },
  },
  {
    id: pumpkinPatchMeta.id,
    meta: pumpkinPatchMeta,
    schema: pumpkinPatchSchema,
    defaults: pumpkinPatchDefaults,
    controls: pumpkinPatchControls,
    headline: (content) => {
      const parsed = pumpkinPatchSchema.safeParse(content);
      return parsed.success
        ? `${parsed.data.family.parentOne} & ${parsed.data.family.parentTwo}'s baby shower`
        : pumpkinPatchMeta.title;
    },
  },
];

export const findSiteTemplate = (id: string): SiteTemplate | undefined =>
  SITE_TEMPLATES.find((template) => template.id === id);
