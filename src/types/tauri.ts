import { invoke as tauriInvoke } from '@tauri-apps/api/core'

export function isTauriEnv(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window
}

export async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauriEnv()) {
    throw new Error('Tauri API not available')
  }
  return tauriInvoke(cmd, args)
}

export interface TauriAPI {
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  isMaximized: () => Promise<boolean>
  openExternal: (url: string) => Promise<void>
  confirmQuit: () => Promise<boolean>
}

export function getTauriAPI(): TauriAPI | null {
  if (!isTauriEnv()) return null
  return {
    minimizeWindow: async () => {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().minimize()
    },
    maximizeWindow: async () => {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().toggleMaximize()
    },
    closeWindow: async () => {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().close()
    },
    isMaximized: async () => {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      return getCurrentWindow().isMaximized()
    },
    openExternal: async (url: string) => {
      await invoke('open_external', { url })
    },
    confirmQuit: async () => {
      return invoke<boolean>('confirm_quit')
    }
  }
}

declare global {
  interface Window {
    __TAURI__?: {
      core: {
        invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>
      }
    }
  }
}
