<template>
  <div class="qa-wrapper fade-in pb-12 px-2">
    <!-- 头部：标题与介绍 -->
    <div class="mb-10 px-1">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">问答</h2>
      </div>
      <p class="text-sm text-slate-400 ml-13 font-medium">技术难题解惑，在交流中共同进步</p>
    </div>

    <!-- 加载中/骨架屏 -->
    <div v-if="loading && articles.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
      <div v-for="i in 6" :key="i" class="h-44 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- 问答列表 -->
    <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
      <div
        v-for="article in articles"
        :key="article.id"
        class="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col"
        @click="openArticle(article)"
      >
        <!-- 侧边装饰条：长条圆角设计 -->
        <div class="absolute top-6 bottom-6 left-0 w-1 rounded-r-full bg-blue-500/10 group-hover:bg-blue-500 transition-all duration-500 group-hover:top-4 group-hover:bottom-4"></div>

        <div class="flex justify-between items-start mb-3 pl-3">
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-slate-800 dark:text-white leading-relaxed line-clamp-2 group-hover:text-blue-500 transition-colors" v-html="article.title"></h3>
          </div>
          <button @click.stop="handleCollect(article)" class="p-2 -mt-1 -mr-1 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 group/heart transition-all">
            <i :class="[article.collect ? 'fa-solid text-red-500' : 'fa-regular text-slate-300 group-hover/heart:text-red-400', 'fa-heart text-sm transition-transform group-active:scale-125']"></i>
          </button>
        </div>

        <!-- 简短描述 -->
        <p v-if="article.desc" class="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed pl-3 font-medium" v-html="stripHtml(article.desc)"></p>

        <!-- 底部元数据 -->
        <div class="mt-auto flex items-center justify-between pl-3">
          <div class="flex items-center gap-2.5">
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-blue-500/10"
              :style="getAvatarStyle(article.author || article.shareUser || 'Q')"
            >
              {{ (article.author || article.shareUser || 'Q').charAt(0).toUpperCase() }}
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">@{{ article.author || article.shareUser || '匿名' }}</span>
              <span class="text-[9px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest">{{ article.chapterName }}</span>
            </div>
          </div>
          <span class="text-[10px] font-medium text-slate-400">{{ article.niceDate }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-32">
      <div class="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-200">
        <i class="fa-solid fa-circle-nodes text-4xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-400 tracking-tight">暂时没有相关问答</h3>
    </div>

    <!-- 加载更多 -->
    <div v-if="articles.length > 0 && !isLastPage" class="flex justify-center mt-12">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="group relative px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50 overflow-hidden"
      >
        <span class="relative z-10 flex items-center gap-3">
          <i :class="['fa-solid', loadingMore ? 'fa-spinner fa-spin' : 'fa-lightbulb']"></i>
          {{ loadingMore ? '正在为您加载' : '查看更多解惑' }}
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
      </button>
    </div>

    <!-- 到底了 -->
    <div v-else-if="articles.length > 0" class="text-center py-12">
      <p class="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">End of Q&A</p>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { getQAList } from '@/api/qa'
import { collectArticle, uncollectArticle } from '@/api/user'
import type { Article } from '@/types/api'
import { openUrl } from '@/utils/url'
import { checkIsLoggedIn } from '@/api/user'

const articles = ref<Article[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const isLastPage = ref(false)

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

// HTML 处理
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
}

// 数据获取
async function fetchArticles(isLoadMore = false) {
  if (isLoadMore) loadingMore.value = true
  else {
    loading.value = true
    articles.value = []
    currentPage.value = 1
  }
  try {
    const res = await getQAList(currentPage.value)
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

const avatarGradients = [
  'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
]

const getAvatarStyle = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return { background: avatarGradients[Math.abs(h) % avatarGradients.length] }
}

onMounted(() => {
  fetchArticles()
  const c = getScrollContainer()
  if (c) c.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const c = getScrollContainer()
  if (c) c.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.qa-wrapper { animation: slideUp 0.5s ease-out; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
