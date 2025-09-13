import { useState, useMemo } from 'react'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { TaskReadDto, TaskCreateDto, TaskUpdateDto, TasksQueryParams } from '@/types/api'
import { AppLayout } from '@/components/templates/AppLayout'
import { TaskList } from '@/components/organisms/TaskList'
import { TaskFilters } from '@/components/organisms/TaskFilters'
import { TaskForm } from '@/components/organisms/TaskForm'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/atoms/Modal'
import { Plus } from 'lucide-react'

export const TasksPage = () => {
  const [filters, setFilters] = useState<TasksQueryParams>({})
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskReadDto | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const { data: tasks = [], isLoading } = useTasks(filters)
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const categories = useMemo(() => {
    const uniqueCategories = new Set(tasks.map(task => task.category))
    return Array.from(uniqueCategories).sort()
  }, [tasks])

  const handleCreateTask = async (data: TaskCreateDto) => {
    await createTaskMutation.mutateAsync(data)
    setIsCreateModalOpen(false)
  }

  const handleUpdateTask = async (data: TaskUpdateDto) => {
    if (!editingTask) return
    await updateTaskMutation.mutateAsync({ id: editingTask.id, data })
    setEditingTask(null)
  }

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return
    await deleteTaskMutation.mutateAsync(deletingTaskId)
    setDeletingTaskId(null)
  }

  const handleToggleComplete = async (id: number, isCompleted: boolean) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    await updateTaskMutation.mutateAsync({
      id,
      data: { ...task, isCompleted },
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          </div>
          <div className="lg:col-span-3">
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={setDeletingTaskId}
              onToggleComplete={handleToggleComplete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createTaskMutation.isPending}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            isLoading={updateTaskMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeletingTaskId(null)}
              disabled={deleteTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTask}
              disabled={deleteTaskMutation.isPending}
            >
              {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}