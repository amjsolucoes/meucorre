import React from 'react';
import { Image, ImageStyle, View } from 'react-native';

const logoSource = require('../assets/images/meu-corre-logo.png');

interface LogoIconProps {
  size?: number;
  color?: string;
}

interface LogoFullProps {
  variant?: 'dark' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

/** Logo icon — Usando a logo oficial do app */
export const LogoIcon: React.FC<LogoIconProps> = ({
  size = 48,
  color
}) => {
  const imageStyle: ImageStyle = {
    width: size,
    height: size,
  };

  if (color) {
    imageStyle.tintColor = color;
  }

  return (
    <Image
      source={logoSource}
      style={imageStyle}
      resizeMode="contain"
      accessibilityLabel="Logo Meu Corre"
    />
  );
};

/** Logo completa — Agora renderiza apenas a logo oficial sem os textos descritivos */
export const LogoFull: React.FC<LogoFullProps> = ({
  variant = 'dark',
  size = 'md',
}) => {
  const iconSizes = { sm: 130, md: 160, lg: 220 };

  // Se for variante de contraste (white/light), passa a cor branca para o tintColor
  const logoColor = (variant === 'white' || variant === 'light') ? '#FFFFFF' : undefined;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LogoIcon size={iconSizes[size]} color={logoColor} />
    </View>
  );
};
