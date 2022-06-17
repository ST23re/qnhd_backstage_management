import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'//可通过@形式查询引入
import pinia from '@/store/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/reset.less'
import Navbar from '@/components/Navbar.vue'

const app = createApp(App);
app.component('Navbar', Navbar)
.use(router).use(pinia)
.use(ElementPlus)
.mount('#app');
