import { axiosInstance } from '@/utils/axios'
import { RegisterDto, LoginDto, AuthResponse } from '@/types/api'

export const authApi = {
  register: async (data: RegisterDto): Promise<void> => {
    await axiosInstance.post('/api/users/register', data)
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/api/users/login', data)
    return response.data
  },
}