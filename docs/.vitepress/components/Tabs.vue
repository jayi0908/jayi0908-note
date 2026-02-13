<template>
  <div class="tabs-container">
    <div class="tabs-nav">
      <button 
        v-for="(tab, index) in tabLabels" 
        :key="index"
        :class="{ active: activeIndex === index }"
        @click="activeIndex = index"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tabs-content">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        v-show="activeIndex === index"
      >
        <component :is="tab" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed } from 'vue'

const slots = useSlots()
const activeIndex = ref(0)

// 解析默认插槽中的所有子节点
const tabs = computed(() => {
  return slots.default ? slots.default() : []
})

// 从子节点的 props 中获取 label
const tabLabels = computed(() => {
  return tabs.value.map(vnode => vnode.props?.label || 'Tab')
})

const updateTab = () => {
  const hash = window.location.hash
  if (!hash) return
  const target = document.querySelector(decodeURIComponent(hash))
  
  // 找到目标元素属于第几个 Tab
  tabs.value.forEach((vnode, index) => {
    // 检查 DOM 树
    const panel = document.querySelector(`.tab-panel-${index}`)
    if (panel && panel.contains(target)) {
      activeIndex.value = index
    }
  })
}
</script>

<style scoped>
.tabs-container {
  margin: 1em 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
.tabs-nav {
  display: flex;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.tabs-nav button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}
.tabs-nav button:hover {
  color: var(--vp-c-text-1);
}
.tabs-nav button.active {
  color: var(--vp-c-brand);
  border-bottom-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
}
.tabs-content {
  padding: 16px;
}
/* 统一列表的左边距 */
.tabs-content :where(ul, ol) {
  padding-left: 1.5em; /* 统一一个足够大的宽度 */
  margin-left: 0;
}

/* 针对有序列表，确保序号不会挤压内容 */
.tabs-content ol {
  list-style-position: inside; /* 或者保持 outside 但调整 padding */
}

/* 让数字和圆点对齐 */
.tabs-content ul li::marker,
.tabs-content ol li::marker {
  color: var(--vp-c-brand);
}
</style>