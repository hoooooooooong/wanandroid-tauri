<template>
  <div class="h-screen flex flex-col bg-gray-200 dark:bg-slate-800">
    <TitleBar v-if="showTitleBar" />

    <div class="flex flex-1 overflow-hidden">
      <Sidebar />

      <main class="flex-1 bg-slate-50 dark:bg-slate-800 p-8 overflow-y-auto">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.fullPath" />
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TitleBar from '@/components/TitleBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useThemeStore } from '@/stores/theme'
import { isTauriEnv } from '@/types/tauri'

const themeStore = useThemeStore()
const platform = ref<string>('')

const showTitleBar = computed(() => {
  if (!isTauriEnv()) return false
  return platform.value === 'windows' || platform.value === 'linux'
})

onMounted(async () => {
  console.log('App mounted, checking environment...')
  console.log('isTauriEnv:', isTauriEnv())
  console.log('window.__TAURI__:', (window as any).__TAURI__)
  
  if (isTauriEnv()) {
    try {
      const { fetch } = await import('@tauri-apps/plugin-http')
      console.log('Testing Tauri fetch to wanandroid...')
      const response = await fetch('https://www.wanandroid.com/banner/json')
      console.log('Test fetch status:', response.status)
      const data = await response.json()
      console.log('Test fetch data:', data)
    } catch (e) {
      console.error('Test fetch failed:', e)
    }
  }

  themeStore.initTheme()
  if (isTauriEnv()) {
    try {
      const { platform: getPlatform } = await import('@tauri-apps/plugin-os')
      platform.value = await getPlatform()
    } catch {
      platform.value = ''
    }
  }
})
</script>
