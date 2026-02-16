import { Badge } from "./Badge";
import { getStatusBadgeProps, formatStatus } from "@/utils/status";

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { backgroundColor, textColor } = getStatusBadgeProps(status);
  const displayLabel = label || formatStatus(status);

  return (
    <Badge
      label={displayLabel}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
}
