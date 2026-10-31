import type { ComponentType, CSSProperties } from 'react';

export interface SiteBodyProps<Content> {
  content: Content;
}

export interface SiteIntroProps<Content> {
  content: Content;
  position: 'fixed' | 'absolute';
  onOpened: () => void;
}

export interface SiteView<Content> {
  scope: (content: Content) => { className: string; style: CSSProperties };
  Body: ComponentType<SiteBodyProps<Content>>;
  Intro: ComponentType<SiteIntroProps<Content>>;
  hasIntro: (content: Content) => boolean;
}
