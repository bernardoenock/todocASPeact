import { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  labelLeft?: React.ReactNode
  labelRight?: React.ReactNode
  className?: string
}

export const Switch = ({
  checked = false,
  onChange,
  size = 'md',
  labelLeft,
  labelRight,
  className,
  ...props
}: SwitchProps) => {
  const config = {
    sm: { track: 'w-10 h-5', thumb: 'w-4 h-4 translate-x-0.5 peer-checked:translate-x-5 top-0.5' },
    md: { track: 'w-12 h-6', thumb: 'w-5 h-5 translate-x-0.5 peer-checked:translate-x-6 top-0.5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6 translate-x-0.5 peer-checked:translate-x-7 top-0.5' },
  }[size]

  return (
    <label className={cn('inline-flex items-center space-x-3', className)}>
      {labelLeft && <span className="text-sm text-gray-600">{labelLeft}</span>}

      <div className={cn('relative inline-block', config.track)}>
        <input
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />

        <span
          aria-hidden
          className={cn(
            'block rounded-full transition-colors duration-200 ease-in-out peer-focus:ring-2 peer-focus:ring-primary-500',
            checked ? 'bg-primary-600' : 'bg-gray-200',
            'w-full h-full'
          )}
        />

        <span
          aria-hidden
          className={cn(
            'absolute bg-white rounded-full shadow transform transition-transform duration-200',
            config.thumb,
            'left-0.5'
          )}
        />
      </div>

      {labelRight && <span className="text-sm text-gray-600">{labelRight}</span>}
    </label>
  )
}
