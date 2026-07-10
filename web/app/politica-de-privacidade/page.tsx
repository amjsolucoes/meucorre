import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Meu Corre',
};

export default function PoliticaPrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="12 de maio de 2026">
      <p>
        Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações
        pessoais quando você usa nosso aplicativo.
      </p>

      <section>
        <h2>1. Informações que Coletamos</h2>
        <p>Coletamos as seguintes informações:</p>
        <ul>
          <li>
            <strong>Dados de cadastro:</strong> nome, email, telefone e profissão
          </li>
          <li>
            <strong>Dados financeiros:</strong> ganhos, gastos e transações registradas por você
          </li>
          <li>
            <strong>Dados de clientes:</strong> informações dos clientes que você cadastrar
          </li>
          <li>
            <strong>Contatos:</strong> se você usar o recurso de importar contatos, acessamos sua
            agenda do celular apenas para facilitar o cadastro de clientes — só com sua permissão
            explícita
          </li>
          <li>
            <strong>Dados de uso:</strong> como você interage com o app
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Como Usamos suas Informações</h2>
        <p>Usamos suas informações para:</p>
        <ul>
          <li>Fornecer e melhorar nossos serviços</li>
          <li>Processar suas transações e gerar relatórios</li>
          <li>Enviar notificações sobre agendamentos</li>
          <li>Garantir a segurança da sua conta</li>
          <li>Cumprir obrigações legais</li>
        </ul>
      </section>

      <section>
        <h2>3. Compartilhamento de Dados</h2>
        <p>Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas:</p>
        <ul>
          <li>Com provedores de serviços que nos ajudam a operar o app (como servidores de banco de dados)</li>
          <li>Quando exigido por lei ou ordem judicial</li>
          <li>Para proteger nossos direitos legais</li>
        </ul>
      </section>

      <section>
        <h2>4. Segurança dos Dados</h2>
        <p>Implementamos medidas de segurança para proteger suas informações, incluindo:</p>
        <ul>
          <li>Criptografia de dados em trânsito e em repouso</li>
          <li>Autenticação segura</li>
          <li>Acesso restrito aos dados</li>
          <li>Monitoramento de segurança</li>
        </ul>
      </section>

      <section>
        <h2>5. Seus Direitos</h2>
        <p>De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:</p>
        <ul>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou incorretos</li>
          <li>Solicitar a exclusão de seus dados</li>
          <li>Revogar seu consentimento</li>
          <li>Solicitar a portabilidade dos dados</li>
        </ul>
      </section>

      <section>
        <h2>6. Retenção de Dados</h2>
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para
          fornecer nossos serviços. Quando você excluir sua conta, seus dados serão
          permanentemente removidos em até 30 dias.
        </p>
      </section>

      <section>
        <h2>7. Cookies e Tecnologias Similares</h2>
        <p>
          Usamos tecnologias de armazenamento local para melhorar sua experiência, como lembrar
          suas preferências e manter você conectado.
        </p>
      </section>

      <section>
        <h2>8. Menores de Idade</h2>
        <p>
          Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente
          informações de menores.
        </p>
      </section>

      <section>
        <h2>9. Alterações nesta Política</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre
          mudanças significativas através do app ou por email.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade,
          entre em contato através do email:{' '}
          <a href="mailto:suporte@amjsolucoes.com" className="font-semibold text-primary">
            suporte@amjsolucoes.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
