export type OrderCheckpoint =
  | "draft"
  | "admin_review"
  | "admin_approved"
  | "admin_rejection"
  | "pending_payment"
  | "pending_allocation"
  | "delivery_started"
  | "shoot_start"
  | "shoot_end"
  | "shoot_complete";

export const CHECKPOINT_LABELS: Record<
  OrderCheckpoint,
  { label: string; description: string }
> = {
  draft: {
    label: "Booking Created",
    description: "Your booking request has been submitted",
  },
  admin_review: {
    label: "Under Review",
    description: "Our team is reviewing your booking",
  },
  admin_approved: {
    label: "Approved",
    description: "Your booking has been approved",
  },
  admin_rejection: {
    label: "Rejected",
    description: "Booking was not approved",
  },
  pending_payment: {
    label: "Payment Pending",
    description: "Complete payment to proceed",
  },
  pending_allocation: {
    label: "Preparing Order",
    description: "Allocating equipment for your shoot",
  },
  delivery_started: {
    label: "Out for Delivery",
    description: "Equipment is on its way to you",
  },
  shoot_start: {
    label: "Shoot Started",
    description: "Your shoot has begun",
  },
  shoot_end: {
    label: "Shoot Ended",
    description: "Shoot concluded, awaiting return",
  },
  shoot_complete: {
    label: "Completed",
    description: "Booking completed successfully",
  },
};

/**
 * The full happy-path order of statuses.
 * The timeline will only show steps up to one step AFTER the current status,
 * so users never see irrelevant future steps.
 */
export const CHECKPOINT_ORDER: OrderCheckpoint[] = [
  "draft",
  "admin_review",
  "admin_approved",
  "pending_payment",
  "pending_allocation",
  "delivery_started",
  "shoot_start",
  "shoot_end",
  "shoot_complete",
];

export const getStatusLabel = (status: string): string => {
  return CHECKPOINT_LABELS[status as OrderCheckpoint]?.label || status;
};
