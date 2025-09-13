import { createContext, useContext, useState, ReactNode } from 'react'
import { axiosInstance } from '@/utils/axios'
import { localInstance } from '@/utils/local'
import { Instance } from '@/types/instance'

interface ApiContextType {
  client: Instance
  isLocal: boolean
  toggleClient: () => void
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

const STORAGE_KEY = 'use_local_api'

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [isLocal, setIsLocal] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : false
    } catch {
      return false
    }
  })

  const toggleClient = () =>
    setIsLocal((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
      }
      return next
    })

  const client: Instance = isLocal ? localInstance : axiosInstance

  return (
    <ApiContext.Provider value={{ client, isLocal, toggleClient }}>
      {children}
    </ApiContext.Provider>
  )
}
