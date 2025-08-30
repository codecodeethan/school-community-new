import React, { ReactNode } from 'react';

export default function Sclayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}
