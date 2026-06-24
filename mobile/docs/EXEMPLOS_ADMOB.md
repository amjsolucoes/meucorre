# 📱 Exemplos Práticos: Onde e Como Adicionar Anúncios

## 1. Banner na Tela de Relatórios

```typescript
// app/(tabs)/relatorios.tsx
import { AdBanner } from '@/components/AdBanner';

export default function ReportsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Seu conteúdo aqui */}
        
        {/* Banner no meio da tela, entre seções */}
        <View className="my-6">
          <AdBanner size="MEDIUM_RECTANGLE" />
        </View>
        
        {/* Mais conteúdo */}
        
        {/* Banner no final */}
        <AdBanner size="BANNER" />
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## 2. Intersticial Após Salvar Ganho

```typescript
// app/ganho/index.tsx
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useState, useRef } from 'react';

export default function AddIncomeScreen() {
  const router = useRouter();
  const { showAd, loaded } = useInterstitialAd();
  
  // Contador de ações (para não mostrar anúncio toda vez)
  const actionCountRef = useRef(0);
  
  const handleSave = async (data: any) => {
    try {
      // 1. Salvar o ganho
      await saveIncome(data);
      
      // 2. Incrementar contador
      actionCountRef.current += 1;
      
      // 3. Mostrar anúncio a cada 3 ações
      if (actionCountRef.current % 3 === 0 && loaded) {
        await showAd();
      }
      
      // 4. Voltar para a tela anterior
      router.back();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };
  
  return (
    // Seu formulário aqui
  );
}
```

---

## 3. Intersticial Após Marcar Agendamento como Concluído

```typescript
// app/agenda/[id].tsx
import { useInterstitialAd } from '@/hooks/useInterstitialAd';

export default function AppointmentDetailScreen() {
  const { showAd, loaded } = useInterstitialAd();
  
  const handleMarkAsCompleted = async () => {
    try {
      // 1. Marcar como concluído
      await updateAppointment(id, { status: 'concluido' });
      
      // 2. Mostrar anúncio
      if (loaded) {
        await showAd();
      }
      
      // 3. Voltar
      router.back();
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  return (
    <View>
      <Button onPress={handleMarkAsCompleted}>
        Marcar como Concluído
      </Button>
    </View>
  );
}
```

---

## 4. Banner na Tela de Clientes

```typescript
// app/(tabs)/clientes.tsx
import { AdBanner } from '@/components/AdBanner';

export default function ClientsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={clients}
        renderItem={({ item }) => <ClientCard client={item} />}
        ListHeaderComponent={() => (
          <View>
            <Text className="text-2xl font-bold">Meus Clientes</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="mt-6 mb-8">
            {/* Banner no final da lista */}
            <AdBanner size="BANNER" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
```

---

## 5. Controle de Frequência de Intersticiais (Recomendado)

Crie um hook para controlar a frequência dos anúncios:

```typescript
// hooks/useAdFrequency.ts
import { useRef } from 'react';

/**
 * Hook para controlar a frequência de anúncios intersticiais
 * Evita mostrar anúncios com muita frequência
 */
export const useAdFrequency = (minIntervalMinutes: number = 3) => {
  const lastAdTimeRef = useRef<number>(0);
  
  const shouldShowAd = (): boolean => {
    const now = Date.now();
    const timeSinceLastAd = now - lastAdTimeRef.current;
    const minInterval = minIntervalMinutes * 60 * 1000; // Converter para ms
    
    if (timeSinceLastAd >= minInterval) {
      lastAdTimeRef.current = now;
      return true;
    }
    
    return false;
  };
  
  return { shouldShowAd };
};
```

**Uso:**

```typescript
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useAdFrequency } from '@/hooks/useAdFrequency';

export default function SomeScreen() {
  const { showAd, loaded } = useInterstitialAd();
  const { shouldShowAd } = useAdFrequency(5); // 5 minutos entre anúncios
  
  const handleAction = async () => {
    // Fazer algo...
    
    // Mostrar anúncio apenas se passou tempo suficiente
    if (loaded && shouldShowAd()) {
      await showAd();
    }
  };
}
```

---

## 6. Banner Condicional (Mostrar Apenas em Certas Telas)

```typescript
// components/AdBanner.tsx (já implementado)
<AdBanner 
  size="BANNER" 
  showOnScreen={true} // ou false para esconder
/>
```

**Exemplo de uso condicional:**

```typescript
import { AdBanner } from '@/components/AdBanner';
import { useAuthStore } from '@/stores/auth';

export default function SomeScreen() {
  const { user } = useAuthStore();
  
  // Não mostrar anúncios para usuários premium (se implementar)
  const isPremium = user?.subscription === 'premium';
  
  return (
    <View>
      {/* Conteúdo */}
      
      <AdBanner 
        size="BANNER" 
        showOnScreen={!isPremium} 
      />
    </View>
  );
}
```

---

## 7. Diferentes Tamanhos de Banner

```typescript
import { AdBanner } from '@/components/AdBanner';

// Banner pequeno (320x50) - padrão
<AdBanner size="BANNER" />

// Banner grande (320x100)
<AdBanner size="LARGE_BANNER" />

// Retângulo médio (300x250) - melhor para meio de tela
<AdBanner size="MEDIUM_RECTANGLE" />

// Banner completo (468x60) - tablets
<AdBanner size="FULL_BANNER" />

// Leaderboard (728x90) - tablets
<AdBanner size="LEADERBOARD" />
```

---

## 8. Estratégia Completa de Monetização

### Telas com Banner:
- ✅ Home (já implementado)
- ✅ Relatórios
- ✅ Clientes
- ✅ Agenda
- ❌ Login/Cadastro (não recomendado)
- ❌ Formulários (não recomendado)

### Ações com Intersticial:
- ✅ Após salvar ganho (a cada 3 ações)
- ✅ Após marcar agendamento como concluído
- ✅ Ao abrir relatórios detalhados
- ✅ Após adicionar novo cliente
- ❌ Durante navegação normal (não recomendado)
- ❌ Ao abrir o app (não recomendado)

### Frequência Recomendada:
- **Banners**: Sempre visíveis (não incomodam)
- **Intersticiais**: Máximo 1 a cada 3-5 minutos
- **Recompensados**: Apenas se oferecer algo em troca (ex: remover anúncios por 24h)

---

## 9. Teste A/B: Com e Sem Anúncios

```typescript
// stores/settings.ts (criar se não existir)
import { create } from 'zustand';

interface SettingsStore {
  adsEnabled: boolean;
  toggleAds: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  adsEnabled: true,
  toggleAds: () => set((state) => ({ adsEnabled: !state.adsEnabled })),
}));
```

**Uso:**

```typescript
import { AdBanner } from '@/components/AdBanner';
import { useSettingsStore } from '@/stores/settings';

export default function SomeScreen() {
  const { adsEnabled } = useSettingsStore();
  
  return (
    <View>
      {/* Conteúdo */}
      
      {adsEnabled && <AdBanner size="BANNER" />}
    </View>
  );
}
```

---

## 10. Monitoramento de Performance

```typescript
// hooks/useAdAnalytics.ts
import { useEffect } from 'react';

export const useAdAnalytics = () => {
  const trackAdImpression = (adType: 'banner' | 'interstitial') => {
    console.log(`[AdMob] ${adType} impression`);
    // Aqui você pode enviar para analytics (Firebase, Mixpanel, etc)
  };
  
  const trackAdClick = (adType: 'banner' | 'interstitial') => {
    console.log(`[AdMob] ${adType} clicked`);
    // Enviar para analytics
  };
  
  return { trackAdImpression, trackAdClick };
};
```

---

## 🎯 Resumo: Melhores Práticas

1. **Banners**: Final de listas e entre seções
2. **Intersticiais**: Após ações importantes, com intervalo mínimo
3. **Frequência**: Não exagerar, UX em primeiro lugar
4. **Teste**: Sempre testar com IDs de teste primeiro
5. **Monitorar**: Acompanhar performance no console AdMob

**Lembre-se**: Usuários felizes = mais uso = mais anúncios vistos = mais dinheiro! 💰
