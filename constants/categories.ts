import { ImageSourcePropType } from "react-native";

export interface CategoryConfig {
  id: string;
  name: string;
  image: ImageSourcePropType;
  gradientColors: string[];
  gradientLocations?: number[];
}

export const CATEGORY_GRADIENT = {
  colors: ["#FFF", "#ADE4FF"] as string[],
  locations: [0.1749, 0.9587],
};

export const DEFAULT_CATEGORY_IMAGE = require("@/assets/images/camera-on-stool 2.png");
