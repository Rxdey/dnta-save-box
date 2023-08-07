<template>
    <el-header class="header">
        <div class="header__left">
            <el-icon :size="24" class="menu" title="收起" @click.stop="onHideMenu">
                <EpOperation />
            </el-icon>
        </div>
        <div class="header__center"> <img src="/logo.png" alt="logo" /> DNTA BOX </div>
        <div class="header__right">
            <el-dropdown :show-timeout="0">
                <div class="user" @click.stop>
                    <img :nsfw="!!nsfw" v-lazy="userInfo.avatar" class="avatar" :title="userInfo.nick_name">
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="toggleNsfw">{{ nsfw ? 'SFW' : 'NSFW' }}</el-dropdown-item>
                        <el-dropdown-item @click="onLogOut">LOGOUT</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { customStorage } from '@/utils';
import useMainStore from '@/store/modules/useMainStore';
import jsCookie from 'js-cookie';

const router = useRouter();
const store = useMainStore();
const nsfw = computed(() => store.nsfw);
const userInfo = computed(() => customStorage.getItem('userInfo') || {});
const emit = defineEmits(['hideMenu']);

const toggleNsfw = () => {
    store.UPDATE_NSFW(nsfw.value ? 0 : 1);
    setTimeout(() => {
        window.location.reload();
    }, 0);
};

const onHideMenu = () => {
    store.UPDATE_HIDE_MENU(!store.hideMenu);
};
const onLogOut = () => {
    customStorage.remove('userInfo');
    jsCookie.remove('token');
    router.push('/login');
}

</script>

<style lang="less">
@import url('./index.less');
</style>
