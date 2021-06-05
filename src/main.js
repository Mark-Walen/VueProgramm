import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element.js'
import './assets/font/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://localhost:3000'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
const app = createApp(App)
app.config.globalProperties.$http = axios
installElementPlus(app)
app.use(router).mount('#app')
