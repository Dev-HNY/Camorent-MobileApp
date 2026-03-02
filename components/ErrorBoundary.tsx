import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { fp, hp, wp } from '@/utils/responsive';
import * as Haptics from 'expo-haptics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.root}>
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            <View style={styles.iconWrap}>
              <AlertCircle size={wp(48)} color="#EF4444" strokeWidth={2} />
            </View>

            <Text style={styles.title}>Oops! Something went wrong</Text>

            <Text style={styles.body}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.devBox}>
                <Text style={styles.devLabel}>Error Details (Dev Only):</Text>
                <Text style={styles.devText}>{this.state.error.toString()}</Text>
              </View>
            )}

            <Pressable onPress={this.handleReset} style={styles.btn}>
              <RefreshCw size={wp(18)} color="white" />
              <Text style={styles.btnText}>Try Again</Text>
            </Pressable>

            <Text style={styles.help}>
              If the problem persists, please contact support
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(24),
    paddingVertical: hp(40),
  },
  iconWrap: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderRadius: wp(60),
    padding: wp(20),
    marginBottom: hp(24),
  },
  title: {
    fontSize: fp(24),
    fontWeight: '700',
    color: '#121217',
    textAlign: 'center',
    marginBottom: hp(12),
  },
  body: {
    fontSize: fp(16),
    fontWeight: '400',
    color: '#6C6C89',
    textAlign: 'center',
    lineHeight: hp(24),
    marginBottom: hp(32),
    maxWidth: wp(320),
  },
  devBox: {
    backgroundColor: 'rgba(239,68,68,0.05)',
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(24),
    maxWidth: wp(320),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.20)',
  },
  devLabel: {
    fontSize: fp(12),
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: hp(8),
  },
  devText: {
    fontSize: fp(11),
    color: '#6C6C89',
    lineHeight: hp(16),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
    backgroundColor: '#8E0FFF',
    paddingVertical: hp(14),
    paddingHorizontal: wp(32),
    borderRadius: wp(14),
  },
  btnText: {
    fontSize: fp(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  help: {
    fontSize: fp(13),
    color: '#6C6C89',
    textAlign: 'center',
    marginTop: hp(24),
    lineHeight: hp(20),
  },
});

export function SimpleErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <AlertCircle size={wp(48)} color="#EF4444" strokeWidth={2} />
        <Text style={[styles.title, { marginTop: hp(16), fontSize: fp(18) }]}>
          Something went wrong
        </Text>
        <Text style={[styles.body, { marginBottom: hp(24) }]}>
          {error?.message || 'An unexpected error occurred'}
        </Text>
        {resetError && (
          <Pressable onPress={resetError} style={styles.btn}>
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
