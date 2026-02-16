import { YStack, View, Text, H2, XStack } from "tamagui";
import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { hp, wp } from "@/utils/responsive";
import { BodyText, Heading2 } from "../ui/Typography";

const CLIENT_LOGOS_ROW1 = [
  "https://img.camorent.co.in/clients/amazon.png",
  "https://img.camorent.co.in/clients/apple.png",
  "https://img.camorent.co.in/clients/netflix.png",
  "https://img.camorent.co.in/clients/odoo.png",
];

const CLIENT_LOGOS_ROW2 = [
  "https://img.camorent.co.in/clients/prime-video.png",
  "https://img.camorent.co.in/clients/urban-company.png",
  "https://img.camorent.co.in/clients/zoho.png",
];

const LogoItem = ({ uri }: { uri: string }) => (
  <View
    borderRadius={wp(60)}
    overflow="hidden"
    width={wp(90)}
    height={wp(90)}
    backgroundColor="#E3E6EC"
    alignItems="center"
    justifyContent="center"
    boxShadow={
      "2.174px 2.939px 2.998px 0 rgba(209, 217, 230, 0.34) inset, 6.174px 5.763px 7.821px 0 rgba(209, 217, 230, 0.40) inset, 6.174px 7.203px 9.262px 0 rgba(209, 217, 230, 0.48) inset, 6.174px 11.114px 12.554px 0 rgba(209, 217, 230, 0.67) , -4.116px -12.966px 13.378px 0 rgba(255, 255, 255, 0.75) inset, -4.116px -7.581px 8.782px 0 rgba(255, 255, 255, 0.54) inset, -4.116px -6.455px 7.209px 0 rgba(255, 255, 255, 0.45) inset, -4.116px -5.849px 6.209px 0 rgba(255, 255, 255, 0.38) inset"
    }
  >
    <Image
      source={{ uri: uri }}
      contentFit="contain"
      cachePolicy="memory-disk"
      priority="normal"
      style={{
        width: "50%",
        height: "50%",
      }}
    />
  </View>
);

export function InfiniteCarouselSection() {
  return (
    <YStack gap={hp(16)} paddingHorizontal={wp(16)}>
      <YStack gap={hp(4)}>
        <Marquee spacing={wp(20)} speed={0.5}>
          <XStack gap={wp(20)}>
            {CLIENT_LOGOS_ROW1.map((logo, index) => (
              <LogoItem key={index} uri={logo} />
            ))}
          </XStack>
        </Marquee>

        <Marquee spacing={wp(20)} speed={0.5} reverse>
          <XStack gap={wp(20)}>
            {CLIENT_LOGOS_ROW2.map((logo, index) => (
              <LogoItem key={index} uri={logo} />
            ))}
          </XStack>
        </Marquee>
      </YStack>
    </YStack>
  );
}
