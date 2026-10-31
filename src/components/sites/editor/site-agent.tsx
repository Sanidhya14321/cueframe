'use client';

import { type ReactNode, useMemo } from 'react';
import type { SiteDocument } from '@/agent/site';
import { AgentWorkspace } from '@/components/media-agent/agent-workspace';
import type { SiteTemplate } from '@/sites/types';

interface SiteAgentProps {
  chatKey: string;
  template: SiteTemplate;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  children: ReactNode;
}

const NO_FOCUS: readonly string[] = [];

export const SiteAgent = ({ chatKey, template, values, onChange, children }: SiteAgentProps) => {
  const document = useMemo<SiteDocument>(
    () => ({ templateId: template.id, content: values }),
    [template.id, values],
  );
  return (
    <AgentWorkspace
      kind="site"
      chatKey={chatKey}
      title={template.headline(values)}
      document={document}
      focus={NO_FOCUS}
      onChange={(next) => onChange(next.content)}
    >
      {children}
    </AgentWorkspace>
  );
};
