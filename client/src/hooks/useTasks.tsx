import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TaskReadDto,
  TaskCreateDto,
  TaskUpdateDto,
  TasksQueryParams,
} from '@/types/api'
import { useTasksApi } from '@/api/tasksApi'

const TASKS_QUERY_KEY = 'tasks'

export const useTasks = (params?: TasksQueryParams) => {
  const tasksApi = useTasksApi()
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, params],
    queryFn: () => tasksApi.getTasks(params),
  })
}

export const useTask = (id: number) => {
  const tasksApi = useTasksApi()
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const tasksApi = useTasksApi()

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const tasksApi = useTasksApi()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdateDto }) =>
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  const tasksApi = useTasksApi()

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}
