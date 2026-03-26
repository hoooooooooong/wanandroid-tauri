<template>
  <div class="fade-in relative pb-10">
    <!-- Banner 轮播图 -->
    <div class="relative h-56 mb-8 rounded-3xl overflow-hidden shadow-2xl group">
      <div v-if="loading" class="w-full h-full bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
        <i class="fa-brands fa-android text-6xl text-slate-300 dark:text-slate-600"></i>
      </div>
      <template v-else-if="banners.length > 0">
        <TransitionGroup name="banner-fade">
          <div
            v-for="(banner, index) in banners"
            v-show="currentBanner === index"
            :key="banner.id"
            class="absolute inset-0 cursor-pointer"
            @click="openUrl(banner.url, banner.title)"
          >
            <img
              :src="banner.imagePath"
              :alt="banner.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
            <!-- 渐变遮罩和文字 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-2xl font-bold text-white mb-2 drop-shadow-md transform translate-y-0 transition-transform duration-500 group-hover:-translate-y-1">
                {{ banner.title }}
              </h2>
              <p class="text-white/80 text-sm line-clamp-1 max-w-2xl">
                发现 Android 开发的无限可能
              </p>
            </div>
          </div>
        </TransitionGroup>

        <!-- 轮播指示器 -->
        <div class="absolute bottom-6 right-8 flex gap-2 z-10">
          <button
            v-for="(_, index) in banners"
            :key="index"
            @click.stop="currentBanner = index"
            class="h-1.5 transition-all duration-300 rounded-full"
            :class="[
              currentBanner === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white'
            ]"
          ></button>
        </div>

        <!-- 切换按钮 -->
        <div class="absolute inset-y-0 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            @click.stop="prevBanner"
            class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button
            @click.stop="nextBanner"
            class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </template>
    </div>

    <!-- 常用网站快捷入口 -->
    <div class="mb-10">
      <div class="flex justify-between items-center mb-5 px-1">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
          常用网站
        </h2>
        <router-link to="/navigation" class="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 group">
          更多
          <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
        </router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-5 gap-4">
        <div
          v-for="i in 5"
          :key="i"
          class="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"
        ></div>
      </div>
      <div v-else class="grid grid-cols-5 gap-4">
        <div
          v-for="site in friends"
          :key="site.id"
          class="relative overflow-hidden group h-24 bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5"
          @click="openUrl(site.link, site.name)"
        >
          <!-- 背景装饰 -->
          <div
            class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-[0.05] transition-transform duration-500 group-hover:scale-150"
            :style="{ background: site.color }"
          ></div>

          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 group-hover:scale-110 shadow-inner"
            :style="{ backgroundColor: `${site.color}15`, color: site.color }"
          >
            <i :class="site.icon"></i>
          </div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ site.name }}</span>
        </div>
      </div>
    </div>

    <!-- 最新文章列表 -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-5 px-1">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          最新文章
        </h2>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Latest News
          </span>
        </div>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading && articles.length === 0" class="grid grid-cols-2 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 animate-pulse"
        >
          <div class="h-40 bg-slate-200 dark:bg-slate-700"></div>
          <div class="p-5 space-y-4">
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3"></div>
            </div>
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-else class="grid grid-cols-2 gap-6">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          @click="openUrl(article.link, article.title)"
          @collect="handleCollect"
        />
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="flex justify-center mt-12">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="group relative px-10 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 overflow-hidden active:scale-95"
        >
          <div class="relative z-10 flex items-center gap-3">
            <i :class="['fa-solid', loadingMore ? 'fa-spinner fa-spin' : 'fa-arrow-down']"></i>
            {{ loadingMore ? '正在为您加载...' : '发现更多精彩文章' }}
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <!-- 没有更多 -->
      <div v-else-if="articles.length > 0" class="flex flex-col items-center justify-center gap-4 mt-12 py-8 border-t border-slate-100 dark:border-slate-800">
        <div class="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xl">
          <i class="fa-solid fa-check"></i>
        </div>
        <p class="text-sm font-medium text-slate-400">您已经读完所有推荐文章了</p>
      </div>
    </div>

    <!-- 悬浮控制按钮 -->
    <Transition name="scroll-btn">
      <div
        v-if="showScrollButtons"
        class="fixed bottom-8 right-10 flex flex-col gap-3 z-50"
      >
        <button
          @click="scrollToTop"
          class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group"
          title="回到顶部"
        >
          <i class="fa-solid fa-chevron-up transition-transform group-hover:-translate-y-0.5"></i>
        </button>
        <button
          @click="scrollToBottom"
          class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:translate-y-1 transition-all duration-300 group"
          title="滚动到底部"
        >
          <i class="fa-solid fa-chevron-down transition-transform group-hover:translate-y-0.5"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { getBanners, getArticles } from '@/api/home'
