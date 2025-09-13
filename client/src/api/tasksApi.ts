import { useApi } from '@/contexts/ApiContext'
import {
  TaskReadDto,
  TaskCreateDto,
  TaskUpdateDto,
  TasksQueryParams,
} from '@/types/api'

export const useTasksApi = () => {
  const { client } = useApi()

  return {
    getTasks: async (params?: TasksQueryParams): Promise<TaskReadDto[]> => {
      const response = await client.get<TaskReadDto[]>('/api/tasks', { params })
      return response.data
    },

    getTask: async (id: number): Promise<TaskReadDto> => {
      const response = await client.get<TaskReadDto>(`/api/tasks/${id}`)
      return response.data
    },

    createTask: async (data: TaskCreateDto): Promise<TaskReadDto> => {
      const response = await client.post<TaskReadDto>('/api/tasks', data)
      return response.data
    },

    updateTask: async (id: number, data: TaskUpdateDto): Promise<TaskReadDto> => {
      const response = await client.put<TaskReadDto>(`/api/tasks/${id}`, data)
      return response.data
    },

    deleteTask: async (id: number): Promise<void> => {
      await client.delete(`/api/tasks/${id}`)
    },
  }
}
