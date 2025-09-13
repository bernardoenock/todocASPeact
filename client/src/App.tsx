import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ApiProvider } from '@/contexts/ApiContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { TasksPage } from '@/pages/TasksPage'
import { ApiSwitch } from '@/components/molecules/ApiSwitch'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ApiProvider>
          <BrowserRouter>
            <header className="p-4 flex justify-end">
              <ApiSwitch />
            </header>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </BrowserRouter>
        </ApiProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
