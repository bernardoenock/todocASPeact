import { useApi } from '@/contexts/ApiContext'
import { RegisterDto, LoginDto, AuthResponse } from '@/types/api'

export const useAuthApi = () => {
  const { client } = useApi()

  return {
    register: async (data: RegisterDto): Promise<void> => {
      await client.post('/api/users/register', data)
    },

    login: async (data: LoginDto): Promise<AuthResponse> => {
      const response = await client.post<AuthResponse>('/api/users/login', data)
      return response.data
    },
  }
}
