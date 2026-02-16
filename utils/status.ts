export const getStatusBadgeProps = (
  status: string
): { backgroundColor: string; textColor: string } => {
  switch (status) {
    case "completed":
      return { backgroundColor: "#F3E8FF", textColor: "#7C3AED" };
    case "in_progress":
      return { backgroundColor: "#DBEAFE", textColor: "#2563EB" };
    case "confirmed":
      return { backgroundColor: "#D1FAE5", textColor: "#059669" };
    case "awaiting_confirmation":
      return { backgroundColor: "#FEF3C7", textColor: "#92400E" };
    case "cancelled":
      return { backgroundColor: "#FEE2E2", textColor: "#DC2626" };
    default:
      return { backgroundColor: "#F3F4F6", textColor: "#6B7280" };
  }
};

export const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
