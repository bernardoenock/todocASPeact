import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { useRegister } from '@/hooks/useAuth'
import { RegisterDto } from '@/types/api'
import { AuthForm } from '@/components/organisms/AuthForm'
import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { getErrorMessage } from '@/utils/axios'

const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type RegisterFormData = yup.InferType<typeof registerSchema>

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  })

  const registerMutation = useRegister()

  const onSubmit = async (data: RegisterDto) => {
    try {
      await registerMutation.mutateAsync(data)
    } catch (error) {
      setError('root', {
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <AuthForm title="Create your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Username"
          error={errors.username?.message}
          htmlFor="username"
          required
        >
          <Input
            id="username"
            type="text"
            autoComplete="username"
            {...register('username')}
            error={!!errors.username}
            placeholder="Enter your username (min 3 characters)"
          />
        </FormField>

        <FormField
          label="Password"
          error={errors.password?.message}
          htmlFor="password"
          required
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            placeholder="Enter your password (min 6 characters)"
          />
        </FormField>

        {errors.root && (
          <div className="text-red-600 text-sm" role="alert">
            {errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthForm>
  )
}