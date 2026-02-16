import { Text, XStack, YStack } from "tamagui";
import { BodySmall, Heading2 } from "../ui/Typography";
import { icons } from "@/constants";
import { Image } from "expo-image";
import { fp, hp, wp } from "@/utils/responsive";
import { pages } from "@/constants/pages";
const footericons = [icons.footer1, icons.footer2, icons.footer3];
export function Footer() {
  return (
    <YStack gap={hp(16)} paddingHorizontal={wp(16)}>
      <XStack>
        <Text fontSize={fp(18)} fontWeight="800" color="#121217">Rent Smart with Camorent</Text>
      </XStack>
      <YStack gap={wp(12)}>
        {pages.map((data, index) => {
          return (
            <XStack
              key={index}
              gap={wp(12)}
              borderColor={"#DBF3FF"}
              borderWidth={wp(0.7)}
              borderRadius={wp(12)}
              alignItems="center"
            >
              <YStack
                paddingHorizontal={wp(12)}
                paddingVertical={hp(6)}
                backgroundColor={"#F0FAFF"}
                alignItems="center"
                justifyContent="center"
                borderTopLeftRadius={wp(12)}
                borderBottomLeftRadius={wp(12)}
              >
                <Image
                  source={footericons[index]}
                  style={{ height: wp(36), width: wp(36) }}
                  contentFit="cover"
                />
              </YStack>
              <YStack justifyContent="center" gap={hp(2)}>
                <XStack>
                  <BodySmall fontWeight={"500"} color={"121217"}>
                    {data.title}
                  </BodySmall>
                </XStack>
                <XStack>
                  <Text
                    fontSize={fp(10)}
                    fontWeight={"400"}
                    lineHeight={hp(12)}
                    color={"#6C6C89"}
                  >
                    {data.desc}
                  </Text>
                </XStack>
              </YStack>
            </XStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
