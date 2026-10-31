'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  cssFontFamily,
  type DesignControl,
  FONT_FAMILIES,
  setControlValue,
  setListItem,
} from '@/design';
import { loadFontFamily } from '../font-loader';
import { ColorInput } from '../panels/fields';
import type { DesignEditorState } from '../use-design-editor';

type ControlOf<Kind extends DesignControl['kind']> = Extract<DesignControl, { kind: Kind }>;

const Hint = ({ text }: { text: string | undefined }) =>
  text === undefined ? null : <p className="text-[11px] text-muted-foreground">{text}</p>;

const Field = ({ control, children }: { control: DesignControl; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="font-medium text-[12px]">{control.label}</span>
    {children}
    <Hint text={control.hint} />
  </div>
);

const ColorControl = ({
  control,
  editor,
}: {
  control: ControlOf<'color'>;
  editor: DesignEditorState;
}) => (
  <Field control={control}>
    <ColorInput
      label={control.label}
      value={control.value}
      onChange={(color, live) =>
        editor.transform((current) => setControlValue(current, control.id, color), live)
      }
      onCommit={editor.seal}
    />
  </Field>
);

const FontControl = ({
  control,
  editor,
}: {
  control: ControlOf<'font'>;
  editor: DesignEditorState;
}) => (
  <Field control={control}>
    <Select
      value={control.value}
      onValueChange={(family) => {
        loadFontFamily(family).catch(() => undefined);
        editor.transform((current) => setControlValue(current, control.id, family));
      }}
    >
      <SelectTrigger className="h-8 w-full" aria-label={control.label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {FONT_FAMILIES.map((font) => (
          <SelectItem
            key={font.family}
            value={font.family}
            onMouseEnter={() => loadFontFamily(font.family).catch(() => undefined)}
          >
            <span style={{ fontFamily: cssFontFamily(font.family) }}>{font.family}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Field>
);

const TextControl = ({
  control,
  editor,
}: {
  control: ControlOf<'text'>;
  editor: DesignEditorState;
}) => {
  const first = editor.design.elements.find(
    (element) => element.id === control.targets[0]?.element,
  );
  const value = first?.type === 'text' ? first.text : control.value;
  return (
    <Field control={control}>
      <Textarea
        aria-label={control.label}
        rows={1}
        value={value}
        onFocus={() => {
          if (first !== undefined) {
            editor.focusElement(first.id);
          }
        }}
        onChange={(event) =>
          editor.transform((current) => setControlValue(current, control.id, event.target.value))
        }
        className="min-h-9 py-1.5"
      />
    </Field>
  );
};

const textOf = (editor: DesignEditorState, id: string | undefined, fallback: string): string => {
  const element = editor.design.elements.find((item) => item.id === id);
  return element?.type === 'text' ? element.text : fallback;
};

const ListControl = ({
  control,
  editor,
}: {
  control: ControlOf<'list'>;
  editor: DesignEditorState;
}) => (
  <Field control={control}>
    <div className="flex flex-col gap-1.5">
      {control.values.map((fallback, index) => {
        const first = control.targets[index]?.[0]?.element;
        return (
          <Textarea
            key={`${control.id}:${index}`}
            aria-label={`${control.label} ${index + 1}`}
            rows={1}
            value={textOf(editor, first, fallback)}
            onFocus={() => {
              if (first !== undefined) {
                editor.focusElement(first);
              }
            }}
            onChange={(event) =>
              editor.transform((current) =>
                setListItem(current, control.id, index, event.target.value),
              )
            }
            className="min-h-9 py-1.5"
          />
        );
      })}
    </div>
  </Field>
);

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h3 className="font-medium text-[13px] text-muted-foreground uppercase tracking-wide">
      {title}
    </h3>
    {children}
  </section>
);

const ofKind = <Kind extends DesignControl['kind']>(
  controls: readonly DesignControl[],
  kind: Kind,
): ControlOf<Kind>[] =>
  controls.filter((control): control is ControlOf<Kind> => control.kind === kind);

export const ColorControls = ({ editor }: { editor: DesignEditorState }) => {
  const colors = ofKind(editor.design.controls, 'color');
  return colors.length === 0 ? null : (
    <div className="flex flex-col gap-3" data-testid="color-controls">
      {colors.map((control) => (
        <ColorControl key={control.id} control={control} editor={editor} />
      ))}
    </div>
  );
};

export const ThemePanel = ({ editor }: { editor: DesignEditorState }) => {
  const { controls } = editor.design;
  if (controls.length === 0) {
    return (
      <p className="text-muted-foreground text-xs" data-testid="theme-panel">
        This design has no theme controls. Select an element to edit it.
      </p>
    );
  }
  const fonts = ofKind(controls, 'font');
  const texts = controls.filter(
    (control): control is ControlOf<'text'> | ControlOf<'list'> =>
      control.kind === 'text' || control.kind === 'list',
  );
  return (
    <div className="flex flex-col gap-6" data-testid="theme-panel">
      <Group title="Colors">
        <ColorControls editor={editor} />
      </Group>
      {fonts.length === 0 ? null : (
        <Group title="Fonts">
          {fonts.map((control) => (
            <FontControl key={control.id} control={control} editor={editor} />
          ))}
        </Group>
      )}
      {texts.length === 0 ? null : (
        <Group title="Text">
          {texts.map((control) =>
            control.kind === 'text' ? (
              <TextControl key={control.id} control={control} editor={editor} />
            ) : (
              <ListControl key={control.id} control={control} editor={editor} />
            ),
          )}
        </Group>
      )}
    </div>
  );
};
