<template>
  <aside class="w-64 bg-white dark:bg-slate-900 flex flex-col p-6 border-r border-slate-100 dark:border-slate-800 relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
    <!-- Logo 区域 -->
    <div class="flex items-center gap-3 mb-10 pl-2 group cursor-default">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
        <i class="fa-brands fa-android text-xl text-white"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-black text-slate-800 dark:text-white tracking-tighter leading-none">WanAndroid</span>
        <span class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1 opacity-80">Desktop</span>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pr-1">
      <router-link
        v-for="item in displayMenuItems"
        :key="item.path"
        :to="item.path"
        class="group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden"
        :class="[
          $route.path === item.path
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-500'
        ]"
      >
        <!-- 激活态背景光晕 -->
        <div v-if="$route.path === item.path" class="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full blur-xl"></div>
        
        <i :class="['fa-solid', item.icon, 'text-lg transition-transform duration-500 group-hover:scale-110', $route.path === item.path ? 'text-white' : 'text-slate-300 dark:text-slate-600 group-hover:text-blue-400']"></i>
        <span class="relative z-10">{{ item.title }}</span>

        <!-- 右侧小箭头 (激活态) -->
        <i v-if="$route.path === item.path" class="fa-solid fa-chevron-right ml-auto text-[10px] opacity-50"></i>
      </router-link>
    </nav>

    <!-- 底部区域 -->
    <div class="mt-8 space-y-6">
      <!-- 退出登录按钮 -->
      <button
        v-if="userStore.isLoggedIn"
        @click="logout"
        class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold w-full text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-all duration-300 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
      >
        <div class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
          <i class="fa-solid fa-right-from-bracket text-base"></i>
        </div>
        <span>退出登录</span>
      </button>
      
      <!-- 主题切换器：分段选择器风格 -->
      <div class="bg-slate-50 dark:bg-slate-800/50 p-1 rounded-2xl flex items-center relative">
        <!-- 激活滑块 -->
        <div 
          class="absolute h-8 bg-white dark:bg-slate-700 rounded-xl shadow-sm transition-all duration-300 ease-out z-0"
          :style="{ 
            width: '33.33%',
            left: currentTheme === 'light' ? '4px' : currentTheme === 'system' ? '33.33%' : '66.66%',
            transform: `translateX(${currentTheme === 'light' ? '0' : currentTheme === 'system' ? '0' : '-4px'})`
          }"
        ></div>

        <button
          v-for="t in themes"
          :key="t.value"
          @click="setTheme(t.value, $event)"
          :class="[
            'flex-1 py-2 rounded-xl text-sm transition-all duration-300 relative z-10',
            currentTheme === t.value ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
          ]"
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
  { value: 'light', icon: 'fa-sun' },
  { value: 'system', icon: 'fa-circle-half-stroke' },
  { value: 'dark', icon: 'fa-moon' }
]

const currentTheme = computed(() => themeStore.theme)

const setTheme = async (theme: string, event?: MouseEvent) => {
  // @ts-ignore
  if (!document.startViewTransition) {
    themeStore.setTheme(theme);
    return;
  }

  // 1. 获取点击位置
  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // 2. 预先获取当前是否为深色，以决定切换方向
  const isCurrentlyDark = document.documentElement.classList.contains('dark');
  
  // 3. 开始过渡之前添加禁用过渡的 class
  document.documentElement.classList.add('switching-theme');

  // 4. 开始过渡
  // @ts-ignore
  const transition = document.startViewTransition(() => {
    themeStore.setTheme(theme);
  });

  // 5. 核心动画逻辑
  transition.ready.then(() => {
    // 目标状态判断
    const isTargetDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const goingToDark = !isCurrentlyDark && isTargetDark;
    const goingToLight = isCurrentlyDark && !isTargetDark;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];

    if (goingToDark || goingToLight) {
      document.documentElement.animate(
        {
          clipPath: goingToDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: goingToDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
          fill: 'forwards'
        }
      );
    }
  });

  // 6. 过渡完成后移除 class
  transition.finished.finally(() => {
    document.documentElement.classList.remove('switching-theme');
  });
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
