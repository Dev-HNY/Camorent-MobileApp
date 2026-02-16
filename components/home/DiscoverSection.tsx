import { YStack, XStack, Card, Text } from "tamagui";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { BLURHASH } from "@/constants/discover";

const DISCOVER_IMAGES = [1, 2, 3, 4];

interface DiscoverSectionProps {
  onItemPress?: (imageNumber: number) => void;
}

export function DiscoverSection({ onItemPress }: DiscoverSectionProps) {
  return (
    <YStack gap={hp(16)}>
      <XStack paddingHorizontal={wp(16)}>
        {/* <Heading2>Discover</Heading2> */}
        <Text fontSize={fp(18)} fontWeight="800" color="#121217">Discover</Text>
      </XStack>
      <YStack height={hp(182)}>
        <FlashList
          horizontal
          data={DISCOVER_IMAGES}
          estimatedItemSize={28}
          estimatedListSize={{ width: 200, height: 182 }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <YStack width={wp(12)} />}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          renderItem={({ item }) => (
            <Card
              borderRadius={wp(9)}
              maxWidth={280}
              width={wp(143)}
              height={hp(182)}
              overflow="hidden"
              onPress={() => onItemPress?.(item)}
            >
              <YStack position="relative" flex={1}>
                <Image
                  source={{
                    uri: `https://img.camorent.co.in/discover/discover-${item}.png`,
                  }}
                  placeholder={{ blurhash: BLURHASH }}
                  contentFit="cover"
                  transition={1000}
                  cachePolicy="memory-disk"
                  priority="normal"
                  style={{ width: "100%", height: "100%" }}
                />
              </YStack>
            </Card>
          )}
        />
      </YStack>
    </YStack>
  );
}
