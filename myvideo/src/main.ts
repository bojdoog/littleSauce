import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css
import Cookie from 'js-cookie';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

router.beforeEach((to, from, next) => {
    const token = Cookie.get('USER_TOKEN')
    if (to.name === 'Register') {
        Cookie.remove('USER_TOKEN')
        next()
    }
    else if (to.name === 'Login' && from.name !== 'Login' && from.name !== undefined) {
        Cookie.remove('USER_TOKEN')
        Cookie.remove('USER_INFO')
        next()
    } else {
        if (!token && to.name !== 'Login') {
            next({ name: 'Login' })
        } else if (token && to.name === 'Login') {
            next({ name: 'Home' })
        } else {
            next()
        }
    }
})


const app = createApp(App)
app.use(store).use(router).use(ElementPlus).use(vue3videoPlay)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}