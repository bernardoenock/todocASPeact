import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  TaskCreateDto,
  TaskUpdateDto,
  TaskReadDto,
  LocalDB,
  LocalUser,
  LocalTask
} from "@/types/api"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const DB_KEY = "mock_db"

function loadDB(): LocalDB {
  const raw = localStorage.getItem(DB_KEY)
  return raw ? JSON.parse(raw) : { users: [], tasks: [] }
}

function saveDB(db: LocalDB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function getAuthUserId(): number | null {
  const token = localStorage.getItem("auth_token")
  if (!token) return null
  const parts = token.split(":")
  return parts.length === 2 ? parseInt(parts[1]) : null
}

export const localInstance = {
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      await delay(200)
      const db = loadDB()
      const url = config.url || ""
      const method = (config.method || "get").toLowerCase()
      let data: any = null
      let status = 200

      // USERS
      if (url === "/api/users/register" && method === "post") {
        const { username, password } = config.data as RegisterDto
        if (db.users.some((u) => u.username === username)) {
          throw { response: { status: 400, data: { message: "Username already exists" } } }
        }
        const newUser: LocalUser = {
          id: db.users.length ? db.users[db.users.length - 1].id + 1 : 1,
          username,
          password,
          createdAt: new Date().toISOString(),
        }
        db.users.push(newUser)
        saveDB(db)
        data = { message: "User registered successfully" }
      }

      else if (url === "/api/users/login" && method === "post") {
        const { username, password } = config.data as LoginDto
        const user = db.users.find((u) => u.username === username && u.password === password)
        if (!user) {
          throw { response: { status: 401, data: { message: "Invalid credentials" } } }
        }
        const fakeToken = `fake-jwt-token:${user.id}`
        localStorage.setItem("auth_token", fakeToken)
        data = { token: fakeToken } as AuthResponse
      }

      // TASKS
      else if (url.startsWith("/api/tasks")) {
        const userId = getAuthUserId()
        if (!userId) {
          throw { response: { status: 401, data: { message: "Unauthorized" } } }
        }

        if (method === "get") {
          const parts = url.split("/")
          if (parts.length === 3) {
            // GET /api/tasks
            let tasks = db.tasks.filter((t) => t.userId === userId)
            if (config.params?.category) {
              tasks = tasks.filter(
                (t) => t.category.toLowerCase() === config.params.category.toLowerCase()
              )
            }
            if (config.params?.isCompleted !== undefined) {
              tasks = tasks.filter((t) => t.isCompleted === config.params.isCompleted)
            }
            data = tasks.map<TaskReadDto>((t) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              isCompleted: t.isCompleted,
              category: t.category,
              createdAt: t.createdAt,
              updatedAt: t.updatedAt,
            }))
          } else if (parts.length === 4) {
            // GET /api/tasks/:id
            const id = parseInt(parts[3])
            const task = db.tasks.find((t) => t.id === id && t.userId === userId)
            if (!task) {
              throw { response: { status: 404, data: { message: "Not Found" } } }
            }
            data = {
              id: task.id,
              title: task.title,
              description: task.description,
              isCompleted: task.isCompleted,
              category: task.category,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
            } as TaskReadDto
          }
        }

        else if (method === "post" && url === "/api/tasks") {
          const dto = config.data as TaskCreateDto
          const newTask: LocalTask = {
            id: db.tasks.length ? db.tasks[db.tasks.length - 1].id + 1 : 1,
            userId,
            title: dto.title,
            description: dto.description,
            isCompleted: dto.isCompleted,
            category: dto.category,
            createdAt: new Date().toISOString(),
          }
          db.tasks.push(newTask)
          saveDB(db)
          data = {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            isCompleted: newTask.isCompleted,
            category: newTask.category,
            createdAt: newTask.createdAt,
          } as TaskReadDto
          status = 201
        }

        else if (method === "put") {
          const id = parseInt(url.split("/")[3])
          const index = db.tasks.findIndex((t) => t.id === id && t.userId === userId)
          if (index === -1) {
            throw { response: { status: 404, data: { message: "Not Found" } } }
          }
          const dto = config.data as TaskUpdateDto
          db.tasks[index] = {
            ...db.tasks[index],
            ...dto,
            updatedAt: new Date().toISOString(),
          }
          saveDB(db)
          data = {
            id: db.tasks[index].id,
            title: db.tasks[index].title,
            description: db.tasks[index].description,
            isCompleted: db.tasks[index].isCompleted,
            category: db.tasks[index].category,
            createdAt: db.tasks[index].createdAt,
            updatedAt: db.tasks[index].updatedAt,
          } as TaskReadDto
        }

        else if (method === "delete") {
          const id = parseInt(url.split("/")[3])
          const index = db.tasks.findIndex((t) => t.id === id && t.userId === userId)
          if (index === -1) {
            throw { response: { status: 404, data: { message: "Not Found" } } }
          }
          db.tasks.splice(index, 1)
          saveDB(db)
          data = {}
          status = 204
        }
      }

      else {
        throw { response: { status: 400, data: { message: "Invalid route" } } }
      }

      return {
        data,
        status,
        statusText: "OK",
        headers: {},
        config: config as any,
      }
    } catch (error: any) {
      const axiosError: AxiosError = {
        ...error,
        isAxiosError: true,
        toJSON: () => ({ message: error.message }),
      }
      return Promise.reject(axiosError)
    }
  },

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "get", url })
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "post", url, data })
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "put", url, data })
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "delete", url })
  },
}
