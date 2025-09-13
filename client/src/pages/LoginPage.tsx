import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { useLogin } from '@/hooks/useAuth'
import { LoginDto } from '@/types/api'
import { AuthForm } from '@/components/organisms/AuthForm'
import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { getErrorMessage } from '@/utils/axios'

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

type LoginFormData = yup.InferType<typeof loginSchema>

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  const loginMutation = useLogin()

  const onSubmit = async (data: LoginDto) => {
    try {
      await loginMutation.mutateAsync(data)
    } catch (error) {
      setError('root', {
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <AuthForm title="Sign in to your account">
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
            placeholder="Enter your username"
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
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            placeholder="Enter your password"
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
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthForm>
  )
}