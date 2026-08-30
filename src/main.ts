import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import './styles/global.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// 挂载前初始化主题，避免刷新闪白
useThemeStore().init()

app.mount('#app')
