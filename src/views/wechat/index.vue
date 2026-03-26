<template>
  <div class="wechat-wrapper fade-in pb-12">
    <!-- 头部：标题与介绍 -->
    <div class="mb-10 px-1">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
          <i class="fa-solid fa-comments"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">公众号</h2>
      </div>
      <p class="text-sm text-slate-400 ml-13 font-medium">订阅大咖专栏，同步 Android 开发最新技术动态</p>
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
        <div v-if="wechatList.length === 0" class="flex gap-2">
          <div v-for="i in 8" :key="i" class="h-10 w-24 bg-white dark:bg-slate-700 rounded-2xl animate-pulse"></div>
        </div>
        <template v-else>
          <button
            v-for="item in wechatList"
            :key="item.id"
            @click="onTabClick(item.id)"
            :class="[
              'px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 border',
              activeId === item.id
                ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-300 hover:text-blue-500 shadow-sm'
            ]"
          >
            {{ item.name }}
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

    <!-- 骨架屏 -->
    <div v-if="loading && articles.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
      <div v-for="i in 6" :key="i" class="h-32 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
      <div
        v-for="article in articles"
        :key="article.id"
        class="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
        @click="openArticle(article)"
      >
        <!-- 侧边装饰条：长条圆角设计，更具韵律感 -->
        <div class="absolute top-6 bottom-6 left-0 w-1 rounded-r-full bg-blue-500/10 group-hover:bg-blue-500 transition-all duration-500 group-hover:top-4 group-hover:bottom-4"></div>

        <div class="flex justify-between items-start mb-4 pl-3">
          <h3 class="text-base font-bold text-slate-800 dark:text-white leading-relaxed line-clamp-2 group-hover:text-blue-500 transition-colors" v-html="article.title"></h3>
          <button @click.stop="handleCollect(article)" class="p-2 -mt-1 -mr-1 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 group/heart transition-all">
            <i :class="[article.collect ? 'fa-solid text-red-500' : 'fa-regular text-slate-300 group-hover/heart:text-red-400', 'fa-heart text-sm transition-transform group-active:scale-125']"></i>
          </button>
        </div>

        <div class="mt-auto flex items-center gap-3 pl-2">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
              {{ activeName }}
            </span>
          </div>
          <div class="flex-1"></div>
          <span class="text-[10px] font-medium text-slate-400">{{ article.niceDate }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-32">
      <div class="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-200">
        <i class="fa-solid fa-inbox text-4xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-400 tracking-tight">暂无相关文章</h3>
    </div>

    <!-- 加载更多 -->
    <div v-if="articles.length > 0 && !isLastPage" class="flex justify-center mt-12">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="group relative px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
      >
        <span class="relative z-10 flex items-center gap-3">
          <i :class="['fa-solid', loadingMore ? 'fa-spinner fa-spin' : 'fa-arrow-down-long']"></i>
          {{ loadingMore ? '正在为您加载' : '加载更多精选' }}
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
      </button>
    </div>

    <!-- 底部：到底了 -->
    <div v-else-if="articles.length > 0" class="text-center py-12">
      <p class="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">End of feed</p>
    </div>

    <!-- 悬浮回到顶部 -->
    <Transition name="fade">
      <button
        v-if="showScrollButtons"
        @click="scrollToTop"
        class="fixed bottom-8 right-10 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 z-50 shadow-blue-500/10"
      >
        <i class="fa-solid fa-chevron-up"></i>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getWechatList, getWechatArticles } from '@/api/wechat'
import { collectArticle, uncollectArticle } from '@/api/user'
import type { WxArticle, Article } from '@/types/api'
import { openUrl } from '@/utils/url'
import { checkIsLoggedIn } from '@/api/user'

const wechatList = ref<WxArticle[]>([])
const activeId = ref<number>(0)
const articles = ref<Article[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const isLastPage = ref(false)

const activeName = computed(() => {
  const item = wechatList.value.find(w => w.id === activeId.value)
  return item?.name || ''
})

// 滚动控制
const showScrollButtons = ref(false)
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

// 分类导航逻辑 (拖拽 + 按钮)
const scrollContainer = ref<HTMLElement | null>(null)
const showLeftBtn = ref(false)
const showRightBtn = ref(true)
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
  if (scrollContainer.value) scrollContainer.value.scrollBy({ left: offset, behavior: 'smooth' })
}

const startDragging = (e: MouseEvent) => {
  isDown = true
  hasMoved = false
  if (!scrollContainer.value) return
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeftPos = scrollContainer.value.scrollLeft
}

const stopDragging = () => { isDown = false }

const onDragging = (e: MouseEvent) => {
  if (!isDown || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 2
  if (Math.abs(walk) > 5) hasMoved = true
  scrollContainer.value.scrollLeft = scrollLeftPos - walk
}

const onTabClick = (id: number) => {
  if (hasMoved || id === activeId.value) return
  activeId.value = id
  fetchArticles()
}

// 数据获取
async function fetchWechatList() {
  try {
    const res = await getWechatList()
    if (res.errorCode === 0 && res.data.length > 0) {
      wechatList.value = res.data
      activeId.value = res.data[0].id
      fetchArticles()
      setTimeout(updateBtnState, 100)
    }
  } catch (error) { console.error(error) }
}

async function fetchArticles(isLoadMore = false) {
  if (!activeId.value) return
  if (isLoadMore) loadingMore.value = true
  else {
    loading.value = true
    articles.value = []
    currentPage.value = 1
  }
  try {
    const res = await getWechatArticles(activeId.value, currentPage.value)
    if (res.errorCode === 0) {
      if (isLoadMore) articles.value.push(...res.data.datas)
      else articles.value = res.data.datas
      isLastPage.value = res.data.over
    }
  } catch (error) { console.error(error) } 
  finally {
    loading.value = false
    loadingMore.value = false
  }
}

function loadMore() {
  currentPage.value++
  fetchArticles(true)
}

const handleCollect = async (article: Article) => {
  if (!checkIsLoggedIn()) {
    alert('请先登录')
    return
  }
  try {
    if (article.collect) {
      await uncollectArticle(article.id)
      article.collect = false
    } else {
      await collectArticle(article.id)
      article.collect = true
    }
  } catch (e) { alert('操作失败') }
}

const openArticle = (article: Article) => openUrl(article.link, article.title)

onMounted(() => {
  fetchWechatList()
  const c = getScrollContainer()
  if (c) c.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const c = getScrollContainer()
  if (c) c.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.wechat-wrapper { animation: slideUp 0.5s ease-out; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
