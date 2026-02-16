import Svg, { Path } from "react-native-svg";

interface WalletIconProps {
  size?: number;
  color?: string;
}

export function WalletIcon({ size = 20, color = "#8A8AA3" }: WalletIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M13.7503 10.8332C13.7503 11.0633 13.5638 11.2498 13.3337 11.2498C13.1035 11.2498 12.917 11.0633 12.917 10.8332C12.917 10.6031 13.1035 10.4165 13.3337 10.4165C13.5638 10.4165 13.7503 10.6031 13.7503 10.8332Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.95801 5.62516V14.3752C3.95801 15.2956 4.7042 16.0418 5.62467 16.0418H14.3747C15.2951 16.0418 16.0413 15.2956 16.0413 14.3752V8.54183C16.0413 7.62135 15.2951 6.87516 14.3747 6.87516M14.3747 6.87516H5.41634C4.61093 6.87516 3.95801 6.22224 3.95801 5.41683C3.95801 4.61141 4.61093 3.9585 5.41634 3.9585H12.708C13.6285 3.9585 14.3747 4.70469 14.3747 5.62516V6.87516Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
