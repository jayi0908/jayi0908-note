import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Tabs from '../components/Tabs.vue'
import Admonition from '../components/Admonition.vue'
import MusicPlayer from '../components/MusicPlayer.vue' 
import SongImporter from '../components/SongImporter.vue'
import BiliPlayer from '../components/BiliPlayer.vue'
import BiliImporter from '../components/BiliImporter.vue'
import MusicDownload from '../components/MusicDownload.vue'
import { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Tabs', Tabs)
    app.component('Admonition', Admonition)
    app.component('MusicPlayer', MusicPlayer)
    app.component('SongImporter', SongImporter)
    app.component('BiliPlayer', BiliPlayer)
    app.component('BiliImporter', BiliImporter)
    app.component('MusicDownload', MusicDownload)
  }
} satisfies Theme