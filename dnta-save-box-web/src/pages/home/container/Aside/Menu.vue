<template>
    <transition name="aside">
        <el-aside class="aside" v-show="!hideMenu">
            <TagItem :label="mainTab.name" @click="onSelect(mainTab)" :icon="mainTab.icon" :active="activeKey == mainTab.url">
                <template #edit>
                    <EpArrowDown />
                </template>
            </TagItem>
            <div class="aside__wrap">
                <TagItem v-for="(tag, i) in targetList" :key="i" :label="tag.name" @click="onSelect(tag)" :icon="tag.icon" edit @onEdit="onEdit(tag)" :id="tag.id" drag :count="tag.favorite_count" :active="activeKey == tag.url" />

                <TagItem :label="defaultTab.name" @click="onSelect(defaultTab)" :icon="defaultTab.icon" :active="activeKey == defaultTab.url" />
                <!-- 增加标签 -->
                <TagItem @onLeftClick="onAddTag">
                    <v-icon icon="mdi:plus" />
                    <template #label>
                        <Field v-model="tagName" placeholder="输入收藏夹名字" @enter="onAddTag" />
                    </template>
                </TagItem>
            </div>
            <!-- 其它功能 -->
            <div class="aside__wrap">
                <TagItem v-for="(tag, i) in othertabs" :key="i" :label="tag.name" @click="onSelect(tag)" :icon="tag.icon" :active="activeKey == tag.url" />
            </div>
        </el-aside>
    </transition>
    <editModal ref="edit" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TagItem from '../../components/TagItem/TagItem.vue';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';
import useMainStore from '@/store/modules/useMainStore';
import Field from '@/components/Field/Field.vue';
import editModal from './components/editModal.vue';
import { menuList } from './menu';

const mainTab = { name: '我的收藏', id: 'all', url: '/home/collect/all' };
// 其它功能
const othertabs = [
    { name: '回收站', id: 'recovery', icon: 'mdi:delete-sweep', url: '/home/collect/recovery' },
    { name: '视频', id: 'video', icon: 'mdi:video-check', url: '/home/collect/video' },
    { name: '上传', id: 'upload', icon: 'ic:round-drive-folder-upload', url: '/home/upload' },
];
const defaultTab = { name: '未分类', id: 0, icon: 'mdi:tag-outline', url: '/home/collect/0' };

const route = useRoute();
const router = useRouter();
const store = useMainStore();
const { loading, fetch } = useFetch();
const targetList = ref([]);
const tagName = ref('');
const edit = ref(null);
const activeKey = computed(() => route.path);
const hideMenu = computed(() => store.hideMenu);
/** 编辑弹窗 */
const onEdit = (data) => {
    edit.value.onEdit(data);
};
/** 新增标签 */
const onAddTag = async () => {
    if (!tagName.value || !tagName.value.trim()) return;
    const res = await fetch(Server.TagAddUsePOST, {
        name: tagName.value.trim()
    });
    if (!res) return;
    ElNotification({
        title: '操作成功',
        message: '已添加',
        type: 'success',
    });
    targetList.value = [...targetList.value, {
        id: res,
        name: tagName.value,
        key: res
    }];
};

const onSelect = ({ id, url }) => {
    router.replace({
        path: url
    });
};

const queryData = async () => {
    const res = await fetch(Server.TagAllUseGET, { nsfw: store.nsfw });
    if (!res) return;
    targetList.value = res.map((item) => ({ ...item, url: `/home/collect/${item.id}` }));
};

onMounted(() => {
    queryData();
});
</script>

<style lang="less">
@import url('./index.less');
</style>
