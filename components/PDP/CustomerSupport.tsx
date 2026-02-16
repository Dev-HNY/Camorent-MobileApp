import { Text, XStack, YStack, Image, Stack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { wp, fp, hp } from "@/utils/responsive";

const support = [
  {
    id: 1,
    icon: require("@/assets/images/3D icon of replacement 1 (1).png"),
    lineOne: "Same day",
    lineTwo: "Replacement",
  },
  {
    id: 2,
    icon: require("@/assets/images/3D icon of a headset 2 (1).png"),
    lineOne: "24*7 expert",
    lineTwo: "Support",
  },
  {
    id: 3,
    icon: require("@/assets/images/3D icon of a hand ho 1 (1).png"),
    lineOne: "100%",
    lineTwo: "Refundable",
  },
];

export function CustomerSupport() {
  return (
    <XStack
      gap={wp(12)}
      flexWrap="wrap"
      paddingTop={hp(24)}
      paddingBottom={hp(16)}
      paddingHorizontal={"$2"}
      justifyContent="space-between"
    >
      {support.map((e) => {
        return (
          <LinearGradient
            key={e.id}
            colors={["#FFF3D6", "#FFFFFF"]}
            locations={[0, 0.8413]}
            style={{
              flex: 1,
              minWidth: wp(50),
              borderTopLeftRadius: wp(12),
              borderTopRightRadius: wp(12),
            }}
          >
            <Stack
              padding={wp(10)}
              justifyContent="center"
              alignItems="center"
            >
              <YStack justifyContent="center" alignItems="center" gap={hp(6)}>
                <Image source={e.icon} width={wp(30)} height={wp(30)} />
                <Text
                  fontSize={fp(14)}
                  fontWeight="600"
                  color="#6D00DA"
                  textAlign="center"
                >
                  {e.lineOne}
                </Text>
                <Text
                  fontSize={fp(11)}
                  fontWeight="400"
                  color="#6C6C89"
                  textAlign="center"
                >
                  {e.lineTwo}
                </Text>
              </YStack>
            </Stack>
          </LinearGradient>
        );
      })}
    </XStack>
  );
}
