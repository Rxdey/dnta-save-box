<template>
  <el-container direction="vertical" class="home">
    <HeaderWap />
    <el-container style="min-height: 1px;">
      <AsideMenu :tagList="tagList" @change="onChange" @add="onAddTag" @del="onDelTag" />
      <el-main class="main">
        <SortBar @typeChange="onTypeChange" @sort="onSort" />
        <FavoriteWrap v-if="loginStatus" v-infinite-scroll="getFavorite" :infinite-scroll-disabled="finished || loading" :infinite-scroll-distance="0">
          <div class="card-wrap">
            <FavoriteCard v-for="favorite in favoriteList" :key="favorite.id" :data="favorite" />
          </div>
          <p class="tip" v-show="loading">加载中...</p>
          <p class="tip" v-show="finished && !loading">没有了</p>
        </FavoriteWrap>
      </el-main>
    </el-container>
    <teleport to="body">
      <transition name="slide">
        <div class="popup" v-if="drawer">
          <div class="check-tip">已选择 {{ checkList.length }} 项, 当前页共加载 {{ favoriteList.length }} 项</div>
          <div>
            <span class="check-all" @click="onCheckAll">全选</span>
            <span class="check-all" @click="onCheckAll(false)">取消</span>
                <span v-if="active === -2" class="check-all restore" @click="onDeleteAll(false)">恢复</span>
                <span class="check-all del" @click="onDeleteAll">删除</span>
          </div>
        </div>
      </transition>
    </teleport>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import jsCookie from 'js-cookie';

import HeaderWap from './container/Header/Header.vue';
import AsideMenu from './container/AsideMenu/AsideMenu.vue';
import SortBar from './container/SortBar/SortBar.vue';
import FavoriteWrap from './components/FavoriteCard/FavoriteWrap.vue';
import FavoriteCard from './components/FavoriteCard/FavoriteCard.vue';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';
import useFetchScroll from './composables/useFetchScroll';
import useUpdate from './composables/useUpdate';

const store = useDragStore();
const router = useRouter();
const tagList = ref([]);
const isVideo = ref(false);
const loginStatus = ref(false);
const drawer = ref(false);

const favoriteList = computed(() => store.favoriteList);
const type = computed(() => store.type);
const sort = computed(() => store.sort);
const active = computed(() => store.active);
const checkList = computed(() => store.checkList);
const { fetchData, loading, finished, page, pageSize } = useFetchScroll();
const { fetchData: fetchDataNormal } = useUpdate();
const favParams = ref({
  tid: null
});
// 获取收藏夹
const getTag = async () => {
  const res = await Server.TagAllUseGET({
    nsfw: store.nsfw
  });
  const { data, success, msg } = res;
  if (!success) {
    ElMessage.error(msg);
    return;
  }
  tagList.value = data;
};
// 获取收藏
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
// 重置页码
const reload = () => {
  page.value = 1;
  store.UPDATE_FAVORITE_LIST([]);
  finished.value = false;
  getFavorite();
};
// 排序
const onSort = (val) => {
  store.UPDATE_SORT(val);
  reload();
};
const onTypeChange = ({ key }) => {
  store.UPDATE_TYPE(key);
  reload();
};
// 切换收藏夹
const onChange = (index, tag) => {
  store.UPDATE_CHECK_LIST([]);
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
const onAddTag = (tanName, next = () => { }) => {
  fetchDataNormal(Server.TagAddUsePOST, {
    name: tanName.trim()
  }, data => {
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
  });
};
// 删除标签
const onDelTag = (id) => {
  tagList.value = tagList.value.filter(item => item.id !== id);
};
// 全选
const onCheckAll = (type = true) => {
  store.UPDATE_CHECK_LIST(type ? favoriteList.value : []);
};
// 批量删除
const onDeleteAll = (type = true) => {
  ElMessageBox.confirm(`确定要${type ? '删除' : '恢复'}吗?`, '', {
    confirmButtonText: type ? '删除' : '恢复',
    cancelButtonText: '取消'
  }).then(async () => {
    const ids = checkList.value.map(item => item.id);
    const res = await fetchDataNormal(Server.FavoriteBatchDelUsePOST, {
      ids,
      is_show: type ? 0 : 1
    });
    if (!res) return;
    ElNotification({
      title: '操作成功',
      type: 'success'
    });
    store.UPDATE_CHECK_LIST([]);
    store.UPDATE_FAVORITE_LIST(favoriteList.value.filter(item => !ids.includes(item.id)));
  }).catch(() => {

  });
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
});

watch(() => checkList.value, val => {
  drawer.value = !!val.length;
});

</script>

<style lang="less">
@import url('./index.less');
</style>
