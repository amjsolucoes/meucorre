export default {
  expo: {
    name: "Meu Corre",
    slug: "meu-corre-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo-app-meucorre.png",
    scheme: "meucorreapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "74f7c9f0-b7e5-4100-a524-6407e9fdd595",
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.amjsolucoes.meucorre",
      infoPlist: {
        // Permite que notificações locais agendadas disparem mesmo com o app em background/fechado
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      icon: "./assets/images/logo-app-meucorre.png",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo-app-meucorre.png",
        backgroundColor: "#0D4F5C",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.amjsolucoes.meucorre",
      versionCode: 1,
      targetSdkVersion: 35,
      minSdkVersion: 24,
      intentFilters: [],
      queries: [
        { scheme: "whatsapp" },
        { scheme: "tel" },
      ],
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo-app-meucorre.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#ffffff",
          },
        },
      ],
      "expo-secure-store",
      [
        "expo-contacts",
        {
          contactsPermission: "Permitir que o Meu Corre acesse seus contatos para importar clientes rapidamente."
        }
      ],
      "@react-native-community/datetimepicker",
      [
        "expo-notifications",
        {
          icon: "./assets/images/notification-icon.png",
          color: "#4D5DFB",
          defaultChannel: "appointments",
          sounds: [],
          iosDisplayInForeground: true,
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-3912743282778596~7066626902",
          iosAppId: "ca-app-pub-3940256099942544~1458002511",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: false,
    },
  },
};
