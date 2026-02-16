import { ImageSourcePropType } from "react-native";

export interface Brand {
  id: string;
  name: string;
  logo: ImageSourcePropType;
}

export const BRANDS: Brand[] = [
  {
    id: "canon",
    name: "Canon",
    logo: require("@/assets/images/brands/canon-logo.png"),
  },
  {
    id: "sony",
    name: "Sony",
    logo: require("@/assets/images/brands/sony-logo.png"),
  },
  {
    id: "arri",
    name: "ARRI",
    logo: require("@/assets/images/brands/arri-logo.png"),
  },
  {
    id: "sandisk",
    name: "SanDisk",
    logo: require("@/assets/images/brands/sandisk-logo.png"),
  },
];
