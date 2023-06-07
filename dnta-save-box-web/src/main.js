import { createApp } from 'vue';
import VueLazyload from 'vue-lazyload';
import 'reset.css';
import pinia from '@/store';
import router from '@/router';
import App from './App.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import defaultImg from '@/assets/img/default.png';
import 'draggable-polyfill';

dayjs.locale('zh-cn'); // 使用本地化语言

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(VueLazyload, {
    preLoad: 1.3,
    error: defaultImg,
    loading: defaultImg,
});
app.mount('#app');