import { collectArticle, uncollectArticle } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { checkIsLoggedIn } from '@/api/user'
import { openUrl } from '@/utils/url'

// 轮播图控制
const currentBanner = ref(0)
let timer: any = null

const startTimer = () => {
  stopTimer()
  timer = setInterval(() => {
    nextBanner()
  }, 5000)
}

const stopTimer = () => {
  if (timer) clearInterval(timer)
}

const nextBanner = () => {
  if (banners.value.length === 0) return
  currentBanner.value = (currentBanner.value + 1) % banners.value.length
}

const prevBanner = () => {
  if (banners.value.length === 0) return
  currentBanner.value = (currentBanner.value - 1 + banners.value.length) % banners.value.length
}

// 滚动相关
const showScrollButtons = ref(false)
const SCROLL_THRESHOLD = 300

const getScrollContainer = () => {
  return document.querySelector('main') as HTMLElement
}

const handleScroll = () => {
  const container = getScrollContainer()
  if (container) {
    showScrollButtons.value = container.scrollTop > SCROLL_THRESHOLD
  }
}

const scrollToTop = () => {
  const container = getScrollContainer()
  if (container) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToBottom = () => {
  const container = getScrollContainer()
  if (container) {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }
}

// 常用网站
const friends = ref([
  { id: 1, name: 'GitHub', link: 'https://github.com', icon: 'fa-brands fa-github', color: '#181717' },
  { id: 2, name: 'Google Dev', link: 'https://developers.google.com', icon: 'fa-brands fa-google', color: '#4285F4' },
  { id: 3, name: 'Gitee', link: 'https://gitee.com', icon: 'fa-solid fa-code-branch', color: '#C71D23' },
  { id: 4, name: '知乎', link: 'https://www.zhihu.com', icon: 'fa-solid fa-comments', color: '#0084FF' },
  { id: 5, name: 'CSDN', link: 'https://www.csdn.net', icon: 'fa-solid fa-file-code', color: '#FC5531' }
])

const banners = ref<any[]>([])
const articles = ref<any[]>([])
const page = ref(0)
const hasMore = ref(true)
const loading = ref(false)
const loadingMore = ref(false)

const userStore = useUserStore()

const fetchData = async () => {
  loading.value = true
  try {
    const isLoggedIn = checkIsLoggedIn()
    if (isLoggedIn && userStore.collectArticles.length === 0) {
      await userStore.getCollectArticlesAction(0)
    }
  } catch (error: any) {
    console.error('Failed to fetch collect articles:', error)
  }

  try {
    const [bannersRes, articlesRes] = await Promise.all([
      getBanners(),
      getArticles(page.value)
    ])
    banners.value = bannersRes.data || []
    if (articlesRes.data && articlesRes.data.datas) {
      articles.value = articlesRes.data.datas
      hasMore.value = !articlesRes.data.over
    }
    startTimer()
  } catch (error: any) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  page.value++
  try {
    const res = await getArticles(page.value)
    if (res.data && res.data.datas) {
      articles.value = [...articles.value, ...res.data.datas]
      hasMore.value = !res.data.over
    }
  } catch (error: any) {
    console.error('Failed to load more articles:', error)
    page.value--
  } finally {
    loadingMore.value = false
  }
}

const handleCollect = async (article: any) => {
  if (!checkIsLoggedIn()) {
    alert('请先登录')
    return
  }
  try {
    if (article.collect) {
      await uncollectArticle(article.id)
      article.collect = false
      const index = userStore.collectArticles.findIndex(a => a.id === article.id)
      if (index !== -1) userStore.collectArticles.splice(index, 1)
    } else {
      await collectArticle(article.id)
      article.collect = true
      const index = userStore.collectArticles.findIndex(a => a.id === article.id)
      if (index === -1) userStore.collectArticles.push(article)
    }
  } catch (error: any) {
    console.error('Failed to collect/uncollect article', error)
    alert('操作失败')
  }
}

onMounted(() => {
  fetchData()
  const container = getScrollContainer()
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  stopTimer()
  const container = getScrollContainer()
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
/* Banner 切换动画 */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.banner-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 滚动按钮动画 */
.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
