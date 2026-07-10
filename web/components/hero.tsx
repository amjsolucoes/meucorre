import Image from 'next/image';
import { WaitlistForm } from '@/components/waitlist-form';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 800 400"
        className="pointer-events-none absolute -right-24 top-10 hidden w-[560px] text-accent/15 lg:block"
      >
        <polyline
          points="0,320 120,260 220,300 320,180 420,220 540,80 650,120 800,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
            Para autônomos brasileiros
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
            Seu corre, organizado.
          </h1>
          <p className="mt-5 max-w-md font-body text-lg text-text-secondary">
            Registre ganhos, gastos, clientes e agenda em segundos. Tudo num app simples, feito
            para quem trabalha por conta própria — e 100% gratuito.
          </p>

          <div id="topo-cadastro" className="mt-8 flex flex-col gap-4">
            <WaitlistForm />
            <div className="flex flex-wrap items-center gap-4">
              <PlayStoreButton />
              <span
                aria-disabled="true"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-body text-xs font-semibold text-text-hint"
              >
                App Store — em breve
              </span>
            </div>
            <p className="font-body text-xs font-semibold text-text-hint">
              Grátis pra sempre · Sem anúncios · Seus dados são seus
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-sm justify-center gap-4">
          <PhoneFrame
            src="/screenshot-dashboard.png"
            alt="Tela inicial do Meu Corre mostrando o saldo do mês"
            className="translate-y-6"
          />
          <PhoneFrame
            src="/screenshot-novo-ganho.png"
            alt="Tela de novo ganho do Meu Corre"
            className="-translate-y-6"
          />
        </div>
      </div>
    </section>
  );
}

function PlayStoreButton() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.amjsolucoes.meucorre"
      className="flex items-center gap-3 rounded-xl bg-text-primary px-4 py-2.5 text-white transition hover:bg-black"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M5 3.9c0-.9 1-1.4 1.7-.9l14 8.1c.7.4.7 1.4 0 1.8l-14 8.1c-.7.5-1.7 0-1.7-.9V3.9Z" />
      </svg>
      <span className="text-left font-body leading-tight">
        <span className="block text-[10px] text-white/70">Disponível no</span>
        <span className="block text-sm font-bold">Google Play</span>
      </span>
    </a>
  );
}

function PhoneFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`w-40 overflow-hidden rounded-[28px] border-4 border-text-primary/90 shadow-xl sm:w-48 ${className}`}
    >
      <Image src={src} alt={alt} width={270} height={600} className="h-auto w-full" />
    </div>
  );
}
