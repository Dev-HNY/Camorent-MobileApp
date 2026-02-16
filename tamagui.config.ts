import { shorthands } from "@tamagui/shorthands";
import { themes } from "@tamagui/themes";
import { createFont, createTamagui } from "tamagui";
import { createAnimations } from "@tamagui/animations-react-native";
import { tokens } from "./theme/tokens";

const appFont = createFont({
  family: "System",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
  },
  weight: {
    300: "300",
    400: "400",
    500: "500",
    600: "600",
    700: "700",
  },
  letterSpacing: {
    1: 0,
    2: -0.2,
    3: -0.4,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 20,
    4: 24,
    5: 28,
    6: 32,
  },
  face: {
    300: { normal: "System" },
    400: { normal: "System" },
    500: { normal: "System" },
    600: { normal: "System" },
    700: { normal: "System" },
  },
});

const animations = createAnimations({
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  smooth: {
    damping: 20,
    stiffness: 60,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
});

const config = createTamagui({
  animations,
  fonts: {
    body: appFont,
    heading: appFont,
  },
  defaultTheme: "light",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  themes,
  tokens,
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
