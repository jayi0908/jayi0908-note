---
title: 获取歌曲
---

<script setup>
import { ref } from 'vue'

// 用于存储爬取到的数据
const fetchedSong = ref(null)

// 当组件爬取成功时触发
const onSongLoaded = (data) => {
  fetchedSong.value = data
}
</script>

# 自行获取

通过"https://music.163.com/#/song?id=473403182"这样的链接可以访问网页端的网易云音乐，这里的参数就是标识歌曲的 ID，<SongImporter @loaded="onSongLoaded" />一下来获取自己想要的歌曲和歌词。

目前仅支持单曲的获取，以及公开歌单内的单曲获取，私密歌单和专辑内的歌曲暂不支持。

---

<div v-if="fetchedSong" class="result-area">
  <h3>🎉 获取成功！</h3>
  
  <MusicPlayer 
    :id="fetchedSong.id.toString()"
    :title="fetchedSong.title"
    :artist="fetchedSong.artist"
    :cover="fetchedSong.cover"
  />

  <div class="lyrics-box">
    <h4>歌词预览：</h4>
    <pre>{{ fetchedSong.lyrics }}</pre>
  </div>
</div>

<div v-else class="placeholder">
  (获取到的歌曲和歌词将显示在这里)
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