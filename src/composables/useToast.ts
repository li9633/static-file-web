import { ref } from 'vue'

const message = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function show(msg: string, duration = 2000) {
    message.value = msg
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (message.value = ''), duration)
  }
  return { message, show }
}
