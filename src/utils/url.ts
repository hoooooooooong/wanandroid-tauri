import { isTauriEnv, invoke } from '../types/tauri'

export function openUrl(url: string, title?: string, forceExternal = false) {
  if (forceExternal) {
    openExternal(url)
    return
  }
  
  const openInApp = window.localStorage.getItem('openInApp') === 'true'
  if (openInApp) {
    if (typeof window !== 'undefined' && (window as any).router) {
      (window as any).router.push({
        path: '/article',
        query: { link: url, title: title || '' }
      })
    }
  } else {
    openExternal(url)
  }
}

async function openExternal(url: string) {
  if (isTauriEnv()) {
    await invoke('open_external', { url })
  } else {
    window.open(url, '_blank')
  }
}

export function setRouter(router: any) {
  if (typeof window !== 'undefined') {
    (window as any).router = router
  }
}
