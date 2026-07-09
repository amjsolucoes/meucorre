import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Último recurso contra crash total da UI: se qualquer tela lançar uma
 * exceção durante o render, mostra um fallback amigável em vez da tela
 * branca/vermelha do React Native. Nunca exibe o erro técnico ao usuário.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Exceção capturada:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-8">
          <Text className="text-xl font-bold text-[#1A1A1A] text-center mb-3">
            Ops! Algo deu errado.
          </Text>
          <Text className="text-base text-[#6B7F85] text-center mb-8">
            Não se preocupe, seus dados estão salvos. Tente novamente.
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
            onPress={this.handleRetry}
            activeOpacity={0.8}
            className="bg-[#0D4F5C] py-4 px-10 rounded-2xl"
          >
            <Text className="text-white text-base font-bold">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
