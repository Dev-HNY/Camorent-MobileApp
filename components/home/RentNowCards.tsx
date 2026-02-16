import { XStack, YStack, Text, View } from "tamagui";
import { fp, hp, wp } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Pressable, ScrollView } from "react-native";

interface RentCard {
  title: string;
  subtitle: string;
  buttonText: string;
  icon: any;
  gradientColors: string[];
}

const RENT_CARDS: RentCard[] = [
  {
    title: "Your Shoot, Streamlined",
    subtitle: "Equipment, crew, and logistics.",
    buttonText: "Rent Now",
    icon: require("@/assets/new/icons/above-how-1.svg"),
    gradientColors: ["#FFFFFF", "#EEFBF4"], // White to light green
  },
  {
    title: "Turn Your Camera Into Cash",
    subtitle: "Earn money by renting out gear.",
    buttonText: "List Now",
    icon: require("@/assets/new/icons/above-how-2.svg"),
    gradientColors: ["#B571FF", "#6D00DA"], // Purple gradient
  },
];

export function RentNowCards() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: wp(16),
        paddingTop: hp(8),
        paddingBottom: hp(20),
      }}
      snapToInterval={wp(288) + wp(12)}
      decelerationRate="fast"
    >
      <XStack gap={wp(12)}>
        {RENT_CARDS.map((card, index) => (
          <View
            key={index}
            width={wp(288)}
            height={hp(154)}
            borderRadius={wp(16)}
            borderWidth={1}
            borderColor="#EBEBEF"
            position="relative"
            overflow="hidden"
          >
            {/* Gradient Background */}
            <LinearGradient
              colors={card.gradientColors}
              start={{ x: 0.456, y: 0 }}
              end={{ x: 0.777, y: 1.244 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Icon positioned at top right - Card 1: extends out, Card 2: inside */}
            <View
              position="absolute"
              top={index === 0 ? hp(22) : hp(30)}
              right={index === 0 ? wp(2) : wp(14)}
              width={index === 0 ? wp(97) : wp(78)}
              height={index === 0 ? hp(97) : hp(78)}
            >
              <Image
                source={card.icon}
                contentFit="contain"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                cachePolicy="memory-disk"
              />
            </View>

            {/* Content */}
            <YStack gap={hp(8)} maxWidth="62%" justifyContent="space-between" flex={1} padding={wp(20)}>
              {/* Text content */}
              <YStack gap={hp(4)}>
                <Text
                  fontSize={fp(16)}
                  fontWeight="700"
                  color={index === 1 ? "#FFFFFF" : "#121217"}
                  lineHeight={fp(20)}
                >
                  {card.title}
                </Text>
                <Text
                  fontSize={fp(12)}
                  fontWeight="400"
                  color={index === 1 ? "#FFFFFF" : "#6C6C89"}
                  lineHeight={fp(16)}
                  opacity={index === 1 ? 0.9 : 1}
                >
                  {card.subtitle}
                </Text>
              </YStack>

              {/* Button */}
              <Pressable
                style={{
                  backgroundColor: index === 1 ? "rgba(255, 255, 255, 0.2)" : "white",
                  borderWidth: 1.5,
                  borderColor: index === 1 ? "#FFFFFF" : "#8E0FFF",
                  borderRadius: wp(20),
                  paddingVertical: hp(8),
                  paddingHorizontal: wp(16),
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  fontSize={fp(13)}
                  fontWeight="600"
                  color={index === 1 ? "#FFFFFF" : "#8E0FFF"}
                  lineHeight={fp(16)}
                >
                  {card.buttonText}
                </Text>
              </Pressable>
            </YStack>
          </View>
        ))}
      </XStack>
    </ScrollView>
  );
}
