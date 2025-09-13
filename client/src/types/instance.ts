import { AxiosRequestConfig, AxiosResponse } from "axios"

export interface Instance {
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
}
