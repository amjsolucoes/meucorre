import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

interface WorkerAvatarProps {
  size?: number;
}

/**
 * Ícone genérico de trabalhador(a) — capacete de obra + silhueta neutra.
 * Sem dependência de rede, sem API externa.
 */
export const WorkerAvatar: React.FC<WorkerAvatarProps> = ({ size = 52 }) => {
  const bg = '#E8F4F6';
  const skin = '#FBBF8A';
  const helmet = '#0D4F5C';
  const helmetBrim = '#0A3D47';
  const shirt = '#7BC67A';
  const stripe = '#FFFFFF';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: bg,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 52 52">
        {/* Fundo */}
        <Circle cx="26" cy="26" r="26" fill={bg} />

        {/* Corpo / camisa */}
        <Ellipse cx="26" cy="44" rx="14" ry="10" fill={shirt} />

        {/* Detalhe refletivo na camisa */}
        <Rect x="24" y="36" width="4" height="10" rx="2" fill={stripe} opacity="0.4" />

        {/* Pescoço */}
        <Rect x="22" y="30" width="8" height="6" rx="3" fill={skin} />

        {/* Cabeça */}
        <Circle cx="26" cy="25" r="9" fill={skin} />

        {/* Capacete — calota */}
        <Path
          d="M17 24 C17 17 35 17 35 24"
          fill={helmet}
        />
        {/* Capacete — aba */}
        <Rect x="14" y="23" width="24" height="3" rx="1.5" fill={helmetBrim} />

        {/* Faixa amarela no capacete */}
        <Rect x="17" y="20" width="18" height="2.5" rx="1.2" fill="#F59E0B" opacity="0.85" />

        {/* Olhos */}
        <Circle cx="22.5" cy="26" r="1.2" fill="#3A2A1A" />
        <Circle cx="29.5" cy="26" r="1.2" fill="#3A2A1A" />

        {/* Boca sutil */}
        <Path
          d="M23.5 29.5 Q26 31 28.5 29.5"
          stroke="#C97A50"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};
