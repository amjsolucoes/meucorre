# Implementação da Tela Splash - MeuCorre

## ✅ Mudanças Realizadas

### 1. Nome do App Atualizado
- **app.json**: Nome alterado de "Meu Corre" para "MeuCorre"
- Este é o nome que aparecerá na tela inicial do celular (home screen)

### 2. Tela Splash Criada
- **Arquivo**: `app/splash.tsx`
- **Animação**: Transição suave entre duas logos
  - **Logo 1**: `meu-corre-logo.png` (fade out + scale down)
  - **Logo 2**: `logo-amj-branca.png` (fade in + scale up com fundo escuro)
- **Duração total**: 2.4 segundos
- **Tecnologia**: React Native Reanimated para animações performáticas

### 3. Integração no Layout Principal
- **Arquivo**: `app/_layout.tsx`
- A splash screen é exibida:
  - Durante a inicialização do app
  - Enquanto o Supabase carrega a sessão do usuário
- Após 2.4s, o app navega automaticamente para a tela principal

## 🎨 Detalhes da Animação

### Timeline da Animação:
```
0ms - 800ms:  Logo 1 (meu-corre) fade out + scale down
600ms - 1400ms: Logo 2 (AMJ) fade in + scale up
2400ms: Transição para o app
```

### Efeitos Visuais:
- **Logo 1**: Desaparece suavemente enquanto diminui de tamanho
- **Logo 2**: Aparece com delay, crescendo suavemente
- **Fundo da Logo 2**: Container cinza escuro arredondado para destacar a logo branca
- **Easing**: Curva suave (inOut) para transições naturais

## 📱 Como Testar

1. **Limpar cache do Expo**:
```bash
npx expo start -c
```

2. **Rodar no simulador/emulador**:
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

3. **Observar**:
   - O nome "MeuCorre" aparecerá na home screen do dispositivo
   - Ao abrir o app, verá a transição entre as duas logos
   - Após 2.4s, o app carrega normalmente

## 🔧 Configurações Adicionais

### Para ajustar a duração da animação:
Edite os valores em `app/splash.tsx`:
```typescript
duration: 800,  // Duração de cada animação em ms
{ duration: 600 } // Delay antes da segunda logo
```

### Para ajustar o tempo total da splash:
Edite o timer em `app/_layout.tsx`:
```typescript
const timer = setTimeout(() => {
  setShowSplash(false);
}, 2400); // Tempo total em ms
```

## ✅ Checklist de Conformidade

- [x] Sem StyleSheet.create() (apenas NativeWind)
- [x] TypeScript com tipagem explícita
- [x] Animações performáticas com Reanimated
- [x] SafeAreaView não necessário (tela fullscreen)
- [x] Funciona em iOS e Android
- [x] Nome do app atualizado para "MeuCorre"
- [x] Transição suave entre logos
- [x] Integração com fluxo de autenticação

## 📝 Notas Importantes

1. **Primeira execução**: Pode demorar um pouco mais devido ao carregamento inicial do Expo
2. **Builds de produção**: A splash nativa do Expo aparecerá primeiro, depois a nossa splash customizada
3. **Assets**: Certifique-se de que ambas as logos existem nas pastas corretas:
   - `assets/images/meu-corre-logo.png`
   - `assets/logo-amj-branca.png`
