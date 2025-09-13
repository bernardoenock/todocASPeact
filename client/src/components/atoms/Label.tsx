import { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export const Label = ({ className, children, ...props }: LabelProps) => {
  return (
    <label
      className={cn('text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
    </label>
  )
}