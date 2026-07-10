const PROFESSIONS = [
  'Cabeleireiros',
  'Manicures',
  'Diaristas',
  'Eletricistas',
  'Encanadores',
  'Personal trainers',
  'Professores particulares',
  'Pintores',
  'Pedreiros',
  'Mecânicos',
  'Costureiras',
  'Fotógrafos autônomos',
];

export function AudienceChips() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
        Feito para quem trabalha por conta própria
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-text-primary">
        Se você é autônomo, o Meu Corre é pra você
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {PROFESSIONS.map((profession) => (
          <span
            key={profession}
            className="rounded-full border border-border bg-surface px-4 py-2 font-body text-sm font-semibold text-text-secondary"
          >
            {profession}
          </span>
        ))}
      </div>
    </section>
  );
}
