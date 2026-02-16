import { Text, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp, fp } from "@/utils/responsive";
import { Image } from "expo-image";
import { BodySmall, BodyText } from "../ui/Typography";

interface CartCamocareProps {
  handleCamocare: () => void;
  isAdded: boolean;
  onToggle: () => void;
}

export function CartCamocare({
  handleCamocare,
  isAdded = false,
  onToggle,
}: CartCamocareProps) {
  return (
    <LinearGradient
      colors={["#FFF9EB", "#FFFFFF"]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FFDA85",
      }}
    >
      <XStack
        onPress={handleCamocare}
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={wp(16)}
        paddingVertical={hp(12)}
        borderRadius={wp(12)}
      >
        <XStack gap={wp(16)}>
          <Image
            source={require("../../assets/images/camocare.png")}
            style={{ width: wp(50), height: hp(50) }}
            contentFit="contain"
          />
          <YStack gap={hp(2)}>
            <XStack alignItems="center" gap={wp(2)}>
              <BodySmall fontWeight="600" color="#141414">
                Camo
              </BodySmall>
              <BodySmall fontWeight="600" color="#8E0FFF">
                Care
              </BodySmall>
            </XStack>
            <YStack>
              <Text
                fontWeight="400"
                fontSize={fp(10)}
                lineHeight={hp(13)}
                color="#121217"
              >
                Secure this product at{" "}
                <BodyText
                  fontWeight={"500"}
                  color={"#8E0FFF"}
                  lineHeight={hp(16)}
                >
                  Rs 65
                </BodyText>
              </Text>
              <Text
                fontWeight="400"
                fontSize={fp(10)}
                lineHeight={hp(13)}
                color="#121217"
              >
                Get{" "}
                <Text
                  fontWeight="500"
                  fontSize={fp(10)}
                  color="#121217"
                  lineHeight={hp(20)}
                >
                  100% damage waiver
                </Text>
              </Text>
            </YStack>
          </YStack>
        </XStack>
        <XStack
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          backgroundColor="#121217"
          borderRadius={wp(8)}
          paddingHorizontal={wp(12)}
          paddingVertical={hp(6)}
        >
          <BodyText color={"#FFF"} fontWeight={"500"}>
            {isAdded ? "Remove" : "Add"}
          </BodyText>
        </XStack>
      </XStack>
    </LinearGradient>
  );
}
