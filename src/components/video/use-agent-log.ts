'use client';
import { useEffect, useState } from 'react';
import type { AgentLogView } from '@/local/agent-log-schema';

export const useAgentLog = (projectId: string) => {
  const [log, setLog] = useState<AgentLogView>({ listening: false, entries: [] });
  useEffect(() => {
    if (!projectId) {
      return;
    }
    const events = new EventSource(`/api/projects/${projectId}/agent-log`);
    events.onmessage = (event) => setLog(JSON.parse(event.data) as AgentLogView);
    return () => events.close();
  }, [projectId]);
  return log;
};
