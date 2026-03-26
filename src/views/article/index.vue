<template>
  <div class="fade-in h-full flex flex-col bg-white dark:bg-slate-900">
    <div class="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-3 px-4 py-3">
        <button @click="$router.back()" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          <i class="fa-solid fa-arrow-left text-slate-600 dark:text-slate-300"></i>
        </button>
        <h1 class="flex-1 truncate text-sm font-medium text-slate-800 dark:text-white">
          {{ articleTitle }}
        </h1>
        <button
          @click="openInExternalBrowser"
          class="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
        >
          <i class="fa-solid fa-external-link-alt mr-1"></i>
          浏览器打开
        </button>
      </div>
    </div>

    <div v-if="!articleLink" class="flex-1 flex flex-col items-center justify-center px-8">
      <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <i class="fa-solid fa-exclamation-triangle text-3xl text-red-500"></i>
      </div>
      <h3 class="text-lg font-medium text-slate-800 dark:text-white mb-2">文章链接无效</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
        无法加载该文章，请检查链接是否正确
      </p>
      <button
        @click="$router.back()"
        class="px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium transition-colors"
      >
        返回上一页
      </button>
    </div>

    <div v-else class="flex-1 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-50">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
        <p class="text-sm text-slate-500 dark:text-slate-400">正在加载文章...</p>
      </div>
      
      <iframe
        ref="iframeRef"
        :src="articleLink"
        class="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        @load="onIframeLoad"
        @error="onIframeError"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { isTauriEnv, invoke } from '@/types/tauri'

const route = useRoute()
const iframeRef = ref<HTMLIFrameElement | null>(null)
const loading = ref(true)

const articleLink = computed(() => {
  return route.query.link as string || ''
})

const articleTitle = computed(() => {
  return (route.query.title as string) || '文章详情'
})

const onIframeLoad = () => {
  loading.value = false
}

const onIframeError = () => {
  loading.value = false
}

const openInExternalBrowser = async () => {
  if (articleLink.value) {
    if (isTauriEnv()) {
      await invoke('open_external', { url: articleLink.value })
    } else {
      window.open(articleLink.value, '_blank')
    }
  }
}

onMounted(() => {
  loading.value = true
})
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
