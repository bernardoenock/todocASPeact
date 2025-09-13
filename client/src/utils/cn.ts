import { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (typeof input === 'string') {
      classes.push(input)
    } else if (typeof input === 'object' && input !== null) {
      if (Array.isArray(input)) {
        const nested = cn(...input)
        if (nested) classes.push(nested)
      } else {
        for (const [key, value] of Object.entries(input)) {
          if (value) classes.push(key)
        }
      }
    }
  }
  
  return classes.join(' ')
}