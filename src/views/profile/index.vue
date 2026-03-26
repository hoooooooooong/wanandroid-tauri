<template>
  <div class="profile-wrapper fade-in pb-12">
    <!-- 头部背景与用户信息 -->
    <div class="relative mb-8">
      <!-- 装饰背景 -->
      <div class="absolute inset-0 h-48 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl opacity-90"></div>
      <div class="absolute inset-0 h-48 overflow-hidden rounded-3xl">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative pt-24 px-6 pb-6">
        <div v-if="isLoggedIn" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-blue-900/5 flex flex-col items-center sm:flex-row sm:items-start gap-6 border border-slate-100 dark:border-slate-700/50">
          <!-- 头像区 -->
          <div class="relative -mt-16 sm:mt-0">
            <div 
              class="w-24 h-24 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl transform rotate-3"
              :style="{ background: getAvatarStyle(userInfo?.nickname || userInfo?.username || 'A').background }"
            >
              {{ (userInfo?.nickname || userInfo?.username || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white dark:border-slate-800 flex items-center justify-center text-white">
              <i class="fa-solid fa-check text-[10px]"></i>
            </div>
          </div>

          <!-- 文字信息 -->
          <div class="flex-1 text-center sm:text-left min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h2 class="text-2xl font-black text-slate-800 dark:text-white truncate">
                {{ userInfo?.nickname || userInfo?.username }}
              </h2>
              <div class="flex items-center justify-center gap-2">
                <span class="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Member
                </span>
                <span v-if="coinInfo?.level" class="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-wider border border-amber-100 dark:border-amber-900/30">
                  Lv.{{ coinInfo.level }}
                </span>
              </div>
            </div>
            <p class="text-sm text-slate-400 font-medium">探索 Android 世界的每一个角落</p>
            
            <!-- 统计数据 -->
            <div class="flex items-center justify-center sm:justify-start gap-8 mt-6">
              <div class="flex flex-col">
                <span class="text-lg font-black text-slate-800 dark:text-white">{{ coinInfo?.coinCount?.toLocaleString() || '0' }}</span>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">积分奖励</span>
              </div>
              <div class="w-[1px] h-8 bg-slate-100 dark:bg-slate-700"></div>
              <router-link to="/rank" class="flex flex-col group/rank">
                <span class="text-lg font-black text-blue-500 group-hover:scale-110 transition-transform origin-left">#{{ coinInfo?.rank || '0' }}</span>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  全站排名 <i class="fa-solid fa-chevron-right text-[8px] group-hover:translate-x-0.5 transition-transform"></i>
                </span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 未登录状态 -->
        <div v-else class="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-xl shadow-blue-900/5 flex flex-col items-center text-center border border-slate-100 dark:border-slate-700/50">
          <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-6">
            <i class="fa-solid fa-user-secret text-4xl text-slate-300"></i>
          </div>
          <h3 class="text-xl font-black text-slate-800 dark:text-white">加入 WanAndroid 社区</h3>
          <p class="text-sm text-slate-400 mt-2 max-w-xs">登录账号即可同步你的收藏、积分以及学习进度</p>
          <button
            @click="showLoginModal = true"
            class="mt-8 px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            立即登录 / 注册
          </button>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
      <!-- 我的收藏 -->
      <router-link 
        to="/collect" 
        class="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
          <i class="fa-solid fa-heart text-xl"></i>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">我的收藏</h4>
          <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">已收藏 {{ collectArticles.length }} 篇精华文章</p>
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
      </router-link>

      <!-- 文章打开方式设置 -->
      <div class="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
          <i class="fa-solid fa-window-restore text-xl"></i>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">应用内打开</h4>
          <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">使用内置浏览器浏览文章</p>
        </div>
        <button
          @click="toggleOpenInApp"
          type="button"
          :class="[
            'w-12 h-6 rounded-full transition-all duration-500 relative flex items-center px-1 outline-none',
            userStore.openInApp ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'bg-slate-200 dark:bg-slate-700'
          ]"
        >
          <div
            :class="[
              'w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-500 transform',
              userStore.openInApp ? 'translate-x-6' : 'translate-x-0'
            ]"
          ></div>
        </button>
      </div>
    </div>

    <!-- 登录注册模态框 -->
    <Transition name="modal">
      <div v-if="showLoginModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <!-- 装饰背景 -->
          <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <button @click="closeModal" class="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="text-center mb-8 pt-2">
            <h2 class="text-2xl font-black text-slate-800 dark:text-white">{{ isLoginMode ? '欢迎回来' : '开启新征程' }}</h2>
            <p class="text-xs text-slate-400 mt-2 font-bold uppercase tracking-[0.2em]">{{ isLoginMode ? 'Login to continue' : 'Register your account' }}</p>
          </div>

          <div class="space-y-5">
            <div class="relative group">
              <i class="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
              <input v-model="formData.username" type="text" placeholder="请输入用户名" class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm" />
            </div>
            
            <div class="relative group">
              <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
              <input v-model="formData.password" type="password" placeholder="请输入密码" class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm" />
            </div>

            <div v-if="!isLoginMode" class="relative group">
              <i class="fa-solid fa-shield absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
              <input v-model="formData.repassword" type="password" placeholder="请再次确认密码" class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm" />
            </div>
            
            <button @click="handleSubmit" :disabled="submitLoading" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 mt-2">
              {{ submitLoading ? '正在为您处理...' : (isLoginMode ? '确认登录' : '完成注册') }}
            </button>
            
            <div class="flex items-center justify-center pt-2">
              <span class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mr-2">OR</span>
              <p @click="toggleMode" class="text-[10px] font-black text-blue-500 cursor-pointer hover:underline uppercase tracking-widest">
                {{ isLoginMode ? '还没有账号？去注册' : '已有账号？去登录' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { getCollectArticles, getUserCoinInfo } from '@/api/user'
import type { CollectArticle } from '@/types/api'

const userStore = useUserStore()

const collectArticles = ref<CollectArticle[]>([])
const showLoginModal = ref(false)
const submitLoading = ref(false)
const isLoginMode = ref(true)
const formData = ref({
  username: '',
  password: '',
  repassword: ''
})

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const coinInfo = computed(() => userStore.coinInfo)

const closeModal = () => {
  showLoginModal.value = false
  formData.value = { username: '', password: '', repassword: '' }
  isLoginMode.value = true
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
}

const toggleOpenInApp = () => {
  userStore.openInApp = !userStore.openInApp
  localStorage.setItem('openInApp', String(userStore.openInApp))
}

const handleSubmit = async () => {
  if (isLoginMode.value) {
    await handleLogin()
  } else {
    await handleRegister()
  }
}

const handleLogin = async () => {
  if (!formData.value.username || !formData.value.password) {
    alert('请输入用户名和密码')
    return
  }
  submitLoading.value = true
  try {
    await userStore.loginAction({
      username: formData.value.username,
      password: formData.value.password
    })
    closeModal()
    initData()
  } catch (error: any) {
    alert('登录失败: ' + (error.message || '请检查用户名和密码'))
  } finally {
    submitLoading.value = false
  }
}

const handleRegister = async () => {
  if (!formData.value.username || !formData.value.password) {
    alert('请输入用户名和密码')
    return
  }
  if (formData.value.password !== formData.value.repassword) {
    alert('两次密码输入不一致')
    return
  }
  submitLoading.value = true
  try {
    await userStore.registerAction({
      username: formData.value.username,
      password: formData.value.password,
      repassword: formData.value.repassword
    })
    closeModal()
    initData()
  } catch (error: any) {
    alert('注册失败: ' + (error.message || '请重试'))
  } finally {
    submitLoading.value = false
  }
}

const fetchCollectArticles = async () => {
  if (!isLoggedIn.value) return
  try {
    const res = await getCollectArticles(0)
    collectArticles.value = res.data?.datas || []
  } catch (error) {
    console.error('Fetch articles error:', error)
  }
}

const fetchCoinInfo = async () => {
  if (!isLoggedIn.value) return
  try {
    const res = await getUserCoinInfo()
    if (res.errorCode === 0) {
      userStore.coinInfo = res.data
    }
  } catch (error) {
    console.error('Fetch coin error:', error)
  }
}

const initData = () => {
  fetchCollectArticles()
  fetchCoinInfo()
}

const avatarGradients = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
]

const getAvatarStyle = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return { background: avatarGradients[Math.abs(h) % avatarGradients.length] }
}

watch(isLoggedIn, (newVal) => {
  if (newVal) {
    initData()
  } else {
    collectArticles.value = []
  }
})

onMounted(() => {
  // 初始化配置
  const savedOpenInApp = localStorage.getItem('openInApp')
  if (savedOpenInApp !== null) {
    userStore.openInApp = savedOpenInApp === 'true'
  }

  if (isLoggedIn.value) {
    initData()
  }
})
</script>

<style scoped>
.profile-wrapper { animation: slideUp 0.5s ease-out; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }
</style>
