# 🔧 Ícone Ainda Grudado? Solução Definitiva

## ✅ O que foi feito AGORA:

1. ✅ Gerado `logo-app-meucorre-android.png` com **65%** do tamanho original (mais espaço!)
2. ✅ Configurado no `app.json` para usar o novo ícone
3. ✅ Reconstruído o projeto Android com `npx expo prebuild --platform android --clean`

## 🚀 Próximo passo: Instalar no celular

```bash
npx expo run:android
```

Isso vai:
- Compilar o app com o novo ícone (65% - mais espaço que antes)
- Instalar no seu dispositivo
- O ícone agora deve ter BASTANTE espaço de respiro

**💡 IMPORTANTE:** Após instalar, **reinicie o celular** para limpar o cache do launcher!

---

## 🔍 Se AINDA estiver grudado após instalar (improvável):

### Opção 1: Reduzir ainda mais (60% - último recurso)

```bash
# Execute o script de 60%
./scripts/ajustar-icone-android-60.sh

# Reconstrua
npx expo prebuild --platform android --clean

# Instale
npx expo run:android

# Reinicie o celular
```

### Opção 2: Ajuste manual no editor

1. Abra `assets/images/logo-app-meucorre.png` no Figma/Canva
2. Crie canvas 1024x1024px branco
3. Cole a logo e reduza para **60-65%** do tamanho
4. Centralize perfeitamente
5. Exporte como `logo-app-meucorre-android.png`
6. Reconstrua:
   ```bash
   npx expo prebuild --platform android --clean
   npx expo run:android
   ```

---

## 📐 Tamanhos testados:

| Tamanho | Espaço | Status |
|---------|--------|--------|
| 75% | Pouco | ❌ Grudado |
| 70% | Médio | ❌ Ainda grudado |
| 65% | Bastante | ✅ **ATUAL - deve funcionar!** |
| 60% | Muito | Último recurso se 65% falhar |

---

## 🎯 Como saber se funcionou:

Após instalar, veja o ícone na tela inicial do Android:
- ✅ **Bom:** Logo tem espaço branco ao redor
- ❌ **Ruim:** Logo está colada nas bordas do círculo/quadrado

---

## 🔄 Processo completo de ajuste (JÁ FEITO):

```bash
# 1. Ajustar o ícone para 65% ✅
./scripts/ajustar-icone-android-65.sh

# 2. Reconstruir ✅
npx expo prebuild --platform android --clean

# 3. Instalar no celular (FAÇA AGORA) ⬅️ VOCÊ ESTÁ AQUI
npx expo run:android

# 4. Reiniciar o celular para limpar cache
# (Importante para o launcher atualizar o ícone)

# 5. Verificar na tela inicial do Android
# Deve ter bastante espaço ao redor agora!
```

---

## 💡 Dica: Limpar cache do launcher

Às vezes o Android mantém o ícone antigo em cache:

1. **Reinicie o celular** após instalar
2. Ou **limpe o cache do launcher:**
   - Configurações → Apps → Launcher → Limpar cache

---

## 📱 Teste em diferentes launchers:

O ícone pode aparecer diferente em cada launcher:
- **Launcher padrão** (Xiaomi/Samsung/etc)
- **Nova Launcher**
- **Microsoft Launcher**
- **Lawnchair**

Cada um aplica formato diferente (círculo, quadrado, squircle).

---

## 🆘 Última alternativa: Ícone com fundo transparente

Se nada funcionar, crie uma versão com fundo transparente:

1. Abra a logo em editor
2. Remova o fundo branco (deixe transparente)
3. Reduza a logo para 60%
4. Salve como PNG com transparência
5. No `app.json`, mude:
   ```json
   "backgroundColor": "#FFFFFF"
   ```
   Para a cor que quiser de fundo

---

## ✅ Checklist:

- [x] Executei `./scripts/ajustar-icone-android-65.sh`
- [x] Executei `npx expo prebuild --platform android --clean`
- [ ] **Executar agora:** `npx expo run:android`
- [ ] **Reiniciar o celular** após instalar
- [ ] Verificar o ícone na tela inicial
- [ ] Se grudado (improvável), tentar 60%

---

📞 **Precisa de ajuda?** Veja os arquivos gerados:
- `assets/images/logo-app-meucorre-android.png` - Ícone atual
- `assets/images/logo-app-meucorre-android.png.backup` - Backup da versão anterior
