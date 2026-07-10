import type { ReactNode } from 'react';

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <a
        href="/"
        className="font-body text-sm font-semibold text-primary underline-offset-2 hover:underline"
      >
        ← Voltar para o início
      </a>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 font-body text-sm text-text-hint">Última atualização: {updatedAt}</p>
      <div className="mt-10 space-y-8 font-body text-sm leading-relaxed text-text-secondary [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_p]:mt-2">
        {children}
      </div>
    </main>
  );
}
