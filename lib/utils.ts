import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isNil = <T>(item: T | undefined | null): item is undefined | null => {
  return item === undefined || item === null;
};

export const getMMSSFromMillis = (millis: number) => {
  const totalSeconds = millis / 1000;
  const seconds = Math.round(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);

  const padWithZero = (number: number) => {
    const string = number.toString();
    if (number < 10) {
      return '0' + string;
    }
    return string;
  };
  return padWithZero(minutes) + ':' + padWithZero(seconds);
};
