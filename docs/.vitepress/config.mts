import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'
import container from 'markdown-it-container'
import markdownItAttrs from 'markdown-it-attrs'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

// 定义标题映射表的类型
const titles: Record<string, string> = {
  proof: 'Proof',
  thm: 'Theorem',
  music: 'Music',
  note: 'Note',
  tip: 'Tip',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
  example: 'Example'
}

export default defineConfig({
  title: "jayi0908's Note",
  description: "Write something worth useless",
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/icons/favicon.png' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/kjartanhr/JetBrainsMono-Webfont@main/JetBrainsMono/JetBrainsMono.css' }],
  ],

  themeConfig: {
    logo: '/icons/material/notebook-outline.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Series', link: '/series/' },
      { text: 'Misc', link: '/misc/' }
    ],

    sidebar: {
      '/series/': [
        {
          text: '三角函数未竟之美',
          link: '/series/trigonometry/index',
          collapsed: false,
          items: [
            { text: '为何用三角法', link: '/series/trigonometry/Why_tri/about' },
            { 
              text: '实用工具拾遗',
              link: '/series/trigonometry/Useful_Tools/index',
              collapsed: true,
              items: [
                { text: '和差化积', link: '/series/trigonometry/Useful_Tools/sum2product' },
                { text: '变相同一法', link: '/series/trigonometry/Useful_Tools/another_equal' },
                { text: '余切联合技术', link: '/series/trigonometry/Useful_Tools/cot' },
                { text: '合分比技术', link: '/series/trigonometry/Useful_Tools/mean_proportionals' }
              ]
            },
            {
              text: '正弦定理杂谈',
              link: '/series/trigonometry/Sine_Law/index',
              collapsed: true,
              items: [
                { text: '奠基性的正弦定理', link: '/series/trigonometry/Sine_Law/sine' },
                { text: '正弦定理系', link: '/series/trigonometry/Sine_Law/more_sine' }
              ]
            },
            {
              text: '余弦定理杂谈',
              link: '/series/trigonometry/Cosine_Law/index',
              collapsed: true,
              items: [
                { text: '补充性的余弦定理', link: '/series/trigonometry/Cosine_Law/cosine' },
                { text: '余弦定理系', link: '/series/trigonometry/Cosine_Law/more_cosine' }
              ]
            },
            {
              text: '三角联合定理',
              link: '/series/trigonometry/TIT/tit',
              collapsed: true,
              items: [
                { text: '三角联合定理', link: '/series/trigonometry/TIT/tit' },
                { text: '基于“消点”的三角法底层展开', link: '/series/trigonometry/TIT/expansion' }
              ]
            },
            {
              text: '基本构型补全',
              link: '/series/trigonometry/Basic_Cons/cons',
              collapsed: true,
              items: [
                { text: 'TIT的最后几块拼图(?)', link: '/series/trigonometry/Basic_Cons/cons' },
                { text: '圆相切', link: '/series/trigonometry/Basic_Cons/tangentcirc' },
                { text: '塞瓦型补充', link: '/series/trigonometry/Basic_Cons/more_ceva' }
              ]
            },
            {
              text: '杂项',
              link: '/series/trigonometry/Others/others'
            }
          ]
        }
      ],
      '/misc/': [
        {
          text: '杂项',
          link: '/misc/index',
          collapsed: false,
          items: [
            { 
              text: 'Music Player', 
              link: '/misc/rythms/',
              collapsed: true,
              items: [
                {
                  text: '已有歌单',
                  link: '/misc/rythms/songs-list',
                  collapsed: true,
                  items: [
                    { text: 'ふたつの影', link: '/misc/rythms/songs/futatsu-no-kage' },
                    { text: '明け星', link: '/misc/rythms/songs/akeboshi' },
                    { text: 'アルカテイル', link: '/misc/rythms/songs/alka-tale' }
                  ]
                },
                { text: '自行获取', link: '/misc/rythms/get-song'}
              ]
            },
            {
              text: 'Mac Helper',
              link: '/misc/mac/',
              collapsed: true,
              items: [
                { text: '获取Mac软件', link: '/misc/mac/software/' },
                { text: '节约存储空间', link: '/misc/mac/storage/' },
                { text: '在Mac上玩游戏', link: '/misc/mac/game/' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jayi0908/jayi0908-note' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-? jayi0908'
    },
    
    outline: {
      level: [2, 4], 
      label: '页面导航'
    },
    
    search: {
      provider: 'local'
    }
  },

  markdown: {
    config: (md) => {
      // 启用基础插件
      md.use(mathjax3)
      md.use(markdownItAttrs)

      // 注册 Tabs 容器 (渲染为自定义 Vue 组件 <Tabs>)
      md.use(container, 'tabs', {
        render: (tokens: any[], idx: number) => {
          return tokens[idx].nesting === 1 ? `<Tabs>\n` : `</Tabs>\n`
        }
      })

      // 注册 Tab 容器 (渲染为 <div label="..."> 以供 Tabs 组件解析)
      md.use(container, 'tab', {
        render: (tokens: any[], idx: number) => {
          const m = tokens[idx].info.trim().match(/^tab\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            const title = m ? m[1] : 'Tab'
            return `<div label="${md.utils.escapeHtml(title)}">\n`
          } else {
            return `</div>\n`
          }
        }
      })

      // 定义通用的 Admonition 函数 (渲染为 <Admonition> 组件)
      const createAdmonitionContainer = (type: string, defaultTitle: string) => {
        md.use(container, type, {
          validate(params: string) {
            return params.trim().match(new RegExp(`^${type}`, 'i'))
          },
          render(tokens: any[], idx: number) {
            const token = tokens[idx]
            if (token.nesting === 1) {
              // 解析标题与折叠标记
              const m = token.info.trim().match(new RegExp(`^${type}\\s+(.*)$`, 'i'))
              const rawTitle = m && m[1] ? m[1] : defaultTitle
              
              const isCollapsible = /collapse|可折叠/i.test(rawTitle)
              const cleanTitle = rawTitle.replace(/collapse|可折叠/gi, '').trim() || defaultTitle

              return `<Admonition 
                        type="${type.toLowerCase()}" 
                        title="${md.utils.escapeHtml(cleanTitle)}" 
                        :collapsible="${isCollapsible}"
                      >\n`
            } else {
              return `</Admonition>\n`
            }
          }
        })
      }

      // 批量注册所有 Admonition 类型
      Object.keys(titles).forEach((type) => {
        createAdmonitionContainer(type, titles[type])
      })
    }
  },
  
  vite: {
    plugins: [
      Components({
        dirs: ['.vitepress/theme/components'], // 确保组件目录被扫描
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [IconsResolver({ prefix: 'icon' })]
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
        defaultStyle: 'display: inline; vertical-align: middle;',
      }),
    ]
  }
})