import { Text, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp, fp } from "@/utils/responsive";
import { Image } from "expo-image";

interface CamocareProps {
  handleCamocare: () => void;
}

export function Camocare({ handleCamocare }: CamocareProps) {
  return (
    <LinearGradient
      colors={["#E8F8F0", "#FFFFFF"]}
      locations={[0, 1]}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#B2EECC",
      }}
    >
      <XStack
        onPress={handleCamocare}
        justifyContent="space-between"
        alignItems="center"
        padding="$4"
        borderRadius={wp(12)}
      >
        <YStack flex={0.5} gap="$3">
          <YStack>
            <Text
              fontWeight="600"
              fontSize={fp(16)}
              color="#121217"
              lineHeight={hp(20)}
            >
              Camocare
            </Text>
            <Text fontWeight="400" fontSize={fp(10)} color="#666666">
              Insure your rentals @ ₹64/ Shoot Get 100 % damage Waiver
            </Text>
          </YStack>

          <XStack
            borderColor="#8E0FFF"
            borderWidth={1}
            backgroundColor="transparent"
            borderRadius={wp(8)}
            paddingHorizontal={wp(12)}
            paddingVertical={hp(8)}
            alignSelf="flex-start"
          >
            <Text
              color="#8E0FFF"
              fontSize={fp(12)}
              fontWeight={"500"}
              lineHeight={hp(16)}
            >
              Learn More
            </Text>
          </XStack>
        </YStack>

        <XStack
          flex={0.4}
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Image
            source={require("../../assets/images/camocare.png")}
            style={{ width: "100%", height: hp(80), zIndex: 1 }}
            contentFit="contain"
          />
        </XStack>
      </XStack>
    </LinearGradient>
  );
}
