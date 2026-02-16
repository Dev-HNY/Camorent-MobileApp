/**
 * Premium Gradient System for Camorent
 * Consistent gradient definitions used throughout the app
 */

export const GRADIENTS = {
  // Primary purple gradients
  primary: {
    colors: ['#8E0FFF', '#6D00DA'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },
  primaryVertical: {
    colors: ['#8E0FFF', '#6D00DA'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 0, y: 1 } as const,
  },
  primaryDiagonal: {
    colors: ['#8E0FFF', '#6D00DA'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 1 } as const,
  },

  // Subtle background tints
  subtlePurple: {
    colors: ['rgba(255, 255, 255, 1)', 'rgba(142, 15, 255, 0.02)', 'rgba(255, 255, 255, 1)'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 1 } as const,
  },
  subtlePurpleVertical: {
    colors: ['rgba(255, 255, 255, 1)', 'rgba(142, 15, 255, 0.015)', 'rgba(255, 255, 255, 1)'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 0, y: 1 } as const,
  },

  // Card gradients
  cardSubtle: {
    colors: ['rgba(255, 255, 255, 1)', 'rgba(142, 15, 255, 0.02)', 'rgba(255, 255, 255, 1)'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 1 } as const,
  },
  cardGlow: {
    colors: ['rgba(142, 15, 255, 0.08)', 'rgba(255, 255, 255, 0.95)', 'rgba(142, 15, 255, 0.08)'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },

  // Gold/Premium gradients (for special offers, badges)
  gold: {
    colors: ['#FFF3D6', '#FFFFFF'] as const,
    locations: [0, 0.8413] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },
  goldVertical: {
    colors: ['#FFF3D6', '#FFFFFF'] as const,
    locations: [0, 0.8413] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 0, y: 1 } as const,
  },

  // Success gradients
  success: {
    colors: ['#00D084', '#00A66C'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },

  // Error gradients
  error: {
    colors: ['#FF3B30', '#D32F2F'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },

  // Background overlays
  overlay: {
    colors: ['rgba(18, 18, 23, 0)', 'rgba(18, 18, 23, 0.7)'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 0, y: 1 } as const,
  },
  overlayLight: {
    colors: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 0, y: 1 } as const,
  },

  // Header gradients
  headerGlow: {
    colors: ['#FFFFFF', '#F8F7FF', '#FFFFFF'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 0, y: 1 } as const,
  },

  // Separator/Border gradients
  separatorPurple: {
    colors: ['#FFF', '#8E0FFF', '#FFF'] as const,
    locations: [0, 0.5192, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },

  // Feature/Badge gradients
  featureBadge: {
    colors: ['#FFF9EB', '#FFF'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },

  // Button gradients
  buttonPrimary: {
    colors: ['#8E0FFF', '#6D00DA'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },
  buttonSecondary: {
    colors: ['#F5EEFF', '#FFFFFF'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 0 } as const,
  },

  // Status gradients
  statusUpcoming: {
    colors: ['rgba(0, 172, 255, 0.1)', 'rgba(0, 172, 255, 0.02)'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 1 } as const,
  },
  statusOngoing: {
    colors: ['rgba(255, 159, 10, 0.1)', 'rgba(255, 159, 10, 0.02)'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 1 } as const,
  },
  statusPast: {
    colors: ['rgba(108, 108, 137, 0.1)', 'rgba(108, 108, 137, 0.02)'] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 } as const,
    end: { x: 1, y: 1 } as const,
  },
} as const;

/**
 * Helper to create custom gradients
 */
export function createGradient(
  colors: readonly string[],
  options?: {
    locations?: readonly number[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  }
) {
  return {
    colors,
    locations: options?.locations || [0, 1],
    start: options?.start || { x: 0, y: 0 },
    end: options?.end || { x: 1, y: 0 },
  };
}

/**
 * Animated gradient colors for backgrounds
 */
export const ANIMATED_GRADIENTS = {
  purplePulse: {
    colors: [
      ['rgba(255, 255, 255, 1)', 'rgba(142, 15, 255, 0.01)', 'rgba(255, 255, 255, 1)'],
      ['rgba(255, 255, 255, 1)', 'rgba(142, 15, 255, 0.03)', 'rgba(255, 255, 255, 1)'],
      ['rgba(255, 255, 255, 1)', 'rgba(142, 15, 255, 0.01)', 'rgba(255, 255, 255, 1)'],
    ] as const,
    duration: 8000,
  },
  goldShimmer: {
    colors: [
      ['#FFF3D6', '#FFFFFF'],
      ['#FFFBF0', '#FFFFFF'],
      ['#FFF3D6', '#FFFFFF'],
    ] as const,
    duration: 3000,
  },
} as const;
