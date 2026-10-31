'use client';

import { compare } from 'fast-json-patch';
import { Globe, RotateCcw, Share2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { publishSite, publishSiteChanges, type SavedSite, saveSiteDraft } from '@/lib/site-api';
import { useAutosave } from '@/lib/use-autosave';
import { useSavedDocument } from '@/lib/use-saved-document';
import { useUndoable } from '@/lib/use-undoable';
import {
  checkPublishedSite,
  LOCAL_PHOTO_PROBLEM,
  publicSitePath,
  siteEditorPath,
} from '@/sites/published-site';
import { slugify } from '@/sites/slug';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';
import { HistoryActions } from './editor-actions';
import { PublishDialog } from './publish-dialog';
import { ShareDialog } from './share-dialog';
import { SiteAgent } from './site-agent';
import { SiteWorkspace } from './site-workspace';

type Values = Record<string, unknown>;

export interface OpenedSite {
  id: string;
  slug: string;
  content: Values;
  draft: Values | null;
  updatedAt: string;
}

interface Published {
  site: SavedSite;
  content: Values;
}

const isValues = (value: unknown): value is Values =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const holdsLocalPhoto = (values: Values): boolean => /"(blob|data):/.test(JSON.stringify(values));

const statusText = (localPhoto: boolean, problem: string | null, unpublished: boolean) => {
  if (localPhoto) {
    return LOCAL_PHOTO_PROBLEM;
  }
  return problem ?? (unpublished ? 'Unsaved preview changes' : null);
};

const PrimaryLabel = ({ published, dirty }: { published: boolean; dirty: boolean }) => {
  if (!published) {
    return (
      <>
        <Globe />
        Save locally
      </>
    );
  }
  return dirty ? (
    <>
      <Globe />
      Save changes
    </>
  ) : (
    <>
      <Share2 />
      Open local preview
    </>
  );
};

const Editor = ({ template, opened }: { template: SiteTemplate; opened: OpenedSite | null }) => {
  const history = useUndoable<Values>(opened?.draft ?? opened?.content ?? template.defaults);
  const [published, setPublished] = useState<Published | null>(
    opened === null ? null : { site: opened, content: opened.content },
  );
  const [publishing, setPublishing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [host, setHost] = useState('');
  const values = history.value;

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const clearLocalDraft = useSavedDocument<Values>({
    key: published === null ? `neuclip-site-draft:${template.id}` : null,
    value: values,
    parse: (saved) => (isValues(saved) && template.schema.safeParse(saved).success ? saved : null),
    restore: history.reset,
  });

  const siteId = published?.site.id ?? null;
  const saveDraft = useCallback(
    (content: Values) => {
      if (siteId !== null) {
        saveSiteDraft(siteId, content).catch(() => undefined);
      }
    },
    [siteId],
  );
  useAutosave(values, siteId === null ? undefined : saveDraft);

  const markPublished = (site: SavedSite) => {
    clearLocalDraft();
    setProblem(null);
    setPublished({ site, content: values });
  };

  const publish = async (slug: string): Promise<string | null> => {
    const checked = checkPublishedSite({ slug, templateId: template.id, content: values });
    if (!checked.ok) {
      return checked.error;
    }
    const result = await publishSite(checked.site);
    if (!result.ok) {
      return result.problem;
    }
    markPublished(result.value.site);
    setPublishing(false);
    setSharing(true);
    window.history.replaceState(null, '', siteEditorPath(result.value.site.id));
    return null;
  };

  const publishChanges = async ({ site }: Published) => {
    const result = await publishSiteChanges(site.id, { slug: site.slug, content: values });
    if (result.ok) {
      markPublished(result.value.site);
    } else {
      setProblem(result.problem);
    }
  };

  const dirty = useMemo(
    () => published === null || compare(published.content, values).length > 0,
    [published, values],
  );
  const addressSlug = published?.site.slug ?? slugify(template.headline(values));
  const localPhoto = holdsLocalPhoto(values);

  const onPrimary = () => {
    if (published === null) {
      setPublishing(true);
    } else if (dirty) {
      publishChanges(published).catch(() => setProblem('Could not reach the server.'));
    } else {
      setSharing(true);
    }
  };

  return (
    <SiteAgent
      chatKey={`neuclip-site:${opened?.id ?? template.id}`}
      template={template}
      values={values}
      onChange={history.set}
    >
      <SiteWorkspace
        template={template}
        values={values}
        onChange={history.set}
        address={`${host}/s/${addressSlug}`}
        liveUrl={published !== null && !dirty ? publicSitePath(published.site.slug) : null}
        status={statusText(localPhoto, problem, dirty && published !== null)}
        toolbar={
          <>
            <HistoryActions history={history} />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={published !== null && !dirty}
              onClick={() => {
                clearLocalDraft();
                history.set(published?.content ?? template.defaults);
              }}
            >
              <RotateCcw />
              <span className="sr-only sm:not-sr-only">
                {published === null ? 'Reset' : 'Discard changes'}
              </span>
            </Button>
            <Button type="button" size="sm" disabled={localPhoto} onClick={onPrimary}>
              <PrimaryLabel published={published !== null} dirty={dirty} />
            </Button>
          </>
        }
      />
      <PublishDialog
        open={publishing}
        onOpenChange={setPublishing}
        suggestion={template.headline(values)}
        onPublish={publish}
      />
      {published === null ? null : (
        <ShareDialog open={sharing} onOpenChange={setSharing} site={published.site} />
      )}
    </SiteAgent>
  );
};

export const SiteEditor = ({
  templateId,
  opened,
}: {
  templateId: string;
  opened: OpenedSite | null;
}) => {
  const template = findSiteTemplate(templateId);
  return template === undefined ? null : <Editor template={template} opened={opened} />;
};
