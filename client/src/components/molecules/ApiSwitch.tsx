import { Switch } from '@/components/atoms/Switch'
import { useApi } from '@/contexts/ApiContext'

export const ApiSwitch = () => {
  const { isLocal, toggleClient } = useApi()

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Axios</span>

      <Switch
        size="md"
        checked={isLocal}
        onChange={() => toggleClient()}
        aria-label="Toggle API client (local / axios)"
      />

      <span className="text-sm text-gray-600">Local</span>
    </div>
  )
}
