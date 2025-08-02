import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseJSON = (text: string) => {
  try {
    return JSON.parse(text)
  } catch (error) {
    console.error('Error parsing json:', error)
    return []
  }
}
