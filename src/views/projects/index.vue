<template>
  <div class="projects-wrapper fade-in pb-12">
    <!-- 头部：标题与介绍 -->
    <div class="mb-10 px-1">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
          <i class="fa-solid fa-folder-tree"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">项目分类</h2>
      </div>
      <p class="text-sm text-slate-400 ml-13 font-medium">发现优质开源项目，探索 Android 开发新高度</p>
    </div>

    <!-- 分类标签：支持拖拽 + 左右按钮 -->
    <div class="mb-8 sticky top-0 z-20 -mx-2 px-2 py-2 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md group/nav">
      <!-- 左切换按钮 -->
      <button 
        v-if="showLeftBtn"
        @click="scrollBy(-200)"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 z-30 opacity-0 group-hover/nav:opacity-100 transition-all hover:bg-blue-500 hover:text-white"
      >
        <i class="fa-solid fa-chevron-left text-[10px]"></i>
      </button>

      <!-- 滚动容器 -->
      <div 
        ref="scrollContainer"
        class="flex gap-2 overflow-x-auto no-scrollbar pb-1 cursor-grab active:cursor-grabbing select-none scroll-smooth"
        @mousedown="startDragging"
        @mousemove="onDragging"
        @mouseup="stopDragging"
        @mouseleave="stopDragging"
        @scroll="updateBtnState"
      >
        <div v-if="loadingCategories" class="flex gap-2">
          <div v-for="i in 8" :key="i" class="h-10 w-24 bg-white dark:bg-slate-700 rounded-2xl animate-pulse"></div>
        </div>
        <template v-else>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="onCategoryClick(category)"
            :class="[
              'px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 border',
              currentCategoryId === category.id
                ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-300 hover:text-blue-500 shadow-sm'
            ]"
          >
            {{ category.name }}
          </button>
        </template>
      </div>

      <!-- 右切换按钮 -->
      <button 
        v-if="showRightBtn"
        @click="scrollBy(200)"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 z-30 opacity-0 group-hover/nav:opacity-100 transition-all hover:bg-blue-500 hover:text-white"
      >
        <i class="fa-solid fa-chevron-right text-[10px]"></i>
      </button>
    </div>

    <!-- 当前分类标题 -->
    <div class="flex items-center justify-between mb-6 px-1">
      <h3 class="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
        <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
        {{ currentCategoryName }}
      </h3>
      <span class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {{ projects.length }} Items
      </span>
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading && projects.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="h-80 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- 项目卡片网格 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col"
        @click="openProject(project)"
      >
        <!-- 封面图 -->
        <div class="relative h-44 overflow-hidden">
          <img
            v-if="project.envelopePic"
            :src="project.envelopePic"
            :alt="project.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <i class="fa-solid fa-code text-5xl text-white/20"></i>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          
          <div class="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-[10px] font-bold">
            <i class="fa-regular fa-clock"></i>
            {{ project.niceDate }}
          </div>
        </div>

        <!-- 内容区 -->
        <div class="p-5 flex-1 flex flex-col">
          <h4 class="text-base font-bold text-slate-800 dark:text-white leading-snug mb-3 line-clamp-1 group-hover:text-blue-500 transition-colors" v-html="project.title"></h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 leading-relaxed font-medium">
            {{ project.desc || '发现这个精选项目的独特之处...' }}
          </p>

          <!-- 底部信息 -->
          <div class="mt-auto flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-md" :style="getAvatarStyle(project.author || '佚名')">
                {{ (project.author || '佚名').charAt(0).toUpperCase() }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ project.author || '佚名' }}</span>
                <span class="text-[9px] text-slate-400 uppercase tracking-tighter">{{ project.chapterName }}</span>
              </div>
            </div>
            <button class="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 group-hover:bg-blue-500 group-hover:text-white group-hover:rotate-45 transition-all duration-500 flex items-center justify-center shadow-sm">
              <i class="fa-solid fa-plus text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && projects.length > 0" class="flex justify-center mt-12">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="group relative px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
      >
        <span class="relative z-10 flex items-center gap-3">
          <i :class="['fa-solid', loadingMore ? 'fa-spinner fa-spin' : 'fa-arrow-down-long']"></i>
          {{ loadingMore ? '正在加载' : '加载更多项目' }}
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
      </button>
    </div>

    <!-- 悬浮回到顶部 -->
    <Transition name="fade">
      <button
        v-if="showScrollButtons"
        @click="scrollToTop"
        class="fixed bottom-8 right-10 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 z-50"
      >
        <i class="fa-solid fa-chevron-up"></i>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getProjectTree, getProjects } from '@/api/project'
