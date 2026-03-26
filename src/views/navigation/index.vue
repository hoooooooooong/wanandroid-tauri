<template>
  <div class="navi-container fade-in h-full flex flex-col pb-6">
    <!-- 顶栏：标题与搜索 -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
      <div>
        <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <i class="fa-solid fa-compass"></i>
          </div>
          导航
        </h2>
        <p class="text-sm text-slate-400 mt-2 ml-13">
          精选优质资源，助力开发者成长
        </p>
      </div>

      <div class="relative group">
        <div class="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
        <div class="relative flex items-center">
          <i class="fa-solid fa-magnifying-glass absolute left-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索网站名称或描述..."
            class="w-full lg:w-80 pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm text-sm font-medium focus:ring-0 transition-all"
          />
        </div>
      </div>
    </div>

    <!-- 主体布局：左侧分类 + 右侧内容 -->
    <div class="flex-1 flex gap-8 overflow-hidden min-h-0">
      <!-- 左侧分类选择器 -->
      <aside class="w-48 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 12" :key="i" class="h-11 bg-white dark:bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
        <template v-else>
          <button
            v-for="(category, index) in filteredCategories"
            :key="category.cid"
            @click="activeCategory = category"
            :class="[
              'group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300',
              activeCategory?.cid === category.cid
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-500'
            ]"
          >
            <div class="flex items-center gap-3">
              <i :class="[getCategoryIcon(category.name), 'text-xs', activeCategory?.cid === category.cid ? 'text-white' : 'text-slate-300 dark:text-slate-600 group-hover:text-indigo-400']"></i>
              <span class="truncate w-24 text-left">{{ category.name }}</span>
            </div>
            <span class="text-[10px] opacity-50">{{ category.articles?.length || 0 }}</span>
          </button>
        </template>
      </aside>

      <!-- 右侧内容区域 -->
      <main class="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          <div v-for="i in 9" :key="i" class="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        </div>

        <template v-else-if="activeCategory">
          <div class="flex items-center gap-4 mb-6">
            <div 
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg"
              :style="{ background: getGradient(activeCategoryIndex) }"
            >
              <i :class="getCategoryIcon(activeCategory.name)"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-800 dark:text-white">{{ activeCategory.name }}</h3>
              <p class="text-xs text-slate-400 mt-1">共收录 {{ filteredArticles.length }} 个优质站点</p>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            <div
              v-for="(article, idx) in filteredArticles"
              :key="article.id"
              class="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer"
              @click="openLink(article.link)"
            >
              <div class="flex items-start gap-4">
                <!-- 站点图标 -->
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg font-black shadow-inner transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  :style="{ background: getGradient(Math.abs(article.id) % 8) }"
                >
                  {{ article.title.charAt(0).toUpperCase() }}
                </div>
                
                <div class="flex-1 min-w-0 pr-6">
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-500 transition-colors">
                    {{ article.title }}
                  </h4>
                  <p class="text-xs text-slate-400 mt-1.5 truncate leading-relaxed">
                    {{ article.link.replace(/^https?:\/\/(www\.)?/, '') }}
                  </p>
                  
                  <!-- 悬浮出现的访问提示 -->
                  <div class="mt-3 flex items-center gap-1.5 text-indigo-500 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span class="text-[10px] font-black uppercase tracking-wider">访问站点</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                  </div>
                </div>
              </div>
              
              <!-- 右上角角标装饰 -->
              <div class="absolute top-4 right-4 text-slate-200 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fa-solid fa-link text-xs"></i>
              </div>
            </div>
          </div>

          <!-- 无搜索结果 -->
          <div v-if="filteredArticles.length === 0" class="flex flex-col items-center justify-center py-24 text-slate-300 dark:text-slate-700">
            <i class="fa-solid fa-magnifying-glass-chart text-5xl mb-4"></i>
            <p class="text-sm font-medium">当前分类下未找到匹配的站点</p>
          </div>
        </template>

        <!-- 未选择分类 -->
        <div v-else class="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700">
          <i class="fa-solid fa-hand-pointer text-5xl mb-4 animate-bounce"></i>
          <p class="text-sm font-medium">请从左侧选择一个导航分类</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNavi } from '@/api/navigation'
import type { Navi, Article } from '@/types/api'
import { openUrl } from '@/utils/url'

const categories = ref<Navi[]>([])
const loading = ref(true)
const searchKeyword = ref('')
const activeCategory = ref<Navi | null>(null)

// 过滤分类
const filteredCategories = computed(() => {
  if (!searchKeyword.value.trim()) return categories.value
  const kw = searchKeyword.value.toLowerCase()
  return categories.value.filter(category => {
    return category.name.toLowerCase().includes(kw) || 
           category.articles?.some(a => a.title.toLowerCase().includes(kw))
  })
})

// 过滤文章
const filteredArticles = computed(() => {
  if (!activeCategory.value) return []
  let articles = activeCategory.value.articles || []
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    articles = articles.filter(a => a.title.toLowerCase().includes(kw))
  }
  return articles
})

const activeCategoryIndex = computed(() => {
  if (!activeCategory.value) return 0
  return categories.value.findIndex(c => c.cid === activeCategory.value?.cid)
})

const gradients = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #f97316 0%, #facc15 100%)',
  'linear-gradient(135deg, #64748b 0%, #334155 100%)',
]

const getGradient = (index: number) => gradients[Math.abs(index) % gradients.length]

const getCategoryIcon = (name: string): string => {
  const iconMap: Record<string, string> = {
    '常用网站': 'fa-solid fa-globe',
    '个人博客': 'fa-solid fa-user-pen',
    '公司博客': 'fa-solid fa-building',
    '常用工具': 'fa-solid fa-tools',
    '开发社区': 'fa-solid fa-users',
    '在线学习': 'fa-solid fa-graduation-cap',
    '互联网资讯': 'fa-solid fa-newspaper',
    '官方信息': 'fa-solid fa-info-circle',
    '快速开发': 'fa-solid fa-rocket',
    '查看源码': 'fa-solid fa-code',
    '优秀': 'fa-solid fa-star',
  }
  for (const key in iconMap) {
    if (name.includes(key)) return iconMap[key]
  }
  return 'fa-solid fa-folder'
}

const openLink = (url: string, title?: string) => {
  openUrl(url, title)
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getNavi()
    if (res.errorCode === 0 && res.data) {
      categories.value = res.data
      if (res.data.length > 0) activeCategory.value = res.data[0]
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.navi-container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}
</style>
