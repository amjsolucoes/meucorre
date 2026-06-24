import { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const opacity1 = useSharedValue(1);
  const opacity2 = useSharedValue(0);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(0.8);

  useEffect(() => {
    // Primeira logo: fade out e scale down
    opacity1.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    scale1.value = withTiming(0.8, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    // Segunda logo: fade in e scale up (com delay)
    opacity2.value = withSequence(
      withTiming(0, { duration: 600 }),
      withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      })
    );
    scale2.value = withSequence(
      withTiming(0.8, { duration: 600 }),
      withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      })
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ scale: scale1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ scale: scale2.value }],
  }));

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {/* Primeira logo: logo-app-meucorre.png */}
      <Animated.View
        style={[animatedStyle1]}
        className="absolute"
      >
        <Image
          source={require('../assets/images/logo-app-meucorre.png')}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </Animated.View>

      {/* Segunda logo: logo-amj-cinza.png com fundo branco */}
      <Animated.View
        style={[animatedStyle2]}
        className="absolute items-center justify-center"
      >
        <Image
          source={require('../assets/logo-amj-cinza.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
