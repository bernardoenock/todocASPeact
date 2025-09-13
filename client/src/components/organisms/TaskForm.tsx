import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TaskCreateDto, TaskUpdateDto, TaskReadDto } from '@/types/api'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Checkbox } from '@/components/atoms/Checkbox'
import { FormField } from '@/components/molecules/FormField'

const taskSchema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title must be at most 100 characters'),
  description: yup.string().max(500, 'Description must be at most 500 characters'),
  isCompleted: yup.boolean().required(),
  category: yup.string().required('Category is required').max(50, 'Category must be at most 50 characters'),
})

type TaskFormData = yup.InferType<typeof taskSchema>

interface TaskFormProps {
  task?: TaskReadDto
  onSubmit: (data: TaskCreateDto | TaskUpdateDto) => void
  onCancel: () => void
  isLoading?: boolean
}

export const TaskForm = ({ task, onSubmit, onCancel, isLoading }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      isCompleted: task?.isCompleted || false,
      category: task?.category || '',
    },
  })

  const isCompleted = watch('isCompleted')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField 
        label="Title" 
        error={errors.title?.message} 
        htmlFor="title"
        required
      >
        <Input
          id="title"
          {...register('title')}
          error={!!errors.title}
          placeholder="Enter task title"
        />
      </FormField>

      <FormField 
        label="Description" 
        error={errors.description?.message} 
        htmlFor="description"
      >
        <Textarea
          id="description"
          {...register('description')}
          error={!!errors.description}
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </FormField>

      <FormField 
        label="Category" 
        error={errors.category?.message} 
        htmlFor="category"
        required
      >
        <Input
          id="category"
          {...register('category')}
          error={!!errors.category}
          placeholder="Enter category"
        />
      </FormField>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCompleted"
          checked={isCompleted}
          onChange={(e) => setValue('isCompleted', e.target.checked)}
          label="Mark as completed"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}