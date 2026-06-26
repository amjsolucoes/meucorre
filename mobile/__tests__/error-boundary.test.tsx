/**
 * Testes do ErrorBoundary global — evita crash total da UI em exceções de render
 */
import { ErrorBoundary } from '@/components/error-boundary';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

const Bomb = () => {
  throw new Error('Erro técnico interno: coluna inexistente');
};

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renderiza os filhos normalmente quando não há erro', () => {
    render(
      <ErrorBoundary>
        <Text>Tela normal</Text>
      </ErrorBoundary>
    );

    expect(screen.getByText('Tela normal')).toBeTruthy();
  });

  it('mostra um fallback amigável (sem termos técnicos) quando um filho lança uma exceção', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ops! Algo deu errado.')).toBeTruthy();
    expect(screen.queryByText(/coluna inexistente/i)).toBeNull();
  });

  it('permite tentar novamente, remontando os filhos', () => {
    let shouldThrow = true;
    const MaybeBomb = () => {
      if (shouldThrow) throw new Error('falha');
      return <Text>Recuperado</Text>;
    };

    render(
      <ErrorBoundary>
        <MaybeBomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ops! Algo deu errado.')).toBeTruthy();

    shouldThrow = false;
    fireEvent.press(screen.getByLabelText('Tentar novamente'));

    expect(screen.getByText('Recuperado')).toBeTruthy();
  });
});
