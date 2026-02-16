import { createTokens } from "tamagui";

export const tokens = createTokens({
  color: {
    primary: "#6D00DA",
    primaryLight: "#B197FC",
    background: "#ffffff",

    text: "#000000",
    textPrimary: "#121217",
    textSecondary: "#666666",
    textLight: "#ffffff",

    border: "#E5E5E5",

    success: "#00D084",
    error: "#FF3B30",
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    true: 8,
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    true: 4,
  },
  size: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 24,
    6: 28,
    7: 32,
    8: 36,
    true: 16,
  },
  fontFamily: {
    body: "Geist-Regular",
    heading: "Geist-Regular",
  },
  fontSize: {
    // Design system sizes
    120: 12, // $Cam-font-size-120
    140: 14,
    160: 16, // $Cam-font-size-160
    180: 18,
    200: 20,
    240: 24,
    280: 28,
    320: 32,
    // Tamagui numeric tokens
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    true: 16,
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    true: "400",
    // Numeric weights for direct use
    300: "300",
    400: "400",
    500: "500",
    600: "600",
    700: "700",
  },
  lineHeight: {
    // Design system line heights (percentages converted to px)
    120: 16.2, // 135% of 12px
    125: 20, // 125% of 16px
    130: 18.2, // 130% of 14px
    135: 16.2, // 135% of 12px
    // Standard line heights
    1: 16,
    2: 18,
    3: 20,
    4: 24,
    5: 28,
    6: 32,
    true: 20,
  },
  zIndex: {
    0: 0,
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    true: 1,
  },
});
