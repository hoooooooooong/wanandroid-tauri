<template>
  <div class="hierarchy-container fade-in pb-12 px-2">
    <!-- 顶栏：标题与搜索 -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
      <div class="relative">
        <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-4">
          <span class="w-2 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
          知识体系
        </h2>
        <p class="text-slate-400 dark:text-slate-500 font-medium mt-2 ml-6">
          Systematic Learning Path for Developers
        </p>
      </div>

      <div class="relative group">
        <div class="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
        <div class="relative flex items-center">
          <i class="fa-solid fa-magnifying-glass absolute left-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索你感兴趣的知识领域..."
            class="w-full lg:w-96 pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none text-sm font-medium focus:ring-0 transition-all"
          />
        </div>
      </div>
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="h-48 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- 体系卡片列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div
        v-for="(category, index) in filteredCategories"
        :key="category.id"
        class="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
      >
        <!-- 背景巨大图标水印 -->
        <i
          :class="[getCategoryIcon(category.name), 'absolute -right-6 -top-6 text-[10rem] opacity-[0.03] dark:opacity-[0.02] transform -rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110']"
        ></i>

        <!-- 内容区域 -->
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                :style="{ background: getGradient(index) }"
              >
                <i :class="getCategoryIcon(category.name)"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                  {{ category.name }}
                </h3>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
                  Chapter {{ (index + 1).toString().padStart(2, '0') }}
                </p>
              </div>
            </div>
            
            <!-- 展开/收起切换 -->
            <button 
              v-if="category.children && category.children.length > 4"
              @click="toggleExpand(category.id)"
              class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all active:scale-90"
            >
              <i :class="['fa-solid transition-transform duration-300', isExpanded(category.id) ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </button>
          </div>

          <!-- 子分类标签流 -->
          <div 
            class="transition-all duration-500 ease-in-out overflow-hidden"
            :style="{ maxHeight: isExpanded(category.id) ? '500px' : '38px' }"
          >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="child in category.children"
                :key="child.id"
                class="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95 whitespace-nowrap"
                @click.stop="goToCategory(child.id, child.name)"
              >
                {{ child.name }}
              </button>
              
              <!-- 堆叠指示器（折叠时且数量多时显示） -->
              <div 
                v-if="!isExpanded(category.id) && category.children && category.children.length > 4"
                class="px-2 py-1.5 text-[10px] font-black text-slate-300 dark:text-slate-600 italic"
              >
                +{{ category.children.length - 3 }} more
              </div>
            </div>
          </div>
        </div>

        <!-- 装饰线条 -->
        <div
          class="absolute top-0 left-0 w-1.5 h-full transition-all duration-500"
          :style="{ background: getGradient(index) }"
        ></div>
      </div>
    </div>

    <!-- 无搜索结果 -->
    <div
      v-if="!loading && filteredCategories.length === 0"
      class="flex flex-col items-center justify-center py-40"
    >
      <div class="w-32 h-32 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 text-slate-200 dark:text-slate-700">
        <i class="fa-solid fa-box-open text-6xl"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-400">未能找到相关技术点</h3>
      <button @click="searchKeyword = ''" class="mt-6 text-blue-500 font-bold hover:underline">清除搜索条件</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTree } from '@/api/system'
import type { Chapter } from '@/types/api'

const categories = ref<Chapter[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const router = useRouter()

// 展开状态管理
const expandedIds = ref(new Set<number>())

const isExpanded = (id: number) => expandedIds.value.has(id)

const toggleExpand = (id: number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

// 过滤逻辑
const filteredCategories = computed(() => {
  if (!searchKeyword.value.trim()) return categories.value
  const kw = searchKeyword.value.toLowerCase()
  return categories.value.filter(c => 
    c.name.toLowerCase().includes(kw) || 
    c.children?.some(child => child.name.toLowerCase().includes(kw))
  )
})

// 高质感渐变
const gradients = [
  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #0EA5E9 0%, #2DD4BF 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
]

const getGradient = (i: number) => gradients[i % gradients.length]

// 图标映射
const getCategoryIcon = (name: string): string => {
  const map: Record<string, string> = {
    '前端': 'fa-solid fa-code',
    'Android': 'fa-brands fa-android',
    'iOS': 'fa-brands fa-apple',
    '后端': 'fa-solid fa-server',
    '架构': 'fa-solid fa-layer-group',
    '基础': 'fa-solid fa-compass',
    '面试': 'fa-solid fa-user-graduate',
    '工具': 'fa-solid fa-screwdriver-wrench',
    '资源': 'fa-solid fa-cloud-arrow-down',
    '性能': 'fa-solid fa-bolt',
  }
  for (const key in map) {
    if (name.includes(key)) return map[key]
  }
  return 'fa-solid fa-cubes'
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getTree()
    if (res.errorCode === 0) categories.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goToCategory = (cid: number, name: string) => {
  router.push({ path: '/category/' + cid, query: { name } })
}

onMounted(fetchData)
</script>

<style scoped>
.hierarchy-container {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar {
  display: none;
}
</style>
