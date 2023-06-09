<template>
    <el-aside class="aside">
        <div class="aside-wrap">
            <Tag label="我的收藏" @click="onSelect(-1)" :active="active === -1">
                <IcRoundFolderSpecial />
            </Tag>
            <div class="aside-container">
                <Tag v-for="(tag, i) in props.tagList" :key="tag.id" @click="onSelect(i, tag)" :label="tag.name" :active="active === i" edit @onEdit="onEdit(tag)" :id="tag.id" drag>
                    <IcBaselineFavoriteBorder />
                </Tag>
                <Tag label="未分类" @click="onSelect(-4)" :active="active === -4">
                    <TagOutline />
                </Tag>

            </div>
        </div>
        <div class="aside-wrap">
            <Tag @onLeftClick="onAddTag">
                <EpPlus />
                <template #label>
                    <Field v-model="tanName" placeholder="输入收藏夹名字" @enter="onAddTag" />
                </template>
            </Tag>
        </div>
        <div class="aside-wrap">
            <Tag label="回收站" @click="onSelect(-2)" :active="active === -2">
                <IcOutlineAutoDelete />
            </Tag>
        </div>
        <div class="aside-wrap">
            <Tag label="视频" @click="onSelect(-3)" :active="active === -3">
                <IcRoundVideoCameraBack />
            </Tag>
        </div>
    </el-aside>
    <el-dialog v-model="dialogVisible" title="编辑收藏夹" :before-close="handleClose" append-to-body class="edit-dialog" draggable destroy-on-close>
        <div class="edit-container">
            <div class="edit-form-item">
                <p class="label">收藏夹名字</p>
                <Field placeholder="输入收藏夹名字" v-model="selectTag.name" />
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
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Tag from '../../components/Tag/Tag.vue';
import { IcBaselineFavoriteBorder, IcOutlineAutoDelete, IcRoundVideoCameraBack, IcRoundFolderSpecial, TagOutline } from '@/components/Icon';
import Field from '@/components/Field/Field.vue';
import useDragStore from '@/store/modules/useDragStore';
import * as Server from '@/service/model/api';
import { ElMessageBox } from 'element-plus';

const props = defineProps({
    tagList: {
        type: Array,
        default: () => []
    }
});

const store = useDragStore();
const emit = defineEmits(['change', 'add', 'del']);
const active = computed(() => store.active);
const tanName = ref('');
const dialogVisible = ref(false);
const loading = ref(false);
const selectTag = ref(null);
const lastName = ref('');


const onEdit = (data) => {
    selectTag.value = data;
    lastName.value = data.name;
    dialogVisible.value = true;
};
// 更新
const onUpdateTag = async () => {
    loading.value = true;
    const res = await Server.TagUpdateUsePOST({
        id: selectTag.value.id,
        name: selectTag.value.name
    });
    loading.value = false;
    const { success, msg } = res;
    if (!success) {
        selectTag.value.name = lastName.value;
        ElMessage.error(msg);
        return;
    }
    lastName.value = '';
    dialogVisible.value = false;
    ElNotification({
        title: 'Success',
        message: '更新成功',
        type: 'success',
    });
};
// 删除
const onDel = () => {
    dialogVisible.value = false;
    ElMessageBox.confirm('删除收藏夹后，所有收藏将被移动至 未分类收藏，是否继续删除？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    }).then(async () => {
        loading.value = true;
        const res = await Server.TagDelUsePOST({
            id: selectTag.value.id,
        });
        loading.value = false;
        const { success, msg } = res;
        if (!success) {
            ElMessage.error(msg);
            return;
        }
        if (props.tagList[active.value].id === selectTag.value.id) store.UPDATE_ACTIVE(-1);
        emit('del', selectTag.value.id);
        ElNotification({
            title: 'Success',
            message: '已删除',
            type: 'success',
        });
    }).catch(() => {
        dialogVisible.value = true;
    });
};

const onAddTag = () => {
    if (!tanName.value || !tanName.value.trim()) return;
    emit('add', tanName.value, () => {
        tanName.value = '';
    });
};

const onSelect = (index, tag) => {
    if (active.value === index) return;
    store.UPDATE_ACTIVE(index);
};

const handleClose = (done) => {
    if(selectTag.value && lastName.value) selectTag.value.name = lastName.value;
    done();
};

watch(() => active.value, val => {
    emit('change', val, props.tagList[val]);
});


</script>

<style lang="less">
@import url('./index.less');
</style>
