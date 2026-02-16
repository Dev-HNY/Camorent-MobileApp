import PagerView from "react-native-pager-view";
import { useRef, useState } from "react";
import { pages } from "@/constants/pages";
import { XStack, YStack } from "tamagui";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { BodySmall, Heading1 } from "@/components/ui/Typography";
import { SafeAreaView } from "react-native-safe-area-context";
import { wp, hp } from "@/utils/responsive";
import { BackButton } from "@/components/ui/BackButton";
import { GridMarquee } from "@/components/ui/GridMarquee";

export default function Welcome() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);

  const handleNext = () => {
    router.push("/auth-choice");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <XStack justifyContent="flex-start" padding={"$4"}>
          <BackButton />
        </XStack>
        <PagerView
          style={{ flex: 1 }}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={(e) => setPage(e.nativeEvent.position)}
        >
          {pages.map((item, index) => {
            return (
              <YStack
                key={index}
                flex={1}
                justifyContent="center"
                alignItems="center"
                // padding="$4"
                gap="$4"
                position="relative"
              >
                <YStack width="100%" height={hp(250)} overflow="hidden">
                  <GridMarquee pageIndex={index} />
                </YStack>
                <YStack paddingHorizontal={"$4"} gap={"$4"}>
                  <Heading1 textAlign="center">{item.title}</Heading1>
                  <BodySmall textAlign="center">{item.desc}</BodySmall>
                </YStack>
              </YStack>
            );
          })}
        </PagerView>

        <YStack gap="$4" alignItems="center" padding="$3">
          <XStack gap="$1">
            {pages.map((_, i) => (
              <YStack
                key={i}
                width={i === page ? wp(12) : wp(8)}
                height={hp(8)}
                borderRadius={wp(4)}
                backgroundColor={i === page ? "$primary" : "$border"}
              />
            ))}
          </XStack>

          <Button size="lg" onPress={handleNext} width="100%">
            Get Started
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
