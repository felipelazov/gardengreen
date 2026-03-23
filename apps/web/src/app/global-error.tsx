'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, padding: 24 }}>
          <span style={{ fontSize: 56 }}>🌱</span>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>GardenGreen</h2>
          <p style={{ color: '#57534E', fontSize: 14, textAlign: 'center', maxWidth: 400 }}>
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#16A34A',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
