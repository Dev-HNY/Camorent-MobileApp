import { StyleSheet } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import { wp, hp } from "@/utils/responsive";

interface GridMarqueeProps {
  pageIndex: number;
}

export function GridMarquee({ pageIndex }: GridMarqueeProps) {
  // Equipment images for the grid layout
  const equipmentImages = [
    require("@/assets/images/camera-on-stool 2.png"), // DJI Pocket camera
    require("@/assets/images/camera-on-stool 2.png"), // Sony camera
    require("@/assets/images/camera-on-stool 2.png"), // GoPro camera
    require("@/assets/images/camera-on-stool 2.png"), // Microphone
    require("@/assets/images/camera-on-stool 2.png"), // Monitor/tablet
  ];

  const renderGridItem = (imageSource: any, index: number) => (
    <YStack
      key={index}
      backgroundColor="$background"
      borderRadius="$2"
      borderWidth={1}
      borderColor="$borderColor"
      padding={"$4"}
    >
      <Image
        source={imageSource}
        style={styles.gridImage}
        contentFit="cover"
        transition={300}
      />
    </YStack>
  );

  return (
    <YStack flex={1} justifyContent="center" overflow="hidden" gap={"$3"}>
      {/* Top row - 3 items moving right */}
      <YStack justifyContent="center">
        <Marquee spacing={wp(10)} speed={0.5}>
          {equipmentImages
            .slice(0, 1)
            .map((image, index) => renderGridItem(image, index))}
        </Marquee>
      </YStack>

      {/* Bottom row - 2 items moving left */}
      <YStack justifyContent="center" paddingLeft={"$1"}>
        <Marquee spacing={wp(10)} speed={0.5} reverse>
          {equipmentImages
            .slice(3, 4)
            .map((image, index) => renderGridItem(image, index + 3))}
        </Marquee>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  gridImage: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(4),
  },
});
