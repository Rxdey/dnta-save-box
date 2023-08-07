<template>
    <el-container direction="vertical" class="home">
        <HeaderCom />
        <el-container class="home__container" v-if="loginStatus">
            <AsideCom />
            <el-main :class="['home__main', { hideMenu }]">
                <router-view :key="route.path" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsCookie from 'js-cookie';
import _ from 'lodash';
import HeaderCom from './container/Header/header.vue';
import AsideCom from './container/Aside/aside.vue';
import useMainStore from '@/store/modules/useMainStore';

const store = useMainStore();
const route = useRoute();
const router = useRouter();
const loginStatus = ref(false);
const hideMenu = computed(() => store.hideMenu);

const loadMenu = () => {
    if (!hideMenu.value && window.innerWidth < 1200) {
        store.UPDATE_HIDE_MENU(true);
    }
    if (window.innerWidth > 1200) {
        store.UPDATE_HIDE_MENU(false);
    }
};
onMounted(async () => {
    window.addEventListener('resize', _.throttle(loadMenu, 200),);
    loadMenu();
    const token = jsCookie.get('token');
    loginStatus.value = !!token;
    if (!loginStatus.value) {
        ElNotification({
            title: '请先登录',
            message: '',
            type: 'warning',
        });
        router.push('/login');
        return;
    }
});
</script>

<style lang="less">
@import url('./index.less');
</style>
