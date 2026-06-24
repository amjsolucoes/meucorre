import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function ReciboScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const { showAlert } = useUIStore();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            profiles:user_id (name, phone, professions),
            clients:client_id (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        showAlert({
          type: 'error',
          title: 'Erro',
          message: 'Não foi possível carregar os dados do recibo.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const generatePDF = async () => {
    if (!transaction) return;

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1F2937; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #F3F4F6; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: bold; color: #4D5DFB; margin-bottom: 5px; }
            .subtitle { font-size: 16px; color: #6B7280; }
            .receipt-box { border: 1px solid #E5E7EB; border-radius: 20px; padding: 30px; background-color: #F9FAFB; }
            .row { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px dashed #E5E7EB; padding-bottom: 10px; }
            .label { font-weight: bold; color: #6B7280; text-transform: uppercase; font-size: 12px; }
            .value { font-weight: bold; font-size: 18px; color: #2D3436; }
            .amount-row { margin-top: 30px; padding: 20px; background-color: #EEF2FF; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; }
            .amount-label { font-size: 18px; font-weight: bold; color: #4D5DFB; }
            .amount-value { font-size: 32px; font-weight: 900; color: #2D3436; }
            .footer { text-align: center; margin-top: 50px; font-size: 14px; color: #9CA3AF; }
            .signature { margin-top: 60px; border-top: 1px solid #D1D5DB; width: 250px; margin-left: auto; margin-right: auto; padding-top: 10px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Meu Corre</div>
            <div class="subtitle">Recibo de Serviço</div>
          </div>
          
          <div class="receipt-box">
            <div class="row">
              <span class="label">Profissional</span>
              <span class="value">${transaction.profiles?.name || 'Não informado'}</span>
            </div>
            <div class="row">
              <span class="label">Profissão</span>
              <span class="value">${(transaction.profiles?.professions?.[0]) || 'Autônomo'}</span>
            </div>
            <div class="row">
              <span class="label">Cliente</span>
              <span class="value">${transaction.clients?.name || 'Não informado'}</span>
            </div>
            <div class="row">
              <span class="label">Serviço</span>
              <span class="value">${transaction.title}</span>
            </div>
            <div class="row">
              <span class="label">Data</span>
              <span class="value">${format(parseISO(transaction.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
            <div class="row">
              <span class="label">Pagamento</span>
              <span class="value">${transaction.payment_method?.toUpperCase() || 'N/A'}</span>
            </div>
            
            <div class="amount-row">
              <span class="amount-label">VALOR TOTAL</span>
              <span class="amount-value">R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div class="footer">
            <p>Recibo gerado pelo aplicativo Meu Corre</p>
            <div class="signature">Assinatura do Profissional</div>
          </div>
        </body>
      </html>
    `;

    try {
      setSharing(true);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating/sharing PDF:', error);
      showAlert({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível gerar ou compartilhar o recibo.'
      });
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4D5DFB" />
      </View>
    );
  }

  if (!transaction) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-6 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 -ml-2"
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 ml-2">Visualizar Recibo</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-[#F8F9FE] p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <View className="items-center mb-10">
            <View className="bg-blue-600 p-4 rounded-3xl mb-4">
              <Ionicons name="receipt" size={40} color="white" />
            </View>
            <Text className="text-2xl font-black text-gray-900">Meu Corre</Text>
            <Text className="text-gray-500 font-medium">Comprovante de Pagamento</Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">Cliente</Text>
              <Text className="text-xl font-bold text-gray-900">{transaction.clients?.name || 'Cliente Avulso'}</Text>
            </View>

            <View>
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">Serviço</Text>
              <Text className="text-xl font-bold text-gray-900">{transaction.title}</Text>
            </View>

            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">Data</Text>
                <Text className="text-lg font-bold text-gray-900">{format(parseISO(transaction.created_at), "dd/MM/yyyy")}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">Pagamento</Text>
                <Text className="text-lg font-bold text-gray-900 uppercase">{transaction.payment_method}</Text>
              </View>
            </View>

            <View className="border-t border-dashed border-gray-200 pt-6 mt-6 items-center">
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Valor Total</Text>
              <Text className="text-4xl font-black text-blue-700">R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={generatePDF}
          disabled={sharing}
          className="bg-blue-600 py-6 rounded-3xl mt-10 mb-10 flex-row justify-center items-center shadow-lg shadow-blue-900/20"
          activeOpacity={0.8}
          accessibilityLabel="Gerar e enviar recibo PDF"
          accessibilityRole="button"
        >
          {sharing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="share-outline" size={24} color="white" />
              <Text className="text-white text-2xl font-bold ml-2">Enviar Recibo</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-center mb-20"
        >
          <Text className="text-gray-400 font-bold">Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
