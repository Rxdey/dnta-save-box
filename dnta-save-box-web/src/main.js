import { createApp } from 'vue';
import VueLazyload from 'vue-lazyload';
import 'reset.css';
import { VueMasonryPlugin } from 'vue-masonry';
import pinia from '@/store';
import router from '@/router';
import App from './App.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import defaultImg from '@/assets/img/default.png';
import '@/utils/draggable-polyfill';
import '@/assets/styles/common.less';
import '@/assets/styles/theme.less';
import 'viewerjs/dist/viewer.css';
import { Icon } from '@iconify/vue';

dayjs.locale('zh-cn'); // 使用本地化语言

const app = createApp(App);
// app.config.unwrapInjectedRef = true
app.use(router);
app.use(pinia);
app.component('VIcon', Icon);
app.use(VueMasonryPlugin);
app.use(VueLazyload, {
    preLoad: 1.3,
    error: defaultImg,
    loading: defaultImg,
});
app.mount('#app');
