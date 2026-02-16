import React, { useEffect } from "react";
import { XStack, YStack, Stack } from "tamagui";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Line
} from "react-native-svg";
import { hp, wp, fp } from "@/utils/responsive";
import { BodySmall } from "../ui/Typography";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInLeft,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  useSharedValue,
  Easing,
  interpolate,
  Extrapolation
} from "react-native-reanimated";
import { View } from "react-native";

type Step = "cart" | "crew" | "payment";

interface CartProgressIndicatorProps {
  currentStep: Step;
}

const CartIcon = ({ isActive }: { isActive: boolean }) => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M2.5 3.33334H3.63333C4.2475 3.33334 4.555 3.33334 4.78583 3.45667C4.98752 3.56478 5.15201 3.72927 5.26012 3.93096C5.38333 4.16167 5.38333 4.46917 5.38333 5.08334V5.41667M5.38333 5.41667L5.82917 12.0758C5.92083 13.3 5.96667 13.9117 6.24583 14.3725C6.49148 14.7741 6.85354 15.0897 7.28407 15.2776C7.77251 15.4896 8.38668 15.4167 9.615 15.2708L13.9058 14.7625C15.0667 14.625 15.6467 14.5558 16.0842 14.2792C16.4668 14.0368 16.7706 13.6867 16.9581 13.2726C17.1692 12.8042 17.1542 12.2267 17.125 11.0717L16.9917 7.51C16.9633 6.41084 16.9483 5.86084 16.7133 5.4475C16.5063 5.08368 16.1962 4.78954 15.8217 4.6025C15.395 4.39 14.8442 4.39 13.7417 4.39L5.38333 5.41667Z"
      stroke={isActive ? "white" : "#D1D1DB"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.2915 16.6667C7.2915 17.1269 6.91839 17.5 6.45817 17.5C5.99795 17.5 5.62484 17.1269 5.62484 16.6667C5.62484 16.2064 5.99795 15.8333 6.45817 15.8333C6.91839 15.8333 7.2915 16.2064 7.2915 16.6667Z"
      stroke={isActive ? "white" : "#D1D1DB"}
      strokeWidth="1.5"
    />
    <Path
      d="M14.7915 16.6667C14.7915 17.1269 14.4184 17.5 13.9582 17.5C13.498 17.5 13.1248 17.1269 13.1248 16.6667C13.1248 16.2064 13.498 15.8333 13.9582 15.8333C14.4184 15.8333 14.7915 16.2064 14.7915 16.6667Z"
      stroke={isActive ? "white" : "#D1D1DB"}
      strokeWidth="1.5"
    />
  </Svg>
);

