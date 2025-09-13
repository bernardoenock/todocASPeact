// Authentication DTOs
export interface RegisterDto {
  username: string
  password: string
}

export interface LoginDto {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

// Task DTOs
export interface TaskCreateDto {
  title: string
  description?: string
  isCompleted: boolean
  category: string
}

export interface TaskUpdateDto {
  title: string
  description?: string
  isCompleted: boolean
  category: string
}

export interface TaskReadDto {
  id: number
  title: string
  description?: string
  isCompleted: boolean
  category: string
  createdAt: string
  updatedAt?: string
}

// API Response types
export interface ApiError {
  message: string
  statusCode: number
}

// Query parameters
export interface TasksQueryParams {
  category?: string
  isCompleted?: boolean
}

// Local
export interface LocalUser {
  id: number
  username: string
  password: string
  createdAt: string
}

export interface LocalTask {
  id: number
  title: string
  description?: string
  isCompleted: boolean
  category: string
  createdAt: string
  updatedAt?: string
  userId: number
}

export interface LocalDB {
  users: LocalUser[]
  tasks: LocalTask[]
}