// Price formatting utilities
export function formatPrice(
  price: string | number,
  options?: {
    currency?: boolean;
    locale?: string;
    fractionDigits?: number | null;
  }
): string {
  if (typeof price === 'string') {
    const num = Number(price);
    if (isNaN(num)) return price; // Return original if can't parse
    price = num;
  }

  const {
    currency = true,
    locale = 'en-IN',
    fractionDigits = 0,
  } = options || {};

  const formatOptions: Intl.NumberFormatOptions = currency
    ? {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: fractionDigits ?? 0,
      }
    : { maximumFractionDigits: fractionDigits ?? 0 };

  return new Intl.NumberFormat(locale, formatOptions).format(price);
}

export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace(/[^0-9.]/g, ''));
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
}

// Date formatting
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString();
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}