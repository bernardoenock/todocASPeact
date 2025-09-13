import { TaskReadDto } from '@/types/api'
import { TaskRow } from '@/components/molecules/TaskRow'

interface TaskListProps {
  tasks: TaskReadDto[]
  onEdit: (task: TaskReadDto) => void
  onDelete: (id: number) => void
  onToggleComplete: (id: number, isCompleted: boolean) => void
  isLoading?: boolean
}

export const TaskList = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  isLoading 
}: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm mt-1">
          Create your first task to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskRow
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  )
}