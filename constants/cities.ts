import { ImageSourcePropType } from "react-native";

export interface City {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

export const CITIES: City[] = [
  {
    id: "delhi",
    name: "Delhi",
    image: require("@/assets/images/city_img/delhi.png"),
  },
  {
    id: "mumbai",
    name: "Mumbai",
    image: require("@/assets/images/city_img/mumbai.png"),
  },
  {
    id: "kolkata",
    name: "Kolkata",
    image: require("@/assets/images/city_img/kolkata.png"),
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    image: require("@/assets/images/city_img/bengaluru.png"),
  },
  {
    id: "chennai",
    name: "Chennai",
    image: require("@/assets/images/city_img/chennai.png"),
  },
  {
    id: "pune",
    name: "Pune",
    image: require("@/assets/images/city_img/pune.png"),
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    image: require("@/assets/images/city_img/hyderabad.png"),
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    image: require("@/assets/images/city_img/coimbatore.png"),
  },
];
