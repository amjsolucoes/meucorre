import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#gratis', label: 'Grátis' },
  { href: '#seguranca', label: 'Segurança' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/meu-corre-logo.png" alt="Meu Corre" width={160} height={65} priority />
        </Link>
        <ul className="hidden items-center gap-8 font-body text-sm font-semibold text-text-secondary md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#topo-cadastro"
          className="rounded-full bg-primary px-5 py-2.5 font-body text-sm font-bold text-white transition hover:bg-primary-light"
        >
          Avise-me
        </a>
      </nav>
    </header>
  );
}
