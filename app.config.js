module.exports = {
  expo: {
    name: "Camorent",
    slug: "camorent",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/ios-icon.png",
    scheme: "camorent-customer-app",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",
    newArchEnabled: true,
    ios: {
      icon: {
        dark: "./assets/images/ios-icon.png",
        light: "./assets/images/ios-icon.png",
      },
      jsEngine: "jsc",
      supportsTablet: true,
      bundleIdentifier: "com.camorent.CamorentMobileApp",
      infoPlist: {
        NSCameraUsageDescription:
          "This app needs access to your camera to take photos for equipment rentals.",
        NSPhotoLibraryUsageDescription:
          "This app needs access to your photo library to select images for equipment rentals.",
        NSPhotoLibraryAddUsageDescription:
          "This app needs access to save photos to your photo library for equipment rentals.",
        NSMicrophoneUsageDescription:
          "This app needs access to your microphone to record videos for equipment rentals.",
        UIDocumentPickerUsageDescription:
          "This app needs access to documents to let you upload documents for equipment rentals.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon.png",
        backgroundColor: "#ffffff",
      },
      // config: {
      //   googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY },
      // },
      edgeToEdgeEnabled: false,
      package: "com.camorent.customermobileapp",
      allowBackup: false,
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "camorent-customer-app",
              host: "payment-status",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECEIVE_SMS",
        "READ_SMS",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/Camorent-splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      // Removed expo-font - using system Helvetica Neue font
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "expo-document-picker",
        {
          documentTypes: ["public.item"],
        },
      ],
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
      "expo-build-properties",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "f192c5dd-310e-41b5-8a69-ee7821a8e1b7",
      },
    },
  },
};
