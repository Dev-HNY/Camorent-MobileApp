import { YStack, XStack, Text, Card } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { Image } from "expo-image";
import { memo } from "react";
import { useGetBrands } from "@/hooks/CDP/useGetBrands";
import { ScrollView, Linking, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const LinkedInIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M3.57143 5.71429H0.571429V16H3.57143V5.71429Z"
      fill="#0A66C2"
    />
    <Path
      d="M2.07143 0C0.928571 0 0 0.928571 0 2.07143C0 3.21429 0.928571 4.14286 2.07143 4.14286C3.21429 4.14286 4.14286 3.21429 4.14286 2.07143C4.14286 0.928571 3.21429 0 2.07143 0Z"
      fill="#0A66C2"
    />
    <Path
      d="M11.4286 5.42857C10.1429 5.42857 9.14286 6.07143 8.57143 7.07143V5.71429H5.71429V16H8.71429V10.7143C8.71429 9.42857 9.28571 8.57143 10.4286 8.57143C11.5714 8.57143 12 9.42857 12 10.7143V16H15V10.1429C15 7.28571 13.7143 5.42857 11.4286 5.42857Z"
      fill="#0A66C2"
    />
  </Svg>
);

interface ClientTestimonial {
  brand: {
    id: string;
    name: string;
    logoUrl: string;
  };
  person: {
    name: string;
    title: string;
    linkedinUrl: string;
  };
  stats: {
    number: string;
    label: string;
  };
  testimonial: string;
  verified: boolean;
}

