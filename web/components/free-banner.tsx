import { Check } from 'lucide-react';

const POINTS = ['Sem mensalidade', 'Sem cartão de crédito', 'Sem anúncios', 'Sem taxas escondidas'];

export function FreeBanner() {
  return (
    <section id="gratis" className="bg-primary py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-5xl">
          100% gratuito. Sempre.
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-white/80">
          O Meu Corre não cobra nada pra você organizar o seu trabalho. Sem pegadinha, sem versão
          paga escondida atrás de um &quot;premium&quot;.
        </p>
        <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {POINTS.map((point) => (
            <li
              key={point}
              className="flex flex-col items-center gap-2 font-body text-sm font-semibold text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
