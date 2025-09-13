import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const Badge = ({ variant = 'secondary', children, className, onClick }: BadgeProps) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  }

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer', // cursor-pointer aqui
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}