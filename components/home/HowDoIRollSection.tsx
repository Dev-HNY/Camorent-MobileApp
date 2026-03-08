import { XStack, YStack, Text } from "tamagui";
import { Heading2 } from "../ui/Typography";
import { fp, hp, wp } from "@/utils/responsive";
import { ScrollView } from "react-native";
import { Image } from "expo-image";

interface HowToStep {
  number: string;
  title: string;
  image: any;
}

const HOW_TO_STEPS: HowToStep[] = [
  {
    number: "01",
    title: "Add the equipment you need for your shoot.",
    image: require("@/assets/new/icons/how-to-1.svg"),
  },
  {
    number: "02",
    title: "Upload documents & complete KYC easily.",
    image: require("@/assets/new/icons/how-to-2.svg"),
  },
  {
    number: "03",
    title: "Pickup your gear from our nearest location.",
    image: require("@/assets/new/icons/how-to-3.svg"),
  },
  {
    number: "04",
    title: "Return equipment after your shoot ends.",
    image: require("@/assets/new/icons/how-to-4.svg"),
  },
];

export function HowDoIRollSection() {
  return (
    <YStack gap={hp(16)}>
      <XStack paddingHorizontal={wp(16)}>
        {/* <Heading2>How Do I roll?</Heading2> */}
        <Text fontSize={fp(18)} fontWeight="800" color="#121217">How Do I roll?</Text>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          paddingBottom: hp(12), // Add padding to prevent bottom cutoff
        }}
        snapToInterval={wp(126) + wp(12)}
        decelerationRate="fast"
      >
        <XStack gap={wp(12)}>
          {HOW_TO_STEPS.map((step, index) => {
            // Shift numbers 02 and 04 down by adding marginTop
            const needsShift = step.number === "02" || step.number === "04";
            // Move camera SVG (first card) left
            const isFirstCard = index === 0;

            return (
              <YStack
                key={step.number}
                width={wp(126)}
                height={hp(170)} // Increased from hp(156) to hp(170)
                borderRadius={wp(16)}
                backgroundColor="rgba(173, 228, 255, 0.04)"
                borderWidth={1}
                borderColor="#ADE4FF"
                position="relative"
                padding={wp(12)}
                overflow="hidden" // Clip SVG to card boundaries
              >
                {/* Content Layer - Higher z-index */}
                <YStack zIndex={2} position="relative">
                  {/* Number at top */}
                  <Text
                    fontSize={fp(52)}
                    fontWeight="700"
                    color="#3E3EFD"
                    lineHeight={fp(56)}
                    opacity={0.5}
                    letterSpacing={-1}
                  >
                    {step.number}
                  </Text>

                  {/* Title below number */}
                  <Text
                    fontSize={fp(11)}
                    fontWeight="400"
                    color="#121217"
                    lineHeight={fp(14)}
                    marginTop={hp(2)}
                    maxWidth="70%"
                  >
                    {step.title}
                  </Text>
                </YStack>

                {/* Icon at bottom-right corner - Lower z-index (behind content) */}
                <YStack
                  position="absolute"
                  bottom={needsShift ?-7:0}
                  right={isFirstCard ? wp(-1) : 0} // Move camera left on first card
                  zIndex={1} // Lower z-index so card content appears above it
                  alignItems="flex-end"
                  justifyContent="flex-end"
                >
                  <Image
                    source={step.image}
                    contentFit="contain"
                    style={{
                      width: wp(75), // Reduced from wp(90) to wp(75)
                      height: hp(75), // Reduced from hp(90) to hp(75)
                    }}
                    cachePolicy="memory-disk"
                  />
                </YStack>
              </YStack>
            );
          })}
        </XStack>
      </ScrollView>

    </YStack>
  );
}
