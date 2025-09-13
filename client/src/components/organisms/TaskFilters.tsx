import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { TasksQueryParams } from '@/types/api'

interface TaskFiltersProps {
  filters: TasksQueryParams
  onFiltersChange: (filters: TasksQueryParams) => void
  categories: string[]
}

export const TaskFilters = ({ 
  filters, 
  onFiltersChange, 
  categories 
}: TaskFiltersProps) => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(filters.category)
  const [activeStatus, setActiveStatus] = useState<boolean | undefined>(filters.isCompleted)

  const handleCategoryFilter = (category: string | undefined) => {
    setActiveCategory(category)
    onFiltersChange({ ...filters, category })
  }

  const handleStatusFilter = (isCompleted: boolean | undefined) => {
    setActiveStatus(isCompleted)
    onFiltersChange({ ...filters, isCompleted })
  }

  const clearFilters = () => {
    setActiveCategory(undefined)
    setActiveStatus(undefined)
    onFiltersChange({})
  }

  const hasActiveFilters = activeCategory || activeStatus !== undefined

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
        <div className="flex gap-2">
          <Button
            variant={activeStatus === undefined ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleStatusFilter(undefined)}
          >
            All
          </Button>
          <Button
            variant={activeStatus === false ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleStatusFilter(false)}
          >
            Pending
          </Button>
          <Button
            variant={activeStatus === true ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleStatusFilter(true)}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!activeCategory ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryFilter(undefined)}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Badge
                key={category}
                variant={activeCategory === category ? 'primary' : 'secondary'}
                className="cursor-pointer hover:bg-primary-200"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}