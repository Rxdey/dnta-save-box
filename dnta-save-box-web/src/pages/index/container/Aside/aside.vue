<template>
    <el-aside class="aside">
        <TagItem label="我的收藏" @click="onSelect({ key: 'all' })" icon="IcRoundFolderSpecial" />
        <div class="aside__wrap">
            <TagItem v-for="(tag, i) in targetList" :key="i" :label="tag.name" @click="onSelect(tag)" :icon="tag.icon || 'IcBaselineFavoriteBorder'" edit @onEdit="onEdit(tag)" :id="tag.id" drag :count="tag.favorite_count" />

            <TagItem @onLeftClick="onAddTag">
                <EpPlus />
                <template #label>
                    <Field v-model="tagName" placeholder="输入收藏夹名字" @enter="onAddTag" />
                </template>
            </TagItem>
        </div>
    </el-aside>
    <el-dialog v-model="dialogVisible" title="编辑收藏夹" :before-close="handleClose" append-to-body class="edit-dialog" draggable destroy-on-close>
        <div class="edit-container">
            <div class="edit-form-item">
                <p class="label">收藏夹名字</p>
                <Field placeholder="输入收藏夹名字" v-model="selectTag.name" />
            </div>
            <div class="edit-form-item">
                <el-switch v-model="selectTag.nsfw" :inactive-value="1" style="--el-switch-on-color: #5dca91; --el-switch-off-color: #ff4242;--el-color-primary: #f101eb;" :active-value="0" active-text="SFW" inactive-text="NSFW" />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="onDel" :loading="loading">删除收藏夹</el-button>
                <el-button @click="onUpdateTag" :loading="loading">更新</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TagItem from '../../components/TagItem/TagItem.vue';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';
import Field from '@/components/Field/Field.vue';
import { useEdit } from './useEdit';


const defaultTab = { name: '未分类', key: 'uncategorized', icon: 'TagOutline' };

const router = useRouter();
const store = useDragStore();
const { loading, fetch } = useFetch();
/** 编辑操作 */
const { onDel, onUpdateTag, onEdit, onAddTag, handleClose, selectTag, dialogVisible } = useEdit(store);
const targetList = ref([]);
const tagName = ref('');


const onSelect = ({ key, id }) => {
    let tid = id;
    if (key === 'all') tid = '';
    if (key === 'uncategorized') tid = 0;
    router.replace({
        name: 'collect',
        params: {
            tid,
            type: key
        }
    });
};
const queryData = async () => {
    const res = await fetch(Server.TagAllUseGET, { nsfw: store.nsfw });
    if (!res) return;
    console.log(res);
    targetList.value = [...res, defaultTab];
};

onMounted(() => {
    queryData();
});
</script>

<style lang="less">
@import url('./index.less');
</style>
