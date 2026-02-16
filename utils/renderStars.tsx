import { StarIcon } from "@/components/ui/StarIcon";
export const renderStars = (rating: number, maxStars: number = 5) => {
  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    const isFilled = i < Math.ceil(rating);
    stars.push(
      <StarIcon
        key={i}
        width={16}
        height={16}
        fill={isFilled ? "#FFC233" : "#E2E8F0"}
      />
    );
  }
  return stars;
};
