import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// 主题初始化：避免刷新时闪白
const saved = localStorage.getItem('sfw-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (saved === 'dark' || (!saved && prefersDark)) {
  document.documentElement.classList.add('dark')
}

const app = createApp(App)
app.use(router)
app.mount('#app')
