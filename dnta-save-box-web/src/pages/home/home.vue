<template>
  <el-container direction="vertical" class="home">
    <HeaderWap />
    <el-container style="min-height: 1px;">
      <AsideMenu :tagList="tagList" @change="onChange" @add="onAddTag" @del="onDelTag"/>
      <el-main class="main">
        <SortBar @typeChange="onTypeChange" @sort="onSort"/>
        <FavoriteWrap v-if="loginStatus" v-infinite-scroll="getFavorite" :infinite-scroll-disabled="finished || loading" :infinite-scroll-distance="0">
          <div class="card-wrap">
            <FavoriteCard v-for="favorite in favoriteList" :key="favorite.id" :data="favorite" />
          </div>
          <p class="tip" v-show="loading">加载中...</p>
          <p class="tip" v-show="finished && !loading">没有了</p>
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
const type = computed(() => store.type);
const sort = computed(() => store.sort);
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
    nsfw: store.nsfw,
    type: type.value,
    sort: sort.value
  };
  fetchData(api, params);
  if (isVideo.value) finished.value = true;
};

const reload = () => {
  page.value = 1;
  store.UPDATE_FAVORITE_LIST([]);
  finished.value = false;
  getFavorite();
};
const onSort = (val) => {
  store.UPDATE_SORT(val);
  reload();
};
const onTypeChange = ({ key }) => {
  store.UPDATE_TYPE(key);
  reload();
};
const onChange = (index, tag) => {
  isVideo.value = index === -3;
  const idMap = {
    '-4': 0
  };
  const tid = idMap[index] || idMap[index] === 0 ? idMap[index] : tag?.id;
  favParams.value = {
    tid,
    is_show: index === -2 ? 0 : 1
  };
  reload();
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
    title: '操作成功',
    message: '已添加',
    type: 'success',
  });
  tagList.value.push({
    id: data,
    name: tanName
  });
  next();
};
// 删除标签
const onDelTag = (id) => {
  tagList.value = tagList.value.filter(item => item.id !== id);
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
