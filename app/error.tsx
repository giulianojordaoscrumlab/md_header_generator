'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 50 }}>
      <h2>Algo deu errado 😢</h2>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  );
}
