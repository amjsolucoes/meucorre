import Link from 'next/link';
import { Lock, ShieldCheck, Trash2, type LucideIcon } from 'lucide-react';

const ITEMS: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Lock,
    title: 'Criptografia de ponta',
    description: 'Seus dados são protegidos em trânsito e em repouso.',
  },
  {
    Icon: ShieldCheck,
    title: 'Conformidade com a LGPD',
    description: 'Você tem controle total sobre seus dados pessoais.',
  },
  {
    Icon: Trash2,
    title: 'Exclusão garantida',
    description: 'Peça a exclusão da sua conta quando quiser, dentro do app ou por aqui.',
  },
];

export function TrustSection() {
  return (
    <section id="seguranca" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-xl">
        <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
          Segurança e privacidade
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
          Seus dados são exclusivamente seus
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {ITEMS.map(({ Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-text-primary">{title}</h3>
            <p className="mt-2 font-body text-sm text-text-secondary">{description}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 font-body text-sm text-text-secondary">
        Quer excluir sua conta sem abrir o app?{' '}
        <Link
          href="/exclusao-de-conta"
          className="font-semibold text-primary underline underline-offset-2"
        >
          Veja como pedir a exclusão
        </Link>
        .
      </p>
    </section>
  );
}
