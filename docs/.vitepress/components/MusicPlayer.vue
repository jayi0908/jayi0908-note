<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, default: '未知歌曲' },   // 歌名
  artist: { type: String, default: '未知歌手' },  // 歌手
  cover: { type: String, default: 'https://s4.music.126.net/style/web2/img/default/default_album.jpg' } // 封面
})

// --- 播放器状态 ---
const isPlaying = ref(false)
const audioRef = ref(null)
const duration = ref(0)       // 总时长(秒)
const currentTime = ref(0)    // 当前播放时间(秒)
const volume = ref(0.7)       // 音量 0-1

// 网易云直链地址
const musicUrl = computed(() => `https://music.163.com/song/media/outer/url?id=${props.id}.mp3`)

// 1. 播放/暂停
const togglePlay = () => {
  const audio = audioRef.value
  if (!audio) return
  
  if (isPlaying.value) {
    audio.pause()
  } else {
    audio.play()
  }
  isPlaying.value = !isPlaying.value
}

// 2. 更新进度条 (当音乐播放时不断触发)
const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

// 3. 获取歌曲总时长 (加载元数据完成后触发)
const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

// 4. 拖动进度条
const onSeek = (e) => {
  const time = parseFloat(e.target.value)
  currentTime.value = time
  if (audioRef.value) {
    audioRef.value.currentTime = time
  }
}

// 5. 调节音量
const onVolumeChange = (e) => {
  const val = parseFloat(e.target.value)
  volume.value = val
  if (audioRef.value) {
    audioRef.value.volume = val
  }
}

// 播放结束自动重置
const onEnded = () => {
  isPlaying.value = false
}

// 时间格式化工具 (把 125s 变成 02:05)
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// 初始化音量
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})
</script>

<template>
  <div class="custom-player-wrapper">
    <audio 
      ref="audioRef" 
      :src="musicUrl" 
      preload="metadata"
      @timeupdate="onTimeUpdate" 
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>

    <div class="progress-bar-container">
      <div class="progress-track" :style="{ width: (duration ? (currentTime / duration) * 100 : 0) + '%' }"></div>
      <input 
        type="range" 
        class="seek-slider" 
        min="0" 
        :max="duration" 
        step="0.1"
        :value="currentTime" 
        @input="onSeek"
      >
    </div>

    <div class="player-content">
      <div class="cover-box" :class="{ 'rotating': isPlaying }">
        <img :src="cover" alt="cover" />
        <div class="center-hole"></div>
      </div>

      <button class="play-btn" @click="togglePlay" title="Play/Pause">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>

      <div class="info-box">
        <div class="song-text">
          <span class="song-title">{{ title }}</span>
          <span class="song-artist"> - {{ artist }}</span>
        </div>
        <div class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>

      <div class="volume-box">
        <svg class="vol-icon" viewBox="0 0 24 24" fill="currentColor">
           <path v-if="volume > 0" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
           <path v-else d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
        <input 
          type="range" 
          class="volume-slider" 
          min="0" 
          max="1" 
          step="0.01" 
          :value="volume"
          @input="onVolumeChange"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-player-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: #2d2d2d;
  border-top: 1px solid #3a3a3a;
  z-index: 200;
  color: #fff;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding-bottom: env(safe-area-inset-bottom); /* 适配 iPhone 底部横条 */
}

/* 进度条容器 */
.progress-bar-container {
  position: absolute;
  top: -6px;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  cursor: pointer;
}

.progress-track {
  height: 100%;
  background: #C20C0C;
  pointer-events: none;
}

.seek-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  z-index: 10;
}

.player-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box; /* 确保 padding 不会撑大宽度 */
}

/* 封面 */
.cover-box {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
  position: relative;
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
  flex-shrink: 0;
  border: 1px solid #000;
}
.cover-box img { width: 100%; height: 100%; object-fit: cover; }

/* 播放按钮 */
.play-btn {
  background: #C20C0C;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.2s;
  flex-shrink: 0;
}
.play-btn svg { width: 18px; height: 18px; }

/* 信息区域 */
.info-box {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
  overflow: hidden; 
}
.song-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-title { color: #e8e8e8; font-size: 14px; font-weight: 500; }
.song-artist { color: #9b9b9b; font-size: 12px; margin-left: 5px;}
.time-display { color: #666; font-size: 11px; margin-top: 4px; font-family: monospace; }

/* 音量控制 */
.volume-box {
  display: flex;
  align-items: center;
  width: 100px;
  flex-shrink: 0;
}
.vol-icon { width: 18px; height: 18px; color: #888; margin-right: 8px; }
.volume-slider {
  flex-grow: 1;
  height: 4px;
  border-radius: 2px;
  background: #4a4a4a;
  appearance: none;
  cursor: pointer;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 2px rgba(0,0,0,0.5);
}

@media (max-width: 600px) {
  .player-content {
    padding: 0 12px; /* 减小左右边距 */
  }

  /* 1. 缩小元件尺寸以节省空间 */
  .cover-box {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  .play-btn {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  /* 2. 隐藏歌手，优先显示歌名和时间 */
  .song-artist {
    display: none; 
  }
  
  /* 3. 找回时间显示并调整布局 */
  .time-display {
    display: block;
    font-size: 10px;
    margin-top: 2px;
  }
  
  .song-title {
    font-size: 13px;
  }

  /* 4. 紧凑版音量条 */
  .volume-box {
    width: 70px; /* 缩短宽度防止溢出 */
    margin-right: 70px;
  }
  .vol-icon {
    margin-right: 4px;
  }
  
  /* 5. 调整布局逻辑：让信息区占满剩余空间 */
  .info-box {
    margin-right: 8px;
  }
}
</style>