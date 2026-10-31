import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { PropertyPanel } from '@/components/timeline/property-panel/property-panel';
import { createImageElement, createShapeElement, createTextElement, type Element } from '@/project';

const renderPanel = (element: Element | null) => {
  const onChange = mock();
  const onDelete = mock();
  render(<PropertyPanel element={element} onChange={onChange} onDelete={onDelete} />);
  return { onChange, onDelete };
};

describe('PropertyPanel', () => {
  it('prompts to select when nothing is selected', () => {
    renderPanel(null);
    expect(screen.getByText(/select an element/i)).toBeInTheDocument();
  });

  it('renders transform, timing and entrance sections for any element', () => {
    renderPanel(createTextElement({ id: 't1' }));
    expect(screen.getByText('Transform')).toBeInTheDocument();
    expect(screen.getByText('Timing')).toBeInTheDocument();
    expect(screen.getByText('Entrance')).toBeInTheDocument();
  });

  it('edits text content through the content field', () => {
    const element = createTextElement({ id: 't1', content: 'Hello' });
    const { onChange } = renderPanel(element);
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'World' } });
    expect(onChange).toHaveBeenCalledWith({ ...element, content: 'World' });
  });

  it('edits the from frame in the timing section', () => {
    const element = createTextElement({ id: 't1', from: 10 });
    const { onChange } = renderPanel(element);
    fireEvent.change(screen.getByLabelText('From (frame)'), { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith({ ...element, from: 42 });
  });

  it('edits the x transform value', () => {
    const element = createShapeElement('rect', { id: 's1' });
    const { onChange } = renderPanel(element);
    fireEvent.change(screen.getByLabelText('X'), { target: { value: '120' } });
    expect(onChange).toHaveBeenCalledWith({
      ...element,
      transform: { ...element.transform, x: 120 },
    });
  });

  it('shows shape controls and edits the color', () => {
    const element = createShapeElement('rect', { id: 's1', color: '#ffffff' });
    const { onChange } = renderPanel(element);
    expect(screen.getByText('Shape')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Color swatch'), { target: { value: '#112233' } });
    expect(onChange).toHaveBeenCalledWith({ ...element, color: '#112233' });
  });

  it('shows the media source field for image elements', () => {
    const element = createImageElement({ id: 'i1' });
    const { onChange } = renderPanel(element);
    expect(screen.getByText('Image')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Source'), { target: { value: '/x.png' } });
    expect(onChange).toHaveBeenCalledWith({ ...element, src: '/x.png' });
  });

  it('deletes the selected element', () => {
    const element = createTextElement({ id: 't1' });
    const { onDelete } = renderPanel(element);
    fireEvent.click(screen.getByRole('button', { name: 'Delete element' }));
    expect(onDelete).toHaveBeenCalledWith('t1');
  });
});
