<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Toolbar from '@/components/Toolbar.vue'
import FileList from '@/components/FileList.vue'
import { useFiles } from '@/composables/useFiles'
import { useThemeStore } from '@/stores/theme'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBoxArchive,
  faSun,
  faMoon,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBoxArchive, faSun, faMoon, faEnvelope)

const theme = useThemeStore()

const {
  files,
  meta,
  loading,
  error,
  keyword,
  selectedExt,
  selectedDir,
  sortKey,
  sortDir,
  exts,
  dirs,
  filtered,
  filteredSize,
  currentPage,
  pageSize,
  paged,
  totalPages,
  load,
  reset,
} = useFiles()

onMounted(() => {
  load()
})

const totalCount = computed(() => meta.value?.total ?? files.value.length)
const totalSize = computed(() => meta.value?.totalSize ?? '0 B')
const generatedAt = computed(() => {
  if (!meta.value) return ''
  return new Date(meta.value.generatedAt).toLocaleString('zh-CN', {
    hour12: false,
  })
})
</script>

<template>
  <header class="site-header">
    <div class="header-top">
      <div class="brand">
        <div class="brand-logo">
          <font-awesome-icon icon="box-archive" />
        </div>
        <div class="brand-info">
          <h1>文件下载站</h1>
          <p class="sub">静态托管 · 实时搜索 · 一键下载</p>
        </div>
      </div>

      <div class="header-right">
        <div class="stats">
          <div class="stat">
            <span class="stat-num">{{ totalCount }}</span>
            <span class="stat-label">文件</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-num">{{ totalSize }}</span>
            <span class="stat-label">总大小</span>
          </div>
        </div>
        <el-button
          circle
          class="theme-btn"
          :title="theme.isDark ? '切换到亮色' : '切换到暗色'"
          @click="theme.toggle"
        >
          <font-awesome-icon :icon="theme.isDark ? 'sun' : 'moon'" />
        </el-button>
      </div>
    </div>
  </header>

  <Toolbar
    v-model:keyword="keyword"
    v-model:selected-ext="selectedExt"
    v-model:selected-dir="selectedDir"
    v-model:sort-key="sortKey"
    v-model:sort-dir="sortDir"
    :exts="exts"
    :dirs="dirs"
    :result-count="filtered.length"
    :result-size="filteredSize"
    @reset="reset"
  />

  <main>
    <FileList
      :files="paged"
      :keyword="keyword"
      :loading="loading"
      :error="error"
    />

    <div v-if="totalPages > 1" class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filtered.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        small
      />
    </div>
  </main>

  <footer class="site-footer">
    <p>Static file download site — 静态文件托管与分发</p>
    <p class="footer-note">您正在访问根目录。如有需要，请联系站点管理员</p>
    <p class="footer-mail">
      <font-awesome-icon icon="envelope" /> contact@xindev.com
    </p>
    <p v-if="generatedAt" class="footer-time">索引生成于 {{ generatedAt }}</p>
    <p class="footer-host">
      <span class="footer-host-text">此网站托管于</span>
      <img
        class="cf-logo"
        src="/cloudflare-logo/svg/CF_logomark.svg"
        alt="Cloudflare"
      />
      <a href="https://pages.cloudflare.com" target="_blank" rel="noopener"
        >Cloudflare Pages</a
      >
    </p>
  </footer>
</template>

<style lang="scss" scoped>
.site-header {
  padding: 20px 0 0;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 22px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.brand-logo {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-size: 20px;

  :deep(svg) {
    width: 22px;
    height: 22px;
  }
}

.brand-info {
  min-width: 0;

  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.3px;
    line-height: 1.3;
    color: var(--text);
  }

  .sub {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--text-dim);
    white-space: nowrap;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.stats {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 6px 4px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 14px;
  line-height: 1.2;
}

.stat-num {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.stat-label {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 1px;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
  border-radius: 1px;
}

.theme-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  font-size: 18px;
  border-radius: 11px;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.08);
  }
}

.site-footer {
  margin-top: 32px;
  padding: 24px 0 32px;
  text-align: center;
  font-size: 13px;
  color: var(--text-faint);
  line-height: 1.8;

  p {
    margin: 0;
  }

  .footer-note {
    font-size: 12.5px;
    color: var(--text-faint);
  }

  .footer-mail {
    font-size: 13px;
    color: var(--text-dim);

    :deep(svg) {
      width: 13px;
      height: 13px;
      margin-right: 4px;
      opacity: 0.6;
    }
  }

  .footer-time {
    margin-top: 8px;
    font-size: 11.5px;
    color: var(--text-faint);
    opacity: 0.7;
  }

  .footer-host {
    margin-top: 6px;
    font-size: 12px;
    color: var(--text-faint);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .footer-host-text {
      opacity: 0.6;
    }

    .cf-logo {
      height: 1em;
      vertical-align: middle;
    }

    a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      opacity: 0.6;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 640px) {
  .header-top {
    padding: 14px 16px;
    gap: 12px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;

    :deep(svg) {
      width: 19px;
      height: 19px;
    }
  }

  .brand-info h1 {
    font-size: 16px;
  }

  .brand-info .sub {
    display: none;
  }

  .stats {
    padding: 4px 2px;
  }

  .stat {
    padding: 3px 10px;
  }

  .stat-num {
    font-size: 13px;
  }

  .stat-label {
    font-size: 10px;
  }

  .theme-btn {
    width: 36px;
    height: 36px;
  }
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
