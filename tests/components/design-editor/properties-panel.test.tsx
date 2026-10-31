import { describe, expect, it } from 'bun:test';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { PropertiesPanel } from '@/components/design-editor/panels/properties-panel';
import { useDesignEditor } from '@/components/design-editor/use-design-editor';
import {
  createDesign,
  createIcon,
  createImage,
  createRect,
  createText,
  type DesignElement,
} from '@/design';

const setup = (element: DesignElement) => {
  const hook = renderHook(() =>
    useDesignEditor(createDesign({ background: '#fff', elements: [element] })),
  );
  act(() => hook.result.current.select([element.id]));
  const view = render(<PropertiesPanel editor={hook.result.current} />);
  const rerender = () => view.rerender(<PropertiesPanel editor={hook.result.current} />);
  return { hook, rerender };
};

describe('PropertiesPanel', () => {
  it('shows page settings when nothing is selected', () => {
    const { result } = renderHook(() => useDesignEditor(createDesign()));
    render(<PropertiesPanel editor={result.current} />);
    expect(screen.queryByRole('heading', { name: 'Colors' })).not.toBeInTheDocument();
    expect(screen.getByText(/1080 × 1080 px/)).toBeInTheDocument();
  });

  it('edits text content and toggles styles', () => {
    const { hook, rerender } = setup(createText({ id: 't', text: 'Hello' }));
    fireEvent.change(screen.getByLabelText('Text content'), { target: { value: 'Hiring now' } });
    rerender();
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    rerender();
    fireEvent.click(screen.getByRole('button', { name: 'Uppercase' }));
    const text = hook.result.current.design.elements[0];
    expect(text).toMatchObject({ text: 'Hiring now', italic: true, uppercase: true });
  });

  it('applies image filter presets and fit modes', () => {
    const { hook, rerender } = setup(createImage({ id: 'i' }));
    fireEvent.click(screen.getByRole('button', { name: 'noir' }));
    rerender();
    fireEvent.click(screen.getByRole('button', { name: 'Fit contain' }));
    rerender();
    fireEvent.click(screen.getByRole('button', { name: 'Flip horizontal' }));
    const image = hook.result.current.design.elements[0];
    expect(image).toMatchObject({ fit: 'contain', flipX: true, filters: { grayscale: 1 } });
  });

  it('changes icons and toggles shadows', () => {
    const { hook, rerender } = setup(createIcon({ id: 'c', icon: 'star' }));
    fireEvent.click(screen.getByRole('button', { name: 'Icon rocket' }));
    rerender();
    fireEvent.click(screen.getByRole('switch', { name: 'Toggle shadow' }));
    const icon = hook.result.current.design.elements[0];
    expect(icon).toMatchObject({ icon: 'rocket', shadow: { blur: 24 } });
  });

  it('switches a shape fill to a gradient and runs actions', () => {
    const { hook, rerender } = setup(createRect({ id: 'r' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fill linear' }));
    rerender();
    expect(hook.result.current.design.elements[0]).toMatchObject({ fill: { type: 'linear' } });
    fireEvent.click(screen.getByRole('button', { name: 'Duplicate' }));
    expect(hook.result.current.design.elements).toHaveLength(2);
  });
});
