import { Text, XStack, YStack } from "tamagui";
import { BodySmall } from "../ui/Typography";
import { icons } from "@/constants";
import { Image } from "expo-image";
import { fp, hp, wp } from "@/utils/responsive";
import { pages } from "@/constants/pages";
import { View } from "react-native";

const footericons = [icons.footer1, icons.footer2, icons.footer3];

const trusted1 = require("@/assets/new/footer/trusted-1.svg");
const trusted2 = require("@/assets/new/footer/trusted-2.svg");
const powered1 = require("@/assets/new/footer/powered-1.svg");
const powered2 = require("@/assets/new/footer/powered-2.svg");
const powered3 = require("@/assets/new/footer/powered-3.svg");

function Divider() {
  return <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />;
}

function TrustedBySection() {
  return (
    <YStack gap={hp(20)} paddingHorizontal={wp(16)} paddingTop={hp(36)} paddingBottom={hp(24)}>
      {/* Trusted By */}
      <YStack gap={hp(14)} alignItems="center">
        <XStack alignItems="center" gap={wp(12)}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
          <Text fontSize={fp(13)} fontWeight="600" color="#6B7280" letterSpacing={0.5}>
            Trusted By
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
        </XStack>
        <XStack gap={wp(32)} alignItems="center" justifyContent="center">
          <Image
            source={trusted1}
            contentFit="contain"
            style={{ width: wp(90), height: hp(36) }}
            cachePolicy="memory-disk"
          />
          <Image
            source={trusted2}
            contentFit="contain"
            style={{ width: wp(100), height: hp(36) }}
            cachePolicy="memory-disk"
          />
        </XStack>
      </YStack>

      <Divider />

      {/* Powered By */}
      <YStack gap={hp(14)} alignItems="center">
        <Text fontSize={fp(13)} fontWeight="600" color="#6B7280" letterSpacing={0.5}>
          Powered By
        </Text>
        <XStack gap={wp(24)} alignItems="center" justifyContent="center">
          <Image
            source={powered1}
            contentFit="contain"
            style={{ width: wp(52), height: hp(32) }}
            cachePolicy="memory-disk"
          />
          <Image
            source={powered2}
            contentFit="contain"
            style={{ width: wp(80), height: hp(32) }}
            cachePolicy="memory-disk"
          />
          <Image
            source={powered3}
            contentFit="contain"
            style={{ width: wp(88), height: hp(32) }}
            cachePolicy="memory-disk"
          />
        </XStack>
      </YStack>

      <Divider />

      {/* Copyright */}
      <XStack justifyContent="center" alignItems="center" gap={wp(4)}>
        <Text fontSize={fp(12)} color="#9CA3AF">
          © {new Date().getFullYear()} Camorent. Made with
        </Text>
        <Text fontSize={fp(14)} color="#EF4444">♥</Text>
        <Text fontSize={fp(12)} color="#9CA3AF">in India</Text>
      </XStack>
    </YStack>
  );
}

export function Footer() {
  return (
    <YStack>
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

      <TrustedBySection />
    </YStack>
  );
}
