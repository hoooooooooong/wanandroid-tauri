<template>
  <div class="rank-wrapper fade-in pb-12 px-2">
    <!-- 头部：标题与介绍 -->
    <div class="flex items-center justify-between mb-10 px-1">
      <div class="flex items-center gap-4">
        <button 
          @click="$router.back()" 
          class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-95"
        >
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            积分排行榜
          </h2>
          <p class="text-sm text-slate-400 font-medium">见证技术大咖的荣耀时刻</p>
        </div>
      </div>
      
      <div class="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-xl uppercase tracking-widest border border-amber-100 dark:border-amber-900/30 flex items-center gap-2">
        <i class="fa-solid fa-trophy"></i>
        Leaderboard
      </div>
    </div>

    <div v-if="loading && rankList.length === 0" class="flex flex-col items-center justify-center py-32 space-y-4">
      <i class="fa-solid fa-crown fa-spin text-4xl text-blue-500/20"></i>
      <p class="text-sm text-slate-400 font-bold uppercase tracking-widest">Loading Glory...</p>
    </div>

    <template v-else>
      <!-- 荣耀领奖台 -->
      <div v-if="rankList.length >= 3" class="relative mb-12 px-4 pb-12 pt-20 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-xl shadow-blue-900/5">
        <!-- 礼花背景特效 -->
        <div class="confetti-container">
          <div v-for="i in 40" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
        </div>

        <div class="flex items-end justify-center gap-4 sm:gap-8 relative z-10">
          <!-- 第二名 -->
          <div class="flex flex-col items-center group">
            <div class="relative mb-4 transform transition-transform group-hover:scale-110 duration-500">
              <div 
                class="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-xl rotate-[-6deg]"
                :style="{ background: getAvatarStyle(rankList[1]?.nickname || rankList[1]?.username || '2').background }"
              >
                {{ (rankList[1]?.nickname || rankList[1]?.username || '2').charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -top-3 -right-2 w-8 h-8 bg-slate-300 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                <i class="fa-solid fa-medal text-slate-600 text-[10px]"></i>
              </div>
            </div>
            <p class="text-xs font-black text-slate-700 dark:text-slate-300 mb-3 max-w-[100px] truncate text-center">
              {{ rankList[1]?.nickname || rankList[1]?.username }}
            </p>
            <div class="w-20 h-24 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl flex flex-col items-center justify-center shadow-lg border-x border-t border-white/50 dark:border-slate-600/50">
              <span class="text-2xl font-black text-slate-400">2</span>
              <span class="text-[10px] font-black text-slate-500/60 mt-1 uppercase tracking-tighter">{{ rankList[1]?.coinCount?.toLocaleString() }}</span>
            </div>
          </div>

          <!-- 第一名 -->
          <div class="flex flex-col items-center group -mt-8">
            <div class="relative mb-6 transform transition-transform group-hover:scale-110 duration-500">
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                <i class="fa-solid fa-crown text-4xl text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"></i>
              </div>
              <div 
                class="w-24 h-24 rounded-[2.2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl transform rotate-3"
                :style="{ background: getAvatarStyle(rankList[0]?.nickname || rankList[0]?.username || '1').background }"
              >
                {{ (rankList[0]?.nickname || rankList[0]?.username || '1').charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-xl">
                <i class="fa-solid fa-star text-white text-xs"></i>
              </div>
            </div>
            <p class="text-sm font-black text-slate-800 dark:text-white mb-4 max-w-[120px] truncate text-center uppercase tracking-tight">
              {{ rankList[0]?.nickname || rankList[0]?.username }}
            </p>
            <div class="w-28 h-36 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-yellow-500/20 border-x border-t border-white/30">
              <span class="text-4xl font-black text-white drop-shadow-md">1</span>
              <span class="text-xs font-black text-white/80 mt-1 uppercase tracking-widest">{{ rankList[0]?.coinCount?.toLocaleString() }}</span>
            </div>
          </div>

          <!-- 第三名 -->
          <div class="flex flex-col items-center group">
            <div class="relative mb-4 transform transition-transform group-hover:scale-110 duration-500">
              <div 
                class="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-xl rotate-[6deg]"
                :style="{ background: getAvatarStyle(rankList[2]?.nickname || rankList[2]?.username || '3').background }"
              >
                {{ (rankList[2]?.nickname || rankList[2]?.username || '3').charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -top-3 -left-2 w-8 h-8 bg-amber-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                <i class="fa-solid fa-award text-white text-[10px]"></i>
              </div>
            </div>
            <p class="text-xs font-black text-slate-700 dark:text-slate-300 mb-3 max-w-[100px] truncate text-center">
              {{ rankList[2]?.nickname || rankList[2]?.username }}
            </p>
            <div class="w-20 h-16 bg-gradient-to-t from-amber-700/80 to-amber-600/80 dark:from-amber-900/80 dark:to-amber-800/80 rounded-t-2xl flex flex-col items-center justify-center shadow-lg border-x border-t border-white/20 dark:border-slate-600/50">
              <span class="text-2xl font-black text-amber-200">3</span>
              <span class="text-[10px] font-black text-amber-100/60 mt-1 uppercase tracking-tighter">{{ rankList[2]?.coinCount?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 排名列表 -->
      <div v-if="rankList.length > 3" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(user, index) in rankList.slice(3)"
          :key="user.userId"
          class="group bg-white dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-5 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500"
        >
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
              {{ index + 4 }}
            </div>
          </div>
          
          <div class="flex-1 min-w-0 flex items-center gap-4">
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-500/5"
              :style="{ background: getAvatarStyle(user.nickname || user.username).background }"
            >
              {{ (user.nickname || user.username).charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-slate-800 dark:text-white truncate">
                {{ user.nickname || user.username }}
              </p>
              <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded-md uppercase">
                Level {{ user.level }}
              </span>
            </div>
          </div>

          <div class="text-right shrink-0 flex flex-col items-end">
            <p class="text-base font-black text-slate-800 dark:text-white leading-none">
              {{ user.coinCount.toLocaleString() }}
            </p>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Points</span>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="flex justify-center mt-12">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="group relative px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
        >
          <span class="relative z-10 flex items-center gap-3">
            <i :class="['fa-solid', loadingMore ? 'fa-spinner fa-spin' : 'fa-bolt-lightning']"></i>
            {{ loadingMore ? '努力攀升中' : '探索更多大咖' }}
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCoinRank } from '@/api/user'
import type { CoinRankUser } from '@/types/api'

const loading = ref(true)
const loadingMore = ref(false)
const rankList = ref<CoinRankUser[]>([])
const currentPage = ref(1)
const hasMore = ref(true)

const confettiColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ee5a24']

const getAvatarStyle = (name: string) => {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return { background: gradients[Math.abs(h) % gradients.length] }
}

const getConfettiStyle = (i: number) => {
  const delay = Math.random() * 5
  const duration = Math.random() * 3 + 4
  const size = Math.random() * 8 + 6
  return {
    left: `${Math.random() * 90 + 5}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: confettiColors[i % confettiColors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: `rotate(${Math.random() * 360}deg)`
  }
}

const fetchRankList = async (page: number, isLoadMore = false) => {
  if (isLoadMore) loadingMore.value = true
  else { loading.value = true; rankList.value = [] }
  try {
    const res = await getCoinRank(page)
    if (res.errorCode === 0) {
      rankList.value = [...rankList.value, ...res.data.datas]
      hasMore.value = !res.data.over
      currentPage.value = page
    }
  } catch (error) { console.error(error) } 
  finally { loading.value = false; loadingMore.value = false }
}

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) fetchRankList(currentPage.value + 1, true)
}

onMounted(() => fetchRankList(1))
</script>

<style scoped>
.rank-wrapper { animation: slideUp 0.5s ease-out; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.confetti-container { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.confetti {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  opacity: 0;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
}
</style>
