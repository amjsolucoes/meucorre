import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Exclusão de Conta — Meu Corre',
};

export default function ExclusaoDeContaPage() {
  return (
    <LegalPage title="Exclusão de Conta" updatedAt="10 de julho de 2026">
      <section>
        <h2>Já tem o app instalado?</h2>
        <p>
          A forma mais rápida de excluir sua conta é direto pelo app: abra o Meu Corre, vá em{' '}
          <strong>Perfil → Excluir Conta</strong> e confirme. A exclusão acontece na hora.
        </p>
      </section>

      <section>
        <h2>Não tem mais o app instalado?</h2>
        <p>
          Sem problema. Envie um e-mail para{' '}
          <a
            href="mailto:suporte@amjsolucoes.com?subject=Solicita%C3%A7%C3%A3o%20de%20exclus%C3%A3o%20de%20conta"
            className="font-semibold text-primary"
          >
            suporte@amjsolucoes.com
          </a>{' '}
          a partir do mesmo endereço cadastrado na sua conta, pedindo a exclusão. Confirmamos o
          pedido e removemos seus dados em até 30 dias — o mesmo prazo descrito na nossa{' '}
          <a href="/politica-de-privacidade" className="font-semibold text-primary">
            Política de Privacidade
          </a>
          .
        </p>
      </section>

      <section>
        <h2>O que é excluído</h2>
        <ul>
          <li>Todos os clientes cadastrados</li>
          <li>Ganhos e gastos registrados</li>
          <li>Agendamentos</li>
          <li>Seu perfil e dados pessoais</li>
        </ul>
        <p>Essa ação é permanente e não pode ser desfeita.</p>
      </section>
    </LegalPage>
  );
}
