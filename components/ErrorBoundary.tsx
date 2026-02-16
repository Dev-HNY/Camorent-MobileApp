import React, { Component, ErrorInfo, ReactNode } from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { fp, hp, wp } from '@/utils/responsive';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/theme/gradients';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DURATION } from '@/components/animations/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you would log to an error reporting service
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <LinearGradient {...GRADIENTS.subtlePurpleVertical} style={{ flex: 1 }}>
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={wp(24)}
          >
            <Animated.View
              entering={FadeInDown.springify().damping(18).stiffness(250)}
              style={{ alignItems: 'center', width: '100%' }}
            >
              {/* Error Icon */}
              <YStack
                backgroundColor="rgba(239, 68, 68, 0.1)"
                borderRadius={wp(60)}
                padding={wp(20)}
                marginBottom={hp(24)}
              >
                <AlertCircle size={wp(48)} color="#EF4444" strokeWidth={2} />
              </YStack>

              {/* Error Title */}
              <Text
                fontSize={fp(24)}
                fontWeight="700"
                color="#121217"
                textAlign="center"
                marginBottom={hp(12)}
              >
                Oops! Something went wrong
              </Text>

              {/* Error Message */}
              <Text
                fontSize={fp(16)}
                fontWeight="400"
                color="#6C6C89"
                textAlign="center"
                lineHeight={hp(24)}
                marginBottom={hp(32)}
                maxWidth={wp(320)}
              >
                We encountered an unexpected error. Don't worry, your data is safe.
              </Text>

              {/* Error Details (only in development) */}
              {__DEV__ && this.state.error && (
                <YStack
                  backgroundColor="rgba(239, 68, 68, 0.05)"
                  borderRadius={wp(12)}
                  padding={wp(16)}
                  marginBottom={hp(24)}
                  maxWidth={wp(320)}
                  borderWidth={1}
                  borderColor="rgba(239, 68, 68, 0.2)"
                >
                  <Text
                    fontSize={fp(12)}
                    fontWeight="600"
                    color="#EF4444"
                    marginBottom={hp(8)}
                  >
                    Error Details (Dev Only):
                  </Text>
                  <Text
                    fontSize={fp(11)}
                    fontWeight="400"
                    color="#6C6C89"
                    lineHeight={hp(16)}
                  >
                    {this.state.error.toString()}
                  </Text>
                </YStack>
              )}

              {/* Reset Button */}
              <Button
                onPress={this.handleReset}
                size="lg"
                variant="primary"
              >
                <XStack gap={wp(8)} alignItems="center">
                  <RefreshCw size={wp(18)} color="white" />
                  <Text fontSize={fp(16)} fontWeight="600" color="white">
                    Try Again
                  </Text>
                </XStack>
              </Button>

              {/* Help Text */}
              <Text
                fontSize={fp(13)}
                fontWeight="400"
                color="#6C6C89"
                textAlign="center"
                marginTop={hp(24)}
                lineHeight={hp(20)}
              >
                If the problem persists, please contact support
              </Text>
            </Animated.View>
          </YStack>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple Error Fallback Component
 * Can be used as a custom fallback prop for ErrorBoundary
 */
export function SimpleErrorFallback({
  error,
  resetError
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={wp(24)}
      backgroundColor="#FAFAFA"
    >
      <AlertCircle size={wp(48)} color="#EF4444" strokeWidth={2} />
      <Text
        fontSize={fp(18)}
        fontWeight="600"
        color="#121217"
        textAlign="center"
        marginTop={hp(16)}
        marginBottom={hp(8)}
      >
        Something went wrong
      </Text>
      <Text
        fontSize={fp(14)}
        color="#6C6C89"
        textAlign="center"
        marginBottom={hp(24)}
      >
        {error?.message || 'An unexpected error occurred'}
      </Text>
      {resetError && (
        <Button onPress={resetError} variant="outline">
          Try Again
        </Button>
      )}
    </YStack>
  );
}
