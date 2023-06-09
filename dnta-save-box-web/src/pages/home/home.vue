<template>
  <el-container direction="vertical" class="home">
    <HeaderWap />
    <el-container style="min-height: 1px;">
      <AsideMenu :tagList="tagList" @change="onChange" @add="onAddTag" />
      <el-main class="main">
        <SortBar />
        <FavoriteWrap v-if="loginStatus" v-infinite-scroll="getFavorite" :infinite-scroll-disabled="finished || loading" :infinite-scroll-distance="20">
          <FavoriteCard v-for="favorite in favoriteList" :key="favorite.id" :data="favorite" />
          <p class="tip" v-show="loading">加载中...</p>
          <p class="tip" v-show="finished && !loading">没有更多了</p>
        </FavoriteWrap>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsCookie from 'js-cookie';

import HeaderWap from './container/Header/Header.vue';
import AsideMenu from './container/AsideMenu/AsideMenu.vue';
import SortBar from './container/SortBar/SortBar.vue';
import FavoriteWrap from './components/FavoriteCard/FavoriteWrap.vue';
import FavoriteCard from './components/FavoriteCard/FavoriteCard.vue';

import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';

import useFetchScroll from './composables/useFetchScroll';

const store = useDragStore();
const router = useRouter();
const tagList = ref([]);
const isVideo = ref(false);
const loginStatus = ref(false);

const favoriteList = computed(() => store.favoriteList);
const { fetchData, loading, finished, page, pageSize } = useFetchScroll();

const favParams = ref({
  tid: null
});


const getTag = async () => {
  const res = await Server.TagAllUseGET();
  const { data, success, msg } = res;
  if (!success) {
    ElMessage.error(msg);
    return;
  }
  tagList.value = data;
};

const getFavorite = async () => {
  const api = isVideo.value ? Server.VideoUseGet : Server.FavoriteGetUseGET;
  const params = {
    ...favParams.value,
    pageSize: pageSize.value,
    page: page.value,
    nsfw: store.nsfw
  };
  fetchData(api, params);
  if (isVideo.value) finished.value = true;
};

const onChange = (index, tag) => {
  // video
  isVideo.value = index === -3;
  page.value = 1;
  favParams.value = {
    tid: tag?.id || null,
    is_show: index === -2 ? 0 : 1
  };
  store.UPDATE_FAVORITE_LIST([]);
  finished.value = false;
};
// TODO => 新增标签
const onAddTag = async (tanName, next = () => { }) => {
  const res = await Server.TagAddUsePOST({
    name: tanName.trim()
  });
  const { success, msg, data } = res;
  if (!success) {
    ElMessage.error(msg);
    return;
  }
  ElNotification({
    title: 'Success',
    message: '已添加',
    type: 'success',
  });
  tagList.value.push({
    id: data,
    name: tanName
  });
  next();
};

onMounted(async () => {
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
  await getTag();
})

</script>

<style lang="less">
@import url('./index.less');
</style>
