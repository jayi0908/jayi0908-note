<script setup>
import { computed } from 'vue'

const props = defineProps({
  bvid: { type: String, required: true },
  page: { type: Number, default: 1 }
})

// 生成 B 站高质量 iframe 链接
const iframeUrl = computed(() => {
  return `//player.bilibili.com/player.html?bvid=${props.bvid}&page=${props.page}&high_quality=1&as_wide=1&allowfullscreen=true&autoplay=0`
})
</script>

<template>
  <div class="bili-player-container">
    <iframe 
      :src="iframeUrl" 
      scrolling="no" 
      border="0" 
      frameborder="no" 
      framespacing="0" 
      allowfullscreen="true">
    </iframe>
  </div>
</template>

<style scoped>
.bili-player-container {
  position: relative;
  width: 100%;
  /* 维持 16:9 比例 */
  padding-bottom: 56.25%; 
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.bili-player-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>