import type { ProjectCategory, Project } from '@/types/api'
import { openUrl } from '@/utils/url'

const loading = ref(true)
const loadingCategories = ref(true)
const loadingMore = ref(false)
const categories = ref<ProjectCategory[]>([])
const projects = ref<Project[]>([])
const currentCategoryId = ref<number>(0)
const currentCategoryName = ref<string>('精选列表')
const page = ref(0)
const hasMore = ref(false)
const showScrollButtons = ref(false)

// 按钮显示状态
const showLeftBtn = ref(false)
const showRightBtn = ref(true)

// 拖拽与滚动逻辑
const scrollContainer = ref<HTMLElement | null>(null)
let isDown = false
let startX = 0
let scrollLeftPos = 0
let hasMoved = false

const updateBtnState = () => {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  showLeftBtn.value = scrollLeft > 10
  showRightBtn.value = scrollLeft < (scrollWidth - clientWidth - 10)
}

const scrollBy = (offset: number) => {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollBy({ left: offset, behavior: 'smooth' })
}

const startDragging = (e: MouseEvent) => {
  isDown = true
  hasMoved = false
  if (!scrollContainer.value) return
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeftPos = scrollContainer.value.scrollLeft
}

const stopDragging = () => {
  isDown = false
}

const onDragging = (e: MouseEvent) => {
  if (!isDown || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 2
  if (Math.abs(walk) > 5) hasMoved = true
  scrollContainer.value.scrollLeft = scrollLeftPos - walk
}

const onCategoryClick = (category: ProjectCategory) => {
  if (hasMoved) return
  selectCategory(category.id)
}

const selectCategory = (id: number) => {
  if (id === currentCategoryId.value) return
  currentCategoryId.value = id
  const cat = categories.value.find(c => c.id === id)
  if (cat) currentCategoryName.value = cat.name
  page.value = 0
  loading.value = true
  loadProjects(0)
}

const SCROLL_THRESHOLD = 300
const getScrollContainer = () => document.querySelector('main') as HTMLElement

const handleScroll = () => {
  const container = getScrollContainer()
  if (container) showScrollButtons.value = container.scrollTop > SCROLL_THRESHOLD
}

const scrollToTop = () => {
  const container = getScrollContainer()
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' })
}

const fetchData = async () => {
  loadingCategories.value = true
  try {
    const res = await getProjectTree()
    if (res.data && res.data.length > 0) {
      categories.value = res.data
      currentCategoryId.value = res.data[0].id
      currentCategoryName.value = res.data[0].name
      await loadProjects(0)
      setTimeout(updateBtnState, 100)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingCategories.value = false
  }
}

const loadProjects = async (pageNum: number) => {
  try {
    const res = await getProjects(pageNum, currentCategoryId.value)
    if (res.data && res.data.datas) {
      if (pageNum === 0) projects.value = res.data.datas
      else projects.value = [...projects.value, ...res.data.datas]
      hasMore.value = !res.data.over
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  page.value++
  try { await loadProjects(page.value) } 
  catch (e) { page.value-- } 
  finally { loadingMore.value = false }
}

const openProject = (p: Project) => openUrl(p.link, p.title)

const avatarGradients = ['linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)']
const getAvatarStyle = (n: string) => {
  let h = 0
  for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h)
  return { background: avatarGradients[Math.abs(h) % avatarGradients.length] }
}

onMounted(() => {
  fetchData()
  const c = getScrollContainer()
  if (c) c.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const c = getScrollContainer()
  if (c) c.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.projects-wrapper {
  animation: slideUp 0.5s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
