import { fp, hp } from "@/utils/responsive";
import { styled, Text } from "tamagui";

// Design System Typography Components
// Helvetica Neue - Industry Standard Typography
// Inspired by Apple, Airbnb design systems

// Text Color Palette - Consistent across all components
const colors = {
  primary: "#1C1C1E",      // Primary text - rich black
  secondary: "#6C6C70",    // Secondary text - medium gray
  tertiary: "#8E8E93",     // Tertiary text - light gray
  brand: "#8E0FFF",        // Brand purple
  white: "#FFFFFF",
};

export const HomeScreenHeading = styled(Text, {
  fontSize: fp(17),
  fontWeight: "600",
  fontFamily: "$body",
  color: colors.primary,
  lineHeight: hp(22),
  letterSpacing: -0.4,
});

export const Heading1 = styled(Text, {
  fontSize: fp(24),
  fontWeight: "700",
  fontFamily: "$heading",
  color: colors.primary,
  lineHeight: hp(30),
  letterSpacing: -0.5,
});

export const Heading2 = styled(Text, {
  fontSize: fp(17),
  fontWeight: "600",
  fontFamily: "$heading",
  color: colors.primary,
  lineHeight: hp(22),
  letterSpacing: -0.4,
});

export const BodyText = styled(Text, {
  fontSize: fp(15),
  fontWeight: "400",
  fontFamily: "$body",
  color: colors.primary,
  lineHeight: hp(20),
  letterSpacing: -0.2,
});

export const BodySmall = styled(Text, {
  fontSize: fp(13),
  fontFamily: "$body",
  fontWeight: "400",
  color: colors.secondary,
  lineHeight: hp(18),
  letterSpacing: -0.1,
});

export const Price = styled(Text, {
  fontSize: fp(24),
  fontFamily: "$body",
  fontWeight: "700",
  color: colors.primary,
  lineHeight: hp(28),
  letterSpacing: -0.3,
});

export const PriceSmall = styled(Text, {
  fontSize: fp(17),
  fontFamily: "$body",
  fontWeight: "600",
  color: colors.primary,
  lineHeight: hp(22),
  letterSpacing: -0.2,
});

export const Caption = styled(Text, {
  fontSize: fp(13),
  fontFamily: "$body",
  fontWeight: "400",
  color: colors.secondary,
  lineHeight: hp(18),
  letterSpacing: -0.1,
});

export const Badge = styled(Text, {
  fontSize: fp(11),
  fontFamily: "$body",
  fontWeight: "600",
  color: colors.white,
  lineHeight: hp(14),
  letterSpacing: 0.1,
  textTransform: "uppercase",
});

export const ProductTitle = styled(Text, {
  fontSize: fp(15),
  fontFamily: "$body",
  fontWeight: "600",
  color: colors.primary,
  lineHeight: hp(20),
  letterSpacing: -0.2,
});

export const Rating = styled(Text, {
  fontSize: fp(13),
  fontFamily: "$body",
  fontWeight: "500",
  color: colors.secondary,
  lineHeight: hp(18),
});

export const CategoriesSectionText = styled(Text, {
  fontSize: fp(13),
  fontFamily: "$body",
  fontWeight: "500",
  color: colors.primary,
  lineHeight: hp(18),
  letterSpacing: -0.1,
});
