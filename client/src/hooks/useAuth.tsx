import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterDto, LoginDto } from '@/types/api'
import { getErrorMessage } from '@/utils/axios'
import { useAuthApi } from '@/api/authApi'

export const useRegister = () => {
  const navigate = useNavigate()
  const authApi = useAuthApi()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate('/login')
    },
    onError: (error: unknown) => {
      throw new Error(getErrorMessage(error))
    },
  })
}

export const useLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const authApi = useAuthApi()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token)
      navigate('/tasks')
    },
    onError: (error: unknown) => {
      throw new Error(getErrorMessage(error))
    },
  })
}
