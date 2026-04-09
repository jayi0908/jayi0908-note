---
title: 获取B站音源
---

<script setup>
import { ref } from 'vue'

const fetchedAudio = ref(null)

const onAudioLoaded = (data) => {
  fetchedAudio.value = data
}
</script>

# Bilibili 纯音频获取

通过"https://bilibili.com/video/BV1GJ411x7h7"这样的链接可以访问网页端的B站视频，这里的参数就是标识视频的 BVID

<BiliImporter @loaded="onAudioLoaded" />目前只支持视频音源的导入，番剧、专栏等其他类型的 BV 暂不支持.

---

<div v-if="fetchedAudio" class="result-area">
  <h3>🎉 解析成功！</h3>
  
  <MusicPlayer 
    v-if="fetchedAudio"
    :id="fetchedAudio.id"
    :title="fetchedAudio.title"
    :artist="fetchedAudio.artist"
    :cover="fetchedAudio.cover"
    :audioUrl="fetchedAudio.audioUrl" 
    :from="fetchedAudio.from"
  />
  
  <MusicDownload 
    v-if="fetchedAudio"
    :id="fetchedAudio.id"
    :title="fetchedAudio.title"
    :artist="fetchedAudio.artist"
    :cover="fetchedAudio.cover"
    :audioUrl="fetchedAudio.audioUrl"
    :from="fetchedAudio.from" 
  />

</div>

<div v-else class="placeholder">
  (解析到的 B 站音频将显示在这里)
</div>

<style>
.result-area {
  margin-top: 30px;
  animation: fadeIn 0.5s;
}
.lyrics-box {
  margin-top: 20px;
  background: var(--vp-c-bg-alt);
  padding: 15px;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
}
.lyrics-box pre {
  white-space: pre-wrap;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.placeholder {
  margin-top: 30px;
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-3);
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>