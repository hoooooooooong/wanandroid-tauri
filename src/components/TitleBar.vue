<template>
  <div class="h-8 bg-white dark:bg-slate-900 flex items-center justify-end px-4 select-none" data-tauri-drag-region>
    <div class="flex gap-2">
      <button
        @click="minimize"
        class="w-3 h-3 rounded-full bg-[#28c940] flex items-center justify-center hover:brightness-110 transition-all"
        title="最小化"
      >
        <i class="fa-solid fa-minus text-[6px] text-transparent hover:text-black/30"></i>
      </button>
      
      <button
        @click="maximize"
        class="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center hover:brightness-110 transition-all"
        title="最大化"
      >
        <i v-if="!isMaximized" class="fa-solid fa-expand text-[6px] text-transparent hover:text-black/30"></i>
        <i v-else class="fa-solid fa-compress text-[6px] text-transparent hover:text-black/30"></i>
      </button>
      
      <button
        @click="close"
        class="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center hover:brightness-110 transition-all"
        title="关闭"
      >
        <i class="fa-solid fa-xmark text-[6px] text-transparent hover:text-black/30"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMaximized = ref(false)
let unlisten: (() => void) | null = null

const updateMaximized = async () => {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const win = getCurrentWindow()
    isMaximized.value = await win.isMaximized()
  } catch (error) {
    console.error('Failed to get maximized state:', error)
  }
}

onMounted(async () => {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const win = getCurrentWindow()
    
    // 初始化状态
    await updateMaximized()
    
    // 监听窗口大小改变事件
    unlisten = await win.onResized(async () => {
      await updateMaximized()
    })
  } catch (error) {
    console.error('Tauri window API error:', error)
  }
})

onUnmounted(() => {
  if (unlisten) {
    unlisten()
  }
})

const minimize = async () => {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const win = getCurrentWindow()
    await win.minimize()
  } catch (error) {
    console.error('Minimize failed:', error)
  }
}

const maximize = async () => {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const win = getCurrentWindow()
    await win.toggleMaximize()
    await updateMaximized()
  } catch (error) {
    console.error('Toggle maximize failed:', error)
  }
}

const close = async () => {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const win = getCurrentWindow()
    await win.close()
  } catch (error) {
    console.error('Close failed:', error)
  }
}
</script>
