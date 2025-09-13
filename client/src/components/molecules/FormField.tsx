import { ReactNode } from 'react'
import { Label } from '@/components/atoms/Label'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
  htmlFor?: string
  required?: boolean
}

export const FormField = ({ 
  label, 
  error, 
  children, 
  htmlFor,
  required 
}: FormFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}