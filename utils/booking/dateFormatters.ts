/**
 * Date formatting utilities for booking/checkout flows
 * Handles conversion between different date formats used in the app
 */

/**
 * Converts backend date format to display format
 * @param dateStr - Date in "YYYY-MM-DD" format
 * @returns Date in "DD-MM-YYYY" format
 * @example formatBookingDate("2025-11-03") // "03-11-2025"
 */
export function formatBookingDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
}

/**
 * Converts display date format to backend format
 * @param dateStr - Date in "DD-MM-YYYY" format
 * @returns Date in "YYYY-MM-DD" format
 * @example formatDateForBackend("03-11-2025") // "2025-11-03"
 */
export function formatDateForBackend(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const [day, month, year] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${year}-${month}-${day}`;
}

/**
 * Formats date for user-friendly display
 * @param dateStr - Date in "DD-MM-YYYY" format
 * @returns Formatted date like "Wed, Jan 17"
 * @example formatDateDisplay("17-01-2025") // "Wed, Jan 17"
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;

  const [day, month, year] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Check if date is valid
  if (isNaN(date.getTime())) return dateStr;

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

/**
 * Formats a date range for display
 * @param startDate - Start date in "DD-MM-YYYY" format
 * @param endDate - End date in "DD-MM-YYYY" format
 * @returns Formatted date range string
 * @example formatDateRange("17-01-2025", "20-01-2025") // "17-01-2025 to 20-01-2025"
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "";
  return `${startDate} to ${endDate}`;
}

/**
 * Compares two dates in DD-MM-YYYY format
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if date1 is after or equal to date2
 */
export function isDateAfterOrEqual(date1: string, date2: string): boolean {
  const [d1, m1, y1] = date1.split("-").map(Number);
  const [d2, m2, y2] = date2.split("-").map(Number);

  const dateObj1 = new Date(y1, m1 - 1, d1);
  const dateObj2 = new Date(y2, m2 - 1, d2);

  return dateObj1 >= dateObj2;
}
