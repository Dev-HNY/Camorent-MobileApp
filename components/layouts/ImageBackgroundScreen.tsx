import { YStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, ImageSourcePropType } from "react-native";
import { ReactNode } from "react";

const { width, height } = Dimensions.get("window");

interface ImageBackgroundScreenProps {
  source: ImageSourcePropType | string;
  children: ReactNode;
  gradient?: string[];
  safeAreaStyle?: any;
}

export function ImageBackgroundScreen({
  source,
  children,
  gradient = ["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"],
  safeAreaStyle,
}: ImageBackgroundScreenProps) {
  return (
    <YStack flex={1} position="relative">
      <Image
        source={source}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        contentFit="cover"
      />

      {gradient && (
        <LinearGradient
          colors={gradient}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
          }}
        />
      )}

      <SafeAreaView style={safeAreaStyle || { flex: 1 }}>
        {children}
      </SafeAreaView>
    </YStack>
  );
}
