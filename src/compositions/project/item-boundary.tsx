import { Component, type ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
export class ItemBoundary extends Component<
  { children: ReactNode; id: string },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? (
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#18181b',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        This item could not render. Edit or remove it to continue.
      </AbsoluteFill>
    ) : (
      this.props.children
    );
  }
}
