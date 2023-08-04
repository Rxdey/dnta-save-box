<template>
    <el-aside class="aside">
        <TagItem label="我的收藏" @click="onSelect({ key: 'all' })" edit :active="activeKey === 'all'">
            <template #edit>
                <EpArrowDown />
            </template>
        </TagItem>
        <div class="aside__wrap">
            <TagItem v-for="(tag, i) in targetList" :key="i" :label="tag.name" @click="onSelect(tag)" :icon="tag.icon" edit @onEdit="onEdit(tag)" :id="tag.id" drag :count="tag.favorite_count" :active="activeKey == tag.type" />

            <TagItem :label="defaultTab.name" @click="onSelect(defaultTab)" :icon="defaultTab.icon" :active="activeKey == defaultTab.type" />
            <!-- 增加标签 -->
            <TagItem @onLeftClick="onAddTag">
                <v-icon icon="mdi:plus"/>
                <template #label>
                    <Field v-model="tagName" placeholder="输入收藏夹名字" @enter="onAddTag" />
                </template>
            </TagItem>
        </div>
        <!-- 其它功能 -->
        <div class="aside__wrap">
            <TagItem v-for="(tag, i) in othertabs" :key="i" :label="tag.name" @click="onSelect(tag)" :icon="tag.icon" :active="activeKey == tag.type" />
        </div>
    </el-aside>
    <editModal ref="edit" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TagItem from '../../components/TagItem/TagItem.vue';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';
import Field from '@/components/Field/Field.vue';
import editModal from './editModal.vue';

// 其它功能
const othertabs = [
    { name: '回收站', type: 'recovery', id: 'recovery', icon: 'mdi:delete-sweep' },
    { name: '视频', type: 'video', id: 'video', icon: 'mdi:video-check' },
    { name: '上传', type: 'upload', id: 'upload', icon: 'ic:round-drive-folder-upload', url: 'upload' },
];
const defaultTab = { name: '未分类', type: 'uncategorized', id: 0, icon: 'mdi:tag-outline' };

const route = useRoute();
const router = useRouter();
const store = useDragStore();
const { loading, fetch } = useFetch();
const targetList = ref([]);
const tagName = ref('');
const edit = ref(null);
const activeKey = computed(() => route.params.type);
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

const onSelect = ({ type, id, url }) => {
    let tid = id;
    if (type === 'all') tid = 'all';
    router.replace({
        name: url || 'collect',
        params: {
            tid,
            type
        }
    });
};

const queryData = async () => {
    const res = await fetch(Server.TagAllUseGET, { nsfw: store.nsfw });
    if (!res) return;
    targetList.value = res.map((item) => ({ ...item, type: item.id }));
};

onMounted(() => {
    queryData();
});
</script>

<style lang="less">
@import url('./index.less');
</style>
