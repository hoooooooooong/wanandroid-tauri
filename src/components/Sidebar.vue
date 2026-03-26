<template>
  <aside class="w-60 bg-white dark:bg-slate-900 flex flex-col p-5 border-r border-t border-gray-200 dark:border-slate-700">
    <div class="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-8 pl-2">
      <i class="fa-brands fa-android text-2xl text-[#3ddc84]"></i>
      <span>WanAndroid</span>
    </div>

    <nav class="flex-1 space-y-1">
      <router-link
        v-for="item in displayMenuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        :class="[
          $route.path === item.path
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
        ]"
      >
        <i :class="['fa-solid', item.icon, 'text-lg']"></i>
        <span>{{ item.title }}</span>
      </router-link>
    </nav>

    <div class="space-y-1">
      <button
        v-if="userStore.isLoggedIn"
        @click="logout"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        <i class="fa-solid fa-right-from-bracket text-lg"></i>
        <span>退出登录</span>
      </button>
      
      <div class="flex items-center gap-2 px-4 py-2">
        <button
          v-for="t in themes"
          :key="t.value"
          @click="setTheme(t.value)"
          :class="[
            'p-1.5 rounded transition-colors',
            currentTheme === t.value ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600'
          ]"
          :title="t.value === 'dark' ? '深色模式' : t.value === 'light' ? '浅色模式' : '跟随系统'"
        >
          <i :class="['fa-solid', t.icon]"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()

const menuItems = [
  { path: '/', title: '首页', icon: 'fa-house' },
  { path: '/hierarchy', title: '体系', icon: 'fa-sitemap' },
  { path: '/navigation', title: '导航', icon: 'fa-compass' },
  { path: '/projects', title: '项目', icon: 'fa-folder' },
  { path: '/wechat', title: '公众号', icon: 'fa-newspaper' },
  { path: '/square', title: '广场', icon: 'fa-grip' },
  { path: '/qa', title: '问答', icon: 'fa-circle-question' },
  { path: '/profile', title: '我的', icon: 'fa-user' }
]

const displayMenuItems = computed(() => {
  return menuItems.map(item => {
    if (item.path === '/profile' && userStore.isLoggedIn) {
      return {
        ...item,
        title: userStore.userInfo?.nickname || userStore.userInfo?.username || '个人中心'
      }
    }
    return item
  })
})

const themes = [
  { value: 'dark', icon: 'fa-moon' },
  { value: 'system', icon: 'fa-circle-half-stroke' },
  { value: 'light', icon: 'fa-sun' }
]

const currentTheme = computed(() => themeStore.theme)

const setTheme = (theme: string) => {
  themeStore.setTheme(theme)
}

const logout = async () => {
  try {
    await userStore.logoutAction()
    router.push('/profile')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
