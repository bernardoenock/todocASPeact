import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/authApi'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterDto, LoginDto } from '@/types/api'
import { getErrorMessage } from '@/utils/axios'

export const useRegister = () => {
  const navigate = useNavigate()

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