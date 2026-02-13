<template>
  <details ref="el" class="custom-block" :class="[type]" :open="isOpen">
    <summary class="custom-block-title" @click.prevent="toggle">
      {{ title }}
    </summary>
    <div class="custom-block-body">
      <slot />
    </div>
  </details>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { inBrowser } from 'vitepress'

const props = defineProps({
  type: { default: 'note' },
  title: { String },
  collapsible: { type: Boolean, default: false }
})

const el = ref(null)
const isOpen = ref(!props.collapsible) // 非折叠默认打开

const toggle = () => {
  isOpen.value = !isOpen.value
}

const checkHash = () => {
  if (!inBrowser || !window.location.hash) return
  
  const hash = decodeURIComponent(window.location.hash)
  // 核心逻辑：如果锚点对应的元素在当前组件内部
  setTimeout(() => {
    const target = document.querySelector(hash)
    if (target && el.value && el.value.contains(target)) {
      isOpen.value = true
      // 这里的平滑滚动可以确保位置准确
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}

onMounted(() => {
  checkHash()
  window.addEventListener('hashchange', checkHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', checkHash)
})
</script>