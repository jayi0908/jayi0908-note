<script setup>
import { ref } from 'vue'

const emit = defineEmits(['loaded'])

const showModal = ref(false)
const inputBvid = ref('')
const loading = ref(false)
const errorMsg = ref('')

const WORKER_URL = 'https://bili-audio-proxy.jayi0908.cn' 

const openModal = () => {
  showModal.value = true
  inputBvid.value = ''
  errorMsg.value = ''
}

const fetchBiliData = async () => {
  if (!inputBvid.value) return
  
  const bvid = inputBvid.value.trim()
  loading.value = true
  errorMsg.value = ''
  
  console.log(`[BiliImporter] 开始获取 B站视频: ${bvid}`)

  try {
    // 1. 调用专属代理的 info 接口获取基本信息（标题、封面、作者等）
    const apiUrl = `${WORKER_URL}/?bvid=${bvid}&action=info`
    
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`接口网络错误: ${res.status}`)
    
    const info = await res.json()
    console.log('[BiliImporter] 代理返回数据:', info)

    if (info.code !== 0) {
      throw new Error(info.message || '找不到该视频，请检查 BV 号是否正确')
    }

    // 2. 组装数据，完美对齐 MusicPlayer 和 MusicDownload 的需要
    const result = {
      id: bvid,
      title: info.data.title || '未知视频',
      artist: info.data.owner.name || '未知UP主',
      cover: info.data.pic,
      // 显式提供 audioUrl，让 MusicPlayer 的最高优先级逻辑接管
      audioUrl: `${WORKER_URL}/?bvid=${bvid}`,
      from: 'bilibili' 
    }

    console.log('[BiliImporter] 最终处理结果:', result)
    emit('loaded', result)
    showModal.value = false // 关闭弹窗

  } catch (e) {
    console.error('[BiliImporter] 错误:', e)
    errorMsg.value = '❌ ' + (e.message || '请求失败，请按 F12 查看控制台')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <span class="search-trigger">
    输入<span class="highlight" @click="openModal">BVID</span>导入该视频的音源.
  </span>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-content">
      <h3>导入 Bilibili 音源</h3>
      <p class="hint">请输入 B站视频 的 BV 号</p>
      
      <div class="input-group">
        <input 
          v-model="inputBvid" 
          type="text" 
          placeholder="例如: BV1GJ411x7h7" 
          @keyup.enter="fetchBiliData"
        >
        <button :disabled="loading" @click="fetchBiliData">
          {{ loading ? '解析中...' : '确定' }}
        </button>
      </div>
      
      <div v-if="errorMsg" class="error-box">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 替换为 B 站主题蓝色，其余保持与 SongImporter 一致 */
.highlight {
  color: #00a1d6;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px dashed #00a1d6;
  margin: 0 4px;
  transition: all 0.2s;
}
.highlight:hover {
  background-color: rgba(0, 161, 214, 0.1);
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
  border-color: #00a1d6;
}

button {
  padding: 8px 20px;
  background: #00a1d6;
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