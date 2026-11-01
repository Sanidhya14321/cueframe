'use client';

type Props = { reset: () => void };

const GlobalError = ({ reset }: Props) => (
  <html lang="en">
    <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '96px 16px' }}>
      <main style={{ margin: '0 auto', maxWidth: 420 }}>
        <h1>cueframe could not load</h1>
        <p>Your saved work is safe. Reload to try again.</p>
        <button type="button" onClick={reset}>
          Reload
        </button>
      </main>
    </body>
  </html>
);

export default GlobalError;
