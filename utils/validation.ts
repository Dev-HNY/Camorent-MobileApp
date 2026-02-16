import { z } from 'zod';

// Common validation schemas
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format');