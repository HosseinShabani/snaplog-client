import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isNil = <T>(item: T | undefined | null): item is undefined | null => {
  return item === undefined || item === null;
};