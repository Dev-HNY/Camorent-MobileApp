export type MyShootsBooking = {
  booking_id: string;
  booking_reference: string;
  shoot_name?: string;
  created_at: string;
  rental_end_date: string;
  rental_start_date: string;
  sku_list: string[];
  status: string;
  total_amount: string;
  rating?: number;
  review?: string;
  invoice_id?: string;
  invoice_status?: string;
  payment_status?: string;
};

export const categoriseBookings = (bookings: MyShootsBooking[]) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const past: MyShootsBooking[] = [];
  const ongoing: MyShootsBooking[] = [];
  const upcoming: MyShootsBooking[] = [];
  bookings?.forEach((booking) => {
    if (booking.status === 'draft') return;
    const start = new Date(booking.rental_start_date).setHours(0, 0, 0, 0);
    const end = new Date(booking.rental_end_date).setHours(0, 0, 0, 0);
    if (today > end) {
      past.push(booking);
    } else if (today < start) {
      upcoming.push(booking);
    } else ongoing.push(booking);
  });
  return { past, upcoming, ongoing };
};
