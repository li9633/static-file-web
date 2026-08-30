<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'

library.add(faCircleQuestion)

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="nf-card">
      <div class="nf-icon">
        <font-awesome-icon icon="circle-question" />
      </div>
      <h1>404</h1>
      <p class="nf-desc">抱歉，您访问的页面不存在</p>
      <p class="nf-hint">请检查链接是否正确，或返回首页</p>
      <el-button type="primary" @click="router.push('/')"> 返回首页 </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
}

.nf-card {
  text-align: center;
  max-width: 420px;
  width: 100%;
}

.nf-icon {
  font-size: 56px;
  color: var(--text-faint);
  margin-bottom: 16px;
  opacity: 0.5;
}

h1 {
  margin: 0;
  font-size: 72px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -2px;
  line-height: 1;
}

.nf-desc {
  margin: 12px 0 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-dim);
}

.nf-hint {
  margin: 6px 0 20px;
  font-size: 13.5px;
  color: var(--text-faint);
}
</style>
