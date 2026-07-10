import Image from 'next/image';
import Link from 'next/link';

const LEGAL_LINKS = [
  { href: '/politica-de-privacidade', label: 'Política de Privacidade' },
  { href: '/termos-de-uso', label: 'Termos de Uso' },
  { href: '/exclusao-de-conta', label: 'Exclusão de Conta' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image src="/meu-corre-logo.png" alt="Meu Corre" width={140} height={57} />

          <nav aria-label="Links legais">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-body text-sm font-semibold text-text-secondary">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="font-body text-sm text-text-secondary">
            Dúvidas?{' '}
            <a href="mailto:suporte@amjsolucoes.com" className="font-semibold text-primary">
              suporte@amjsolucoes.com
            </a>
          </p>

          <div className="flex flex-col items-center gap-2 pt-6">
            <span className="font-body text-xs uppercase tracking-widest text-text-hint">
              Desenvolvido por
            </span>
            <Image src="/logo-amj-cinza.png" alt="AMJ Inovações e Serviços" width={120} height={88} />
          </div>

          <p className="font-body text-xs text-text-hint">
            © {new Date().getFullYear()} AMJ Inovações e Serviços — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
