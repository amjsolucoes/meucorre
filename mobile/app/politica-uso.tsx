import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PoliticaUsoScreen() {
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
            Política de Uso
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

          {/* Seção 1 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              1. Aceitação dos Termos
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Ao usar este aplicativo, você concorda com esta Política de Uso. Se você não concordar com algum termo, não utilize o app.
            </Text>
          </View>

          {/* Seção 2 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              2. Uso Permitido
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Este app é destinado a profissionais autônomos para controle de ganhos, gastos, clientes e agendamentos. Você pode:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Registrar suas transações financeiras
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Gerenciar seus clientes e agendamentos
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Gerar recibos para seus clientes
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Visualizar relatórios e gráficos do seu negócio
              </Text>
            </View>
          </View>

          {/* Seção 3 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              3. Uso Proibido
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Você não pode:
            </Text>
            <View style={{ paddingLeft: 12, gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Usar o app para atividades ilegais
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Tentar acessar dados de outros usuários
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Modificar, copiar ou distribuir o app sem autorização
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • Usar o app de forma que prejudique seu funcionamento
              </Text>
            </View>
          </View>

          {/* Seção 4 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              4. Responsabilidade dos Dados
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Você é responsável por manter a segurança da sua conta e senha. Recomendamos fazer backup regular dos seus dados. Não nos responsabilizamos por perda de dados causada por uso inadequado ou problemas técnicos.
            </Text>
          </View>

          {/* Seção 5 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              5. Limitação de Responsabilidade
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              O app é fornecido &quot;como está&quot;. Não garantimos que o serviço será ininterrupto ou livre de erros. Não nos responsabilizamos por danos diretos ou indiretos causados pelo uso do app.
            </Text>
          </View>

          {/* Seção 6 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              6. Cancelamento de Conta
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Você pode excluir sua conta a qualquer momento através das configurações do app. Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
            </Text>
          </View>

          {/* Seção 7 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              7. Alterações nos Termos
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Podemos atualizar esta Política de Uso a qualquer momento. Você será notificado sobre mudanças importantes. O uso continuado do app após as alterações significa que você aceita os novos termos.
            </Text>
          </View>

          {/* Seção 8 */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0D4F5C' }}>
              8. Contato
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
              Se você tiver dúvidas sobre esta Política de Uso, entre em contato conosco através do email: suporte@amjsolucoes.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
