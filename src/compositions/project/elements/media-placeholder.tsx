export const MediaPlaceholder = ({ label }: { label: string }) => (
  <div
    style={{
      width: 640,
      height: 360,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
      border: '4px dashed rgba(245,245,245,0.3)',
      color: 'rgba(245,245,245,0.5)',
      fontFamily: 'Inter, sans-serif',
      fontSize: 36,
      textTransform: 'uppercase',
      letterSpacing: 4,
    }}
  >
    {label}
  </div>
);