const CrewIcon = ({ isActive }: { isActive: boolean }) => (
  <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
    <Path
      d="M13.8125 11.6668C15.5448 11.6668 16.2543 13.4567 16.5407 14.7468C16.6954 15.4435 16.1319 16.0418 15.4182 16.0418H14.6458M12.9792 8.54183C14.2448 8.54183 15.0625 7.51582 15.0625 6.25016C15.0625 4.98451 14.2448 3.9585 12.9792 3.9585M11.7028 16.0418H5.50558C5.03516 16.0418 4.66501 15.6516 4.75875 15.1906C5.01754 13.9178 5.86277 11.6668 8.60417 11.6668C11.3456 11.6668 12.1908 13.9179 12.4496 15.1906C12.5433 15.6516 12.1732 16.0418 11.7028 16.0418ZM10.8958 6.25016C10.8958 7.51582 9.86983 8.54183 8.60417 8.54183C7.33852 8.54183 6.31251 7.51582 6.31251 6.25016C6.31251 4.98451 7.33852 3.9585 8.60417 3.9585C9.86983 3.9585 10.8958 4.98451 10.8958 6.25016Z"
      stroke={isActive ? "white" : "#D1D1DB"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PaymentIcon = ({ isActive }: { isActive: boolean }) => (
  <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
    <Path
      d="M14.4376 10.8332C14.4376 11.0633 14.251 11.2498 14.0209 11.2498C13.7908 11.2498 13.6042 11.0633 13.6042 10.8332C13.6042 10.6031 13.7908 10.4165 14.0209 10.4165C14.251 10.4165 14.4376 10.6031 14.4376 10.8332Z"
      stroke={isActive ? "white" : "#D1D1DB"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.64575 5.62516V14.3752C4.64575 15.2956 5.39194 16.0418 6.31242 16.0418H15.0624C15.9829 16.0418 16.7291 15.2956 16.7291 14.3752V8.54183C16.7291 7.62135 15.9829 6.87516 15.0624 6.87516M15.0624 6.87516H6.10409C5.29867 6.87516 4.64575 6.22224 4.64575 5.41683C4.64575 4.61141 5.29867 3.9585 6.10409 3.9585H13.3958C14.3162 3.9585 15.0624 4.70469 15.0624 5.62516V6.87516Z"
      stroke={isActive ? "white" : "#D1D1DB"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Premium connector line with animated fill
const ProgressConnector = ({
  isFilled,
  isAnimating
}: {
  isFilled: boolean;
  isAnimating: boolean;
}) => {
  const fillProgress = useSharedValue(isFilled ? 1 : 0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    fillProgress.value = withSpring(isFilled ? 1 : 0, {
      damping: 20,
      stiffness: 90,
    });

    if (isAnimating && isFilled) {
      shimmer.value = withDelay(
        300,
        withTiming(1, {
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      );
    }
  }, [isFilled, isAnimating]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        fillProgress.value,
        [0, 1],
        [0.3, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View style={[{ flex: 1, height: hp(4), justifyContent: 'center' }, containerStyle]}>
      <View style={{ position: 'relative', height: hp(3) }}>
        {/* Background track */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: hp(3),
            backgroundColor: '#F5F5F7',
            borderRadius: hp(1.5),
          }}
        />

        {/* Filled progress with gradient */}
        {isFilled && (
          <View style={{ position: 'absolute', width: '100%', height: hp(3), borderRadius: hp(1.5), overflow: 'hidden' }}>
            <LinearGradient
              colors={['#8E0FFF', '#A855F7', '#C084FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export function CartProgressIndicator({
  currentStep,
}: CartProgressIndicatorProps) {
  const steps: {
    key: Step;
    label: string;
    icon: (isActive: boolean) => JSX.Element;
  }[] = [
    {
      key: "cart",
      label: "Cart",
      icon: (isActive) => <CartIcon isActive={isActive} />,
    },
    {
      key: "crew",
      label: "Crew",
      icon: (isActive) => <CrewIcon isActive={isActive} />,
    },
    {
      key: "payment",
      label: "Payment",
      icon: (isActive) => <PaymentIcon isActive={isActive} />,
    },
  ];

  const getCurrentStepIndex = () =>
    steps.findIndex((step) => step.key === currentStep);
  const currentStepIndex = getCurrentStepIndex();

  const isStepCompleted = (stepIndex: number) => stepIndex < currentStepIndex;
  const isStepActive = (stepIndex: number) => stepIndex === currentStepIndex;

  return (
    <YStack width="100%" gap={hp(16)}>
      {/* Progress bar background */}
      <Stack
        position="relative"
        height={hp(70)}
        backgroundColor="transparent"
        paddingHorizontal={wp(4)}
      >
        {/* Connection lines layer */}
        <XStack
          position="absolute"
          top={hp(18)}
          left={wp(40)}
          right={wp(40)}
          height={hp(3)}
          alignItems="center"
          justifyContent="space-between"
        >
          <ProgressConnector
            isFilled={isStepCompleted(0)}
            isAnimating={currentStepIndex >= 1}
          />
          <View style={{ width: wp(8) }} />
          <ProgressConnector
            isFilled={isStepCompleted(1)}
            isAnimating={currentStepIndex >= 2}
          />
        </XStack>

        {/* Step nodes layer */}
        <XStack
          width="100%"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {steps.map((step, index) => {
            const isActive = isStepCompleted(index) || isStepActive(index);
            const isCurrentStep = isStepActive(index);
            const isCompleted = isStepCompleted(index);

            return (
              <Animated.View
                key={step.key}
                entering={FadeInLeft.delay(index * 120)
                  .duration(500)
                  .springify()
                  .damping(15)}
              >
                <YStack alignItems="center" gap={hp(8)} width={wp(90)}>
                  {/* Step circle container */}
                  <Stack position="relative">
                    {/* Pulse animation for current step */}
                    {isCurrentStep && (
                      <View
                        style={{
                          position: 'absolute',
                          width: wp(48),
                          height: hp(48),
                          top: -hp(6),
                          left: -wp(6),
                          borderRadius: wp(24),
                          backgroundColor: 'rgba(142, 15, 255, 0.15)',
                        }}
                      />
                    )}

                    {/* Main step circle */}
                    {isActive ? (
                      <View
                        style={{
                          width: wp(36),
                          height: hp(36),
                          borderRadius: wp(18),
                          overflow: 'hidden',
                        }}
                      >
                        <LinearGradient
                          colors={
                            isCurrentStep
                              ? ['#8E0FFF', '#A855F7', '#C084FC']
                              : isCompleted
                              ? ['#7C3AED', '#8E0FFF']
                              : ['#5F00BA', '#7C3AED']
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#8E0FFF',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: isCurrentStep ? 0.4 : 0.2,
                            shadowRadius: 8,
                            elevation: isCurrentStep ? 6 : 3,
                          }}
                        >
                          {step.icon(isActive)}
                        </LinearGradient>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: wp(36),
                          height: hp(36),
                          borderRadius: wp(18),
                          backgroundColor: '#FAFAFA',
                          borderWidth: 1.5,
                          borderColor: '#EBEBEF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {step.icon(isActive)}
                      </View>
                    )}

                    {/* Checkmark for completed steps */}
                    {isCompleted && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: -hp(2),
                          right: -wp(2),
                          width: wp(16),
                          height: hp(16),
                          borderRadius: wp(8),
                          backgroundColor: '#22C55E',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 2,
                          borderColor: 'white',
                        }}
                      >
                        <Svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <Path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    )}
                  </Stack>

                  {/* Step label */}
                  <BodySmall
                    color={isActive ? "#8E0FFF" : "#9CA3AF"}
                    fontWeight={isCurrentStep ? "600" : "500"}
                    fontSize={fp(12)}
                    textAlign="center"
                  >
                    {step.label}
                  </BodySmall>
                </YStack>
              </Animated.View>
            );
          })}
        </XStack>
      </Stack>
    </YStack>
  );
}
