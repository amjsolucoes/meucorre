# Skill: React Native — SaaS Autônomos

## Stack obrigatória
- Expo SDK 54 + Expo Router
- NativeWind para estilização (NUNCA StyleSheet.create)
- React Hook Form + Zod para formulários
- Zustand para estado global
- Supabase para dados (sempre filtrar por user_id)

## Padrão de componente
```tsx
import { View, Text, Pressable } from 'react-native'

type Props = {
  titulo: string
  onPress: () => void
}

const BotaoGrande = ({ titulo, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-green-500 rounded-2xl p-4 items-center"
    >
      <Text className="text-white text-lg font-bold">{titulo}</Text>
    </Pressable>
  )
}

export default BotaoGrande
```

## Padrão de hook com Supabase
```tsx
const useTransacoes = () => {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(false)

  const buscar = async () => {
    setCarregando(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
    setDados(data)
    setCarregando(false)
  }

  return { dados, carregando, buscar }
}
```