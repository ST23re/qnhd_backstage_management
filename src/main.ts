import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'//可通过@形式查询引入
import pinia from '@/store/store'
import * as echarts from "echarts"; 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/reset.less'
import Navbar from '@/components/Navbar.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.config.globalProperties.$echarts = echarts
app.component('Navbar', Navbar)
.component("font-awesome-icon", FontAwesomeIcon)
.use(router).use(pinia)
.use(ElementPlus)
.mount('#app');
