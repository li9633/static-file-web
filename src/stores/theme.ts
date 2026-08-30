import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function init() {
    const saved = localStorage.getItem('sfw-theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    isDark.value = saved === 'dark' || (!saved && prefersDark)
    apply()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('sfw-theme', isDark.value ? 'dark' : 'light')
    apply()
  }

  function apply() {
    const toggle = () =>
      document.documentElement.classList.toggle('dark', isDark.value)
    document.startViewTransition?.(toggle) ?? toggle()
  }

  return { isDark, init, toggle }
})
