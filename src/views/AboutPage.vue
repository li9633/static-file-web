<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleInfo,
  faCode,
  faServer,
  faPalette,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCircleInfo, faCode, faServer, faPalette, faArrowLeft)
</script>

<template>
  <div class="about-page">
    <router-link to="/" class="back-link">
      <font-awesome-icon icon="arrow-left" />
      返回首页
    </router-link>

    <div class="about-card">
      <div class="about-icon">
        <font-awesome-icon icon="circle-info" />
      </div>
      <h1>关于本站</h1>
      <p class="about-desc">
        静态文件托管与分发站点，提供快速、稳定的文件下载服务。
      </p>
    </div>

    <div class="tech-grid">
      <div class="tech-item">
        <div class="tech-icon">
          <font-awesome-icon icon="server" />
        </div>
        <div class="tech-info">
          <h3>部署平台</h3>
          <p>Cloudflare Pages</p>
        </div>
      </div>
    </div>

    <div class="about-card">
      <h2>联系站长</h2>
      <p class="contact-text">
        <font-awesome-icon icon="envelope" />
        contact@xindev.com
      </p>
      <p class="host-text">
        <span class="host-text-inner">此网站托管于</span>
        <img
          class="cf-logo"
          src="/cloudflare-logo/svg/CF_logomark.svg"
          alt="Cloudflare"
        />
        <a href="https://pages.cloudflare.com" target="_blank" rel="noopener">
          Cloudflare Pages
        </a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 0 48px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-dim);
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.18s;

  &:hover {
    color: var(--primary);
  }
}

.about-card {
  text-align: center;
  padding: 32px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
}

.about-icon {
  font-size: 48px;
  color: var(--primary);
  margin-bottom: 12px;
  opacity: 0.8;
}

h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}

h2 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.about-desc {
  margin: 8px 0 0;
  font-size: 14.5px;
  color: var(--text-dim);
  line-height: 1.7;
}

.tech-grid {
  display: flex;
  margin-bottom: 16px;
}

.tech-item {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.tech-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  font-size: 20px;
  border-radius: 11px;
  background: var(--surface-2);
  color: var(--primary);
}

.tech-info {
  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  p {
    margin: 3px 0 0;
    font-size: 12px;
    color: var(--text-faint);
  }
}

.contact-text {
  font-size: 14px;
  color: var(--text-dim);

  :deep(svg) {
    width: 13px;
    height: 13px;
    margin-right: 4px;
    opacity: 0.6;
  }
}

.host-text {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  .host-text-inner {
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

@media (max-width: 480px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>
