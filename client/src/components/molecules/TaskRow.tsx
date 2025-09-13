import { TaskReadDto } from '@/types/api'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Edit2, Trash2 } from 'lucide-react'

interface TaskRowProps {
  task: TaskReadDto
  onEdit: (task: TaskReadDto) => void
  onDelete: (id: number) => void
  onToggleComplete: (id: number, isCompleted: boolean) => void
}

export const TaskRow = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}: TaskRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            checked={task.isCompleted}
            onChange={(e) => onToggleComplete(task.id, e.target.checked)}
            aria-label={`Mark ${task.title} as ${task.isCompleted ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <Badge variant={task.isCompleted ? 'success' : 'secondary'}>
                {task.category}
              </Badge>
            </div>
            {task.description && (
              <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Created: {formatDate(task.createdAt)}</span>
              {task.updatedAt && (
                <span>Updated: {formatDate(task.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}