<script setup>
import { ref, computed, watch } from 'vue'
import { ID3Writer } from 'browser-id3-writer'

const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, default: '未知歌曲' },
  artist: { type: String, default: '未知歌手' },
  cover: { type: String, default: 'https://s4.music.126.net/style/web2/img/default/default_album.jpg' },
  audioUrl: { type: String, default: '' },
  from: { type: String, default: 'netease' } // 数据来源，决定 UI 渲染和下载逻辑
})

const WORKER_URL = 'https://bili-audio-proxy.jayi0908.cn' 
const CORS_PROXY_URL = 'https://music123-proxy.jayi0908.cn'

const customCoverUrl = ref(props.cover)
watch(() => props.cover, (newVal) => {
  customCoverUrl.value = newVal
})

const isDownloading = ref(false)
const downloadMsg = ref({ type: '', text: '' })

const musicUrl = computed(() => {
  if (props.audioUrl) return props.audioUrl
  if (props.from === 'bilibili') return `${WORKER_URL}/?bvid=${props.id}`
  return `https://music.163.com/song/media/outer/url?id=${props.id}.mp3`
})

const downloadSong = async () => {
  if (!props.id) return
  
  isDownloading.value = true
  downloadMsg.value = { type: '', text: '' }

  try {
    const targetAudioUrl = musicUrl.value
    let proxyAudioUrl = targetAudioUrl

    if (!targetAudioUrl.includes(WORKER_URL) && !targetAudioUrl.includes(CORS_PROXY_URL)) {
       proxyAudioUrl = `${CORS_PROXY_URL}/?url=${encodeURIComponent(targetAudioUrl)}`
    }
    
    // 1. 获取音频流
    const audioRes = await fetch(proxyAudioUrl)
    if (!audioRes.ok) throw new Error('无法获取音频流')
    const audioBuffer = await audioRes.arrayBuffer()

    if (audioBuffer.byteLength < 500 * 1024) {
      throw new Error('获取到的音频过小，可能被拦截')
    }

    // 2. 核心分流逻辑
    if (props.from === 'bilibili') {
      // --- B站：直接打包原始音频流为 .m4a 格式 ---
      const blob = new Blob([audioBuffer], { type: 'audio/mp4' })
      const downloadUrl = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${props.artist} - ${props.title}.m4a`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      downloadMsg.value = { type: 'success', text: '下载成功！(已保存为 .m4a)' }

    } else {
      // --- 网易云：标准的 MP3，进行封面缝合操作 ---
      const coverToUse = customCoverUrl.value || props.cover
      let proxyCoverUrl = coverToUse
      if (!coverToUse.includes(WORKER_URL) && !coverToUse.includes(CORS_PROXY_URL)) {
         proxyCoverUrl = `${CORS_PROXY_URL}/?url=${encodeURIComponent(coverToUse)}`
      }
      
      const coverRes = await fetch(proxyCoverUrl)
      if (!coverRes.ok) throw new Error('无法获取封面图片')
      const coverBuffer = await coverRes.arrayBuffer()

      const writer = new ID3Writer(audioBuffer)
      writer.setFrame('TIT2', props.title)
            .setFrame('TPE1', [props.artist])
            .setFrame('APIC', {
              type: 3,
              data: coverBuffer,
              description: 'Cover'
            })
      writer.addTag()

      const taggedBlob = new Blob([writer.arrayBuffer], { type: 'audio/mpeg' })
      const downloadUrl = URL.createObjectURL(taggedBlob)
      
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${props.artist} - ${props.title}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      downloadMsg.value = { type: 'success', text: '下载成功！(已缝合封面)' }
    }

  } catch (e) {
    console.error('[Download] 下载失败:', e)
    downloadMsg.value = { type: 'error', text: '❌ ' + (e.message || '下载失败') }
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div class="download-box">
    <h4>💾 下载音频</h4>
    
    <template v-if="from === 'bilibili'">
      <p class="desc">B站音源采用高质量流媒体格式，将直接提取为您保存为 <b>.m4a</b> 格式（因格式限制，无法内嵌封面）。</p>
      <div class="input-group">
        <button :disabled="isDownloading" @click="downloadSong" class="bili-btn">
          {{ isDownloading ? '提取中...' : '直接下载原质音频 (.m4a)' }}
        </button>
      </div>
    </template>

    <template v-else>
      <p class="desc">直接点击下载，或替换下方链接使用你喜欢的图片作为封面：</p>
      <div class="input-group">
        <input 
          v-model="customCoverUrl" 
          type="text" 
          placeholder="输入图片直链 (例如 https://...)"
        />
        <button :disabled="isDownloading" @click="downloadSong">
          {{ isDownloading ? '打包中...' : '合成并下载 (.mp3)' }}
        </button>
      </div>
    </template>
    
    <div v-if="downloadMsg.text" class="msg" :class="downloadMsg.type">
      {{ downloadMsg.text }}
    </div>
  </div>
</template>

<style scoped>
.download-box {
  margin-top: 20px;
  background: var(--vp-c-bg-soft);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
.download-box h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}
.download-box .desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}
.input-group {
  display: flex;
  gap: 10px;
}
.input-group input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  outline: none;
  font-size: 13px;
}
.input-group input:focus {
  border-color: #C20C0C;
}

/* 默认按钮样式（网易云红） */
.input-group button {
  padding: 8px 16px;
  background: #C20C0C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  white-space: nowrap;
  transition: opacity 0.2s, background-color 0.2s;
}

/* B站专属按钮样式（宽屏+B站蓝） */
.input-group button.bili-btn {
  width: 100%;
  background: #00a1d6;
  justify-content: center;
}
.input-group button.bili-btn:hover {
  background: #0093c4;
}

.input-group button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.msg {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
}
.msg.error { background: rgba(255, 77, 79, 0.1); color: #ff4d4f; }
.msg.success { background: rgba(82, 196, 26, 0.1); color: #52c41a; }
</style>