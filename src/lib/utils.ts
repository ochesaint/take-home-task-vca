import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and merges Tailwind classes intelligently.
 * Handles conflicting Tailwind utilities by keeping the last one.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
