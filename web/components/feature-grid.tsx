import { Wallet, Users, CalendarCheck, Receipt, BarChart3, type LucideIcon } from 'lucide-react';

const FEATURES: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Wallet,
    title: 'Controle financeiro',
    description: 'Registre ganhos e gastos em segundos e veja seu saldo atualizado na hora.',
  },
  {
    Icon: Users,
    title: 'Gestão de clientes',
    description:
      'Cadastre clientes rapidamente, importe da agenda do celular e veja o histórico de cada um.',
  },
  {
    Icon: CalendarCheck,
    title: 'Agenda com lembretes',
    description: 'Marque compromissos e receba lembretes automáticos antes de cada agendamento.',
  },
  {
    Icon: Receipt,
    title: 'Recibos profissionais',
    description: 'Gere recibos em PDF e compartilhe por WhatsApp direto pelo app.',
  },
  {
    Icon: BarChart3,
    title: 'Relatórios visuais',
    description: 'Gráficos por dia, semana e mês pra entender pra onde vai o seu dinheiro.',
  },
];

export function FeatureGrid() {
  return (
    <section id="funcionalidades" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-xl">
        <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
          Funcionalidades
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
          Tudo que o seu corre precisa, num só lugar
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
              <Icon className="h-5 w-5 text-accent-dark" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-text-primary">{title}</h3>
            <p className="mt-2 font-body text-sm text-text-secondary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
