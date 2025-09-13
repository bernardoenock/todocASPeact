import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'flex items-center justify-center w-4 h-4 border-2 border-gray-300 rounded transition-colors',
            props.checked && 'bg-primary-600 border-primary-600',
            className
          )}
        >
          {props.checked && <Check className="w-3 h-3 text-white" />}
        </div>
        {label && (
          <span className="text-sm text-gray-700">{label}</span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
