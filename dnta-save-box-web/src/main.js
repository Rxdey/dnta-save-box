import { createApp } from 'vue';
import 'reset.css';
import pinia from '@/store';
import router from '@/router';
import App from './App.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言

dayjs.locale('zh-cn'); // 使用本地化语言

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
