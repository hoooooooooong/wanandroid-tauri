<template>
  <div
    class="article-card bg-white dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
    @click="$emit('click')"
  >
    <!-- 封面图 -->
    <div v-if="article.envelopePic" class="relative h-36 overflow-hidden">
      <img
        :src="article.envelopePic"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>

    <!-- 内容区 -->
    <div class="p-5">
      <!-- 顶部：分类和状态 -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span
            v-if="article.fresh"
            class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-md uppercase tracking-wider"
          >
            新
          </span>
          <span
            v-if="article.top"
            class="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-md uppercase tracking-wider"
          >
            置顶
          </span>
          <span
            class="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md uppercase tracking-wider"
          >
            {{ article.superChapterName || '未分类' }}
          </span>
        </div>
        <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500">{{ article.niceDate }}</span>
      </div>

      <!-- 标题 -->
      <h3
        class="text-base font-bold text-slate-800 dark:text-slate-100 leading-6 mb-4 line-clamp-2 group-hover:text-blue-500 transition-colors"
        v-html="article.title"
      ></h3>

      <!-- 标签展示 -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in article.tags"
          :key="tag.name"
          class="px-2 py-0.5 text-[10px] font-semibold bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-600/50 rounded-md"
        >
          #{{ tag.name }}
        </span>
      </div>

      <!-- 底部作者信息 -->
      <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50">
        <div class="flex items-center gap-2.5">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
            :style="getAvatarStyle(authorName)"
          >
            {{ authorName.charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">{{ authorName }}</span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500">{{ article.chapterName }}</span>
          </div>
        </div>

        <button
          @click.stop="handleCollect"
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
          :class="[
            article.collect
              ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-50'
          ]"
          :title="article.collect ? '取消收藏' : '收藏文章'"
        >
          <i
            :class="[
              'transition-transform duration-300',
              article.collect ? 'fa-solid fa-heart scale-110' : 'fa-regular fa-heart'
            ]"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '@/types/api'

const props = defineProps<{
  article: Article
}>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'collect', article: Article): void
}>()

const handleCollect = () => {
  emit('collect', props.article)
}

// 作者名称
const authorName = computed(() => props.article.author || props.article.shareUser || '匿名')

// 预定义的标签颜色
const tagColors = [
  { bg: '#dbeafe', text: '#1d4ed8' },   // 蓝色
  { bg: '#dcfce7', text: '#15803d' },   // 绿色
  { bg: '#fef3c7', text: '#b45309' },   // 黄色
  { bg: '#fce7f3', text: '#be185d' },   // 粉色
  { bg: '#e0e7ff', text: '#4338ca' },   // 靛蓝
  { bg: '#ccfbf1', text: '#0f766e' },   // 青色
  { bg: '#fae8ff', text: '#86198f' },   // 紫色
  { bg: '#fed7aa', text: '#c2410c' },   // 橙色
]

// 头像渐变色
const avatarGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
]

// 根据标签名生成颜色
const getTagStyle = (tagName: string) => {
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % tagColors.length
  const color = tagColors[colorIndex]
  return {
    backgroundColor: color.bg,
    color: color.text
  }
}

// 根据作者名生成头像样式
const getAvatarStyle = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const gradientIndex = Math.abs(hash) % avatarGradients.length
  return {
    background: avatarGradients[gradientIndex]
  }
}
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
