import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PoliticaPrivacidadeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFB' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8EA',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#F0F4F5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={20} color="#0D4F5C" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0D4F5C', flex: 1 }}>
            Política de Privacidade
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, gap: 20 }}>
          {/* Última atualização */}
          <View style={{ paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8EA' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7F85' }}>
              Última atualização: 12 de maio de 2026
            </Text>
          </View>

          {/* Introdução */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais quando você usa nosso aplicativo.
            </Text>
          </View>

          {/* Seção 1 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              1. Informações que Coletamos
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Coletamos as seguintes informações:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Dados de cadastro:</Text> nome, email, telefone e profissão
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Dados financeiros:</Text> ganhos, gastos e transações registradas por você
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Dados de clientes:</Text> informações dos clientes que você cadastrar
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Dados de uso:</Text> como você interage com o app
              </Text>
            </View>
          </View>

          {/* Seção 2 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              2. Como Usamos suas Informações
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Usamos suas informações para:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Fornecer e melhorar nossos serviços
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Processar suas transações e gerar relatórios
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Enviar notificações sobre agendamentos
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Garantir a segurança da sua conta
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Cumprir obrigações legais
              </Text>
            </View>
          </View>

          {/* Seção 3 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              3. Compartilhamento de Dados
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Com provedores de serviços que nos ajudam a operar o app (como servidores de banco de dados)
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Quando exigido por lei ou ordem judicial
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Para proteger nossos direitos legais
              </Text>
            </View>
          </View>

          {/* Seção 4 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              4. Segurança dos Dados
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Implementamos medidas de segurança para proteger suas informações, incluindo:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Criptografia de dados em trânsito e em repouso
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Autenticação segura
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Acesso restrito aos dados
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Monitoramento de segurança
              </Text>
            </View>
          </View>

          {/* Seção 5 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              5. Seus Direitos
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Acessar seus dados pessoais
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Corrigir dados incompletos ou incorretos
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Solicitar a exclusão de seus dados
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Revogar seu consentimento
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Solicitar a portabilidade dos dados
              </Text>
            </View>
          </View>

          {/* Seção 6 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              6. Retenção de Dados
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer nossos serviços. Quando você excluir sua conta, seus dados serão permanentemente removidos em até 30 dias.
            </Text>
          </View>

          {/* Seção 7 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              7. Cookies e Tecnologias Similares
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Usamos tecnologias de armazenamento local para melhorar sua experiência, como lembrar suas preferências e manter você conectado.
            </Text>
          </View>

          {/* Seção 8 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              8. Menores de Idade
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente informações de menores.
            </Text>
          </View>

          {/* Seção 9 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              9. Alterações nesta Política
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do app ou por email.
            </Text>
          </View>

          {/* Seção 10 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              10. Contato
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato através do email:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#0D4F5C', lineHeight: 22 }}>
                suporte@amjsolucoes.com
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
