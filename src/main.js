import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element.js'
import './assets/font/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'

const app = createApp(App)
app.config.globalProperties.$http = axios
installElementPlus(app)
app.use(router).mount('#app')