// Static testimonials data - you can move this to a separate file or API later
const TESTIMONIALS: ClientTestimonial[] = [
  {
    brand: {
      id: "sony",
      name: "Sony",
      logoUrl: "https://img.camorent.co.in/brands/images/sony/primary.webp",
    },
    person: {
      name: "Vikram Singh",
      title: "Marketing Head",
      linkedinUrl: "https://www.linkedin.com/in/hemant-yadav-905151226/",
    },
    stats: {
      number: "50+",
      label: "Marketing Head",
    },
    testimonial:
      "Camorent has been our trusted rental partner for all product launches and events across India.",
    verified: true,
  },
  {
    brand: {
      id: "netflix",
      name: "Netflix",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    person: {
      name: "Vikram Singh",
      title: "Marketing Head",
      linkedinUrl: "https://www.linkedin.com/in/hemant-yadav-905151226/",
    },
    stats: {
      number: "50+",
      label: "Marketing Head",
    },
    testimonial:
      "Reliable, professional service for the latest filming projects across multiple cities.",
    verified: true,
  },
  {
    brand: {
      id: "canon",
      name: "Canon",
      logoUrl: "https://img.camorent.co.in/brands/images/canon/primary.webp",
    },
    person: {
      name: "Vikram Singh",
      title: "Marketing Head",
      linkedinUrl: "https://www.linkedin.com/in/hemant-yadav-905151226/",
    },
    stats: {
      number: "50+",
      label: "Marketing Head",
    },
    testimonial:
      "Camorent has been our trusted rental partner for all product launches and events across India.",
    verified: true,
  },
];

const TestimonialCard = memo(
  ({ testimonial }: { testimonial: ClientTestimonial }) => {
    const handleLinkedInPress = () => {
      Linking.openURL(testimonial.person.linkedinUrl);
    };

    const handleCaseStudyPress = () => {
      // Navigate to case study or external link
      Linking.openURL(testimonial.person.linkedinUrl);
    };

    return (
      <Card
        width={wp(240)}
        backgroundColor="white"
        borderRadius={wp(16)}
        padding={wp(16)}
        marginRight={wp(16)}
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={1}
        shadowRadius={12}
        elevation={4}
      >
        <YStack gap={hp(12)}>
          {/* Brand Logo and Verified Badge */}
          <XStack alignItems="center" justifyContent="space-between">
            <XStack
              backgroundColor="white"
              borderWidth={1}
              borderColor="#E30016"
              borderRadius={wp(12)}
              paddingHorizontal={wp(12)}
              paddingVertical={hp(6)}
              alignItems="center"
              justifyContent="center"
              minHeight={hp(26)}
            >
              <Image
                source={{ uri: testimonial.brand.logoUrl }}
                contentFit="contain"
                style={{
                  width: wp(48),
                  height: hp(20),
                }}
                cachePolicy="memory-disk"
              />
            </XStack>

            {testimonial.verified && (
              <XStack
                backgroundColor="#E8F9EF"
                borderRadius={wp(8)}
                paddingHorizontal={wp(10)}
                paddingVertical={hp(4)}
              >
                <Text
                  fontSize={fp(11)}
                  fontWeight="600"
                  color="#00A86B"
                  lineHeight={fp(14)}
                >
                  Verified
                </Text>
              </XStack>
            )}
          </XStack>

          {/* Stats and Person Info */}
          <XStack gap={wp(12)}>
            {/* Stats Box */}
            <YStack
              backgroundColor="#F5F0FF"
              borderRadius={wp(10)}
              paddingHorizontal={wp(12)}
              paddingVertical={hp(8)}
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontSize={fp(22)}
                fontWeight="700"
                color="#7B2CBF"
                lineHeight={fp(28)}
              >
                {testimonial.stats.number}
              </Text>
              <Text
                fontSize={fp(10)}
                color="#6C6C89"
                textAlign="center"
                lineHeight={fp(12)}
              >
                {testimonial.stats.label}
              </Text>
            </YStack>

            {/* Person Info */}
            <YStack flex={1} justifyContent="center" gap={hp(2)}>
              <Text
                fontSize={fp(14)}
                fontWeight="600"
                color="#121217"
                lineHeight={fp(18)}
              >
                {testimonial.person.name}
              </Text>
              <Pressable onPress={handleLinkedInPress}>
                <XStack alignItems="center" gap={wp(4)}>
                  <LinkedInIcon />
                  <Text
                    fontSize={fp(12)}
                    color="#6C6C89"
                    lineHeight={fp(15)}
                  >
                    {testimonial.person.title}
                  </Text>
                </XStack>
              </Pressable>
            </YStack>
          </XStack>

          {/* Testimonial Text */}
          <Text
            fontSize={fp(12)}
            color="#121217"
            lineHeight={fp(16)}
            numberOfLines={3}
          >
            "{testimonial.testimonial}"
          </Text>

          {/* Read Case Study Button */}
          <Pressable onPress={handleCaseStudyPress}>
            <LinearGradient
              colors={["#7B2CBF", "#9B4DCA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: wp(10),
                paddingVertical: hp(12),
                paddingHorizontal: wp(20),
                alignItems: "center",
              }}
            >
              <Text
                fontSize={fp(15)}
                fontWeight="600"
                color="#FFFFFF"
                lineHeight={fp(18)}
              >
                Read Case Study
              </Text>
            </LinearGradient>
          </Pressable>
        </YStack>
      </Card>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

export function ClientTestimonialsSection() {
  const { data: brands, isLoading } = useGetBrands();

  // Use brands from API if available, otherwise use static data
  const testimonials = TESTIMONIALS;

  if (isLoading) {
    return null;
  }

  return (
    <YStack gap={hp(12)}>
      {/* Section Title */}
      <YStack paddingHorizontal={wp(16)} alignItems="center">
        <Text
          fontSize={fp(24)}
          fontWeight="700"
          color="#121217"
          lineHeight={fp(32)}
          textAlign="center"
        >
          Our clients
        </Text>
        <Text
          fontSize={fp(14)}
          color="#6C6C89"
          lineHeight={fp(20)}
          marginTop={hp(6)}
          textAlign="center"
        >
          We have served almost every biggest{"\n"}client in India.
        </Text>
      </YStack>

      {/* Horizontal Scroll of Testimonials */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          paddingVertical: hp(8),
        }}
        snapToInterval={wp(240) + wp(16)}
        decelerationRate="fast"
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </ScrollView>
    </YStack>
  );
}
