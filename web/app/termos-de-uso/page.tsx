import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Termos de Uso — Meu Corre',
};

export default function TermosDeUsoPage() {
  return (
    <LegalPage title="Termos de Uso" updatedAt="12 de maio de 2026">
      <section>
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao usar este aplicativo, você concorda com esta Política de Uso. Se você não concordar
          com algum termo, não utilize o app.
        </p>
      </section>

      <section>
        <h2>2. Uso Permitido</h2>
        <p>
          Este app é destinado a profissionais autônomos para controle de ganhos, gastos, clientes
          e agendamentos. Você pode:
        </p>
        <ul>
          <li>Registrar suas transações financeiras</li>
          <li>Gerenciar seus clientes e agendamentos</li>
          <li>Gerar recibos para seus clientes</li>
          <li>Visualizar relatórios e gráficos do seu negócio</li>
        </ul>
      </section>

      <section>
        <h2>3. Uso Proibido</h2>
        <p>Você não pode:</p>
        <ul>
          <li>Usar o app para atividades ilegais</li>
          <li>Tentar acessar dados de outros usuários</li>
          <li>Modificar, copiar ou distribuir o app sem autorização</li>
          <li>Usar o app de forma que prejudique seu funcionamento</li>
        </ul>
      </section>

      <section>
        <h2>4. Responsabilidade dos Dados</h2>
        <p>
          Você é responsável por manter a segurança da sua conta e senha. Recomendamos fazer
          backup regular dos seus dados. Não nos responsabilizamos por perda de dados causada por
          uso inadequado ou problemas técnicos.
        </p>
      </section>

      <section>
        <h2>5. Limitação de Responsabilidade</h2>
        <p>
          O app é fornecido &quot;como está&quot;. Não garantimos que o serviço será ininterrupto
          ou livre de erros. Não nos responsabilizamos por danos diretos ou indiretos causados
          pelo uso do app.
        </p>
      </section>

      <section>
        <h2>6. Cancelamento de Conta</h2>
        <p>
          Você pode excluir sua conta a qualquer momento através das configurações do app. Ao
          excluir sua conta, todos os seus dados serão permanentemente removidos.
        </p>
      </section>

      <section>
        <h2>7. Alterações nos Termos</h2>
        <p>
          Podemos atualizar esta Política de Uso a qualquer momento. Você será notificado sobre
          mudanças importantes. O uso continuado do app após as alterações significa que você
          aceita os novos termos.
        </p>
      </section>

      <section>
        <h2>8. Contato</h2>
        <p>
          Se você tiver dúvidas sobre esta Política de Uso, entre em contato conosco através do
          email:{' '}
          <a href="mailto:suporte@amjsolucoes.com" className="font-semibold text-primary">
            suporte@amjsolucoes.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
