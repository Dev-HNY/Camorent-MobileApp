import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

// Figma design base dimensions
const DESIGN_WIDTH = 360;
const DESIGN_HEIGHT = 800;

// Width percentage - converts Figma width pixels to responsive width
export const wp = (pixels) => (pixels / DESIGN_WIDTH) * width;

// Height percentage - converts Figma height pixels to responsive height
export const hp = (pixels) => (pixels / DESIGN_HEIGHT) * height;

// Font scaling with moderate factor for better readability across devices
export const fp = (pixels, factor = 0.5) => {
  const scale = width / DESIGN_WIDTH;
  return pixels + (scale * pixels - pixels) * factor;
};

// Direct pixel conversion (use sparingly, prefer wp/hp)
export const px = (pixels) => wp(pixels);

// Device size helpers
export const isSmallDevice = width < 375;
export const isMediumDevice = width >= 375 && width < 414;
export const isLargeDevice = width >= 414;

// Screen orientation
export const isPortrait = height > width;
export const isLandscape = width > height;

// Device type detection
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Safe area helpers (for edge-to-edge)
export const STATUSBAR_HEIGHT = Platform.select({
  ios: 20,
  android: StatusBar.currentHeight || 0,
  default: 0,
});

// Screen dimensions
export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;
export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;

// Responsive breakpoints
export const getDeviceSize = () => {
  if (width < 375) return 'small';
  if (width >= 375 && width < 414) return 'medium';
  if (width >= 414 && width < 768) return 'large';
  return 'xlarge'; // Tablets
};

// Calculate aspect ratio
export const getAspectRatio = () => width / height;

// Check if device is tablet
export const isTablet = () => {
  const aspectRatio = getAspectRatio();
  return (
    (Platform.OS === 'ios' && Platform.isPad) ||
    (width >= 768 && aspectRatio < 1.6)
  );
};

// Responsive value based on device size
export const responsiveValue = (small, medium, large, xlarge) => {
  const size = getDeviceSize();
  switch (size) {
    case 'small':
      return small;
    case 'medium':
      return medium || small;
    case 'large':
      return large || medium || small;
    case 'xlarge':
      return xlarge || large || medium || small;
    default:
      return small;
  }
};

// Edge-to-edge padding helpers
export const edgeToEdgePadding = {
  horizontal: wp(16),
  vertical: hp(12),
  top: hp(12),
  bottom: hp(12),
};

// Common spacing values
export const spacing = {
  xs: wp(4),
  sm: wp(8),
  md: wp(12),
  lg: wp(16),
  xl: wp(24),
  xxl: wp(32),
};