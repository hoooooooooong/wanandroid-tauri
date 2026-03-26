import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { isTauriEnv } from '../types/tauri'

const getBaseUrl = () => {
  return (import.meta.env.DEV && !isTauriEnv()) ? '/api' : 'https://www.wanandroid.com'
}

async function tauriFetch<T>(method: string, url: string, data?: object): Promise<T> {
  try {
    const tauriHttp = await import('@tauri-apps/plugin-http')
    const path = url.startsWith('/') ? url : `/${url}`
    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${path}`
    console.log(`[TauriFetch] ${method} ${fullUrl}`, data)
    
    const headers: Record<string, string> = {
      'Accept': 'application/json, text/plain, */*'
    }

    if (method.toUpperCase() === 'POST') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    const cookie = localStorage.getItem('wanandroid_cookie') || ''
    if (cookie) {
      headers['Cookie'] = cookie
    }

    let body: BodyInit | undefined
    if (data) {
      if (method.toUpperCase() === 'POST') {
        if (data instanceof URLSearchParams) {
          body = data.toString()
        } else {
          body = new URLSearchParams(data as Record<string, string>).toString()
        }
      }
    }

    console.log(`[TauriFetch] Initiating fetch for: ${fullUrl}`)
    const response = await tauriHttp.fetch(fullUrl, {
      method: method.toUpperCase(),
      headers,
      body
    })

    console.log(`[TauriFetch] Response received: status=${response.status}, ok=${response.ok}`)

    if (!response.ok) {
      const text = await response.text()
      console.error(`[TauriFetch] HTTP error response:`, text)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 处理 Cookie
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      console.log('[TauriFetch] Found set-cookie header')
      localStorage.setItem('wanandroid_cookie', setCookie)
    }

    const result = await response.json()
    console.log(`[TauriFetch] JSON parsed successfully`)
    return result
  } catch (error) {
    console.error(`[TauriFetch] Fetch failed:`, error)
    throw error
  }
}

const service: AxiosInstance = axios.create({
  timeout: 10000
})

// 在拦截器中设置 baseURL 或动态设置
service.interceptors.request.use(
  async (config) => {
    config.baseURL = getBaseUrl()
    const cookie = localStorage.getItem('wanandroid_cookie') || ''
    if (cookie) {
      config.headers['Cookie'] = cookie
    }
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  async (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error)
)

export function get<T>(url: string, params?: object): Promise<T> {
  if (isTauriEnv()) {
    let fullUrl = url
    if (params) {
      const searchParams = new URLSearchParams(params as Record<string, string>)
      fullUrl = `${url}?${searchParams.toString()}`
    }
    return tauriFetch<T>('GET', fullUrl)
  }
  return service.get(url, { params })
}

export function post<T>(url: string, data?: object): Promise<T> {
  if (isTauriEnv()) {
    return tauriFetch<T>('POST', url, data)
  }
  return service.post(url, data)
}

export function getCookie(name: string): string | null {
  try {
    return localStorage.getItem(name)
  } catch {
    return null
  }
}

export function setCookie(name: string, value: string): void {
  try {
    localStorage.setItem(name, value)
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function clearUserCookie(): void {
  try {
    localStorage.removeItem('loginUserName')
    localStorage.removeItem('loginUserPassword')
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

export const getUserCookie = getCookie
export const setUserCookie = setCookie
