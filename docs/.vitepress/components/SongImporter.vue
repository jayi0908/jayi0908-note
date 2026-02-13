<script setup>
import { ref } from 'vue'

const emit = defineEmits(['loaded'])

const showModal = ref(false)
const inputId = ref('')
const loading = ref(false)
const errorMsg = ref('')

const openModal = () => {
  showModal.value = true
  inputId.value = ''
  errorMsg.value = ''
}

// 核心逻辑：使用 Meting API (专为静态博客设计)
const fetchSongData = async () => {
  if (!inputId.value) return
  
  // 去除可能误复制的空格
  const id = inputId.value.trim()
  
  loading.value = true
  errorMsg.value = ''
  
  console.log(`[SongImporter] 开始获取 ID: ${id}`)

  try {
    // ==========================================
    // 步骤 1: 请求 Meting API
    // server=netease (网易云)
    // type=song (单曲)
    // ==========================================
    const apiUrl = `https://api.i-meto.com/meting/api?server=netease&type=song&id=${id}&r=${Math.random()}`
    
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`接口网络错误: ${res.status}`)
    
    const data = await res.json()
    console.log('[SongImporter] API 返回数据:', data)

    // Meting 返回的是一个数组，如果没找到歌，数组为空
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('未找到该歌曲，请检查 ID 是否正确')
    }

    const song = data[0]

    // ==========================================
    // 步骤 2: 处理歌词
    // Meting 有时候返回歌词文本，有时候返回歌词链接
    // ==========================================
    let lyricText = '[无歌词]'
    
    if (song.lrc) {
      // 如果 lrc 字段是以 http 开头的链接，我们需要再去 fetch 一次内容
      if (song.lrc.startsWith('http')) {
        try {
          console.log('[SongImporter] 正在下载歌词文本...')
          const lrcRes = await fetch(song.lrc)
          lyricText = await lrcRes.text()
        } catch (lrcErr) {
          console.warn('歌词链接下载失败，使用默认文本', lrcErr)
          lyricText = '[歌词加载失败]'
        }
      } else {
        // 否则它就是歌词文本本身
        lyricText = song.lrc
      }
    }

    // ==========================================
    // 步骤 3: 成功，组装数据
    // ==========================================
    const result = {
      id: id,
      title: song.title || '未知歌曲',
      artist: song.author || '未知歌手',
      cover: song.pic || 'https://s4.music.126.net/style/web2/img/default/default_album.jpg',
      lyrics: lyricText
    }

    console.log('[SongImporter] 最终处理结果:', result)
    emit('loaded', result)
    showModal.value = false // 关闭弹窗

  } catch (e) {
    console.error('[SongImporter] 错误:', e)
    errorMsg.value = '❌ ' + (e.message || '请求失败，请按 F12 查看控制台')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <span class="search-trigger">
    动手<span class="highlight" @click="openModal">搜索</span>
  </span>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-content">
      <h3>导入网易云音乐</h3>
      <p class="hint">请输入数字 ID (推荐使用非 VIP 歌曲测试)</p>
      
      <div class="input-group">
        <input 
          v-model="inputId" 
          type="text" 
          placeholder="例如: 1311319929" 
          @keyup.enter="fetchSongData"
        >
        <button :disabled="loading" @click="fetchSongData">
          {{ loading ? '获取中...' : '确定' }}
        </button>
      </div>
      
      <div v-if="errorMsg" class="error-box">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight {
  color: #C20C0C;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px dashed #C20C0C;
  margin: 0 4px;
  transition: all 0.2s;
}
.highlight:hover {
  background-color: rgba(194, 12, 12, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #2d2d2d;
  color: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  border: 1px solid #444;
  text-align: center;
}

.hint {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #555;
  border-radius: 6px;
  background: #1e1e1e;
  color: #fff;
  outline: none;
}
input:focus {
  border-color: #C20C0C;
}

button {
  padding: 8px 20px;
  background: #C20C0C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.3);
  color: #ff4d4f;
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  text-align: left;
}
</style>