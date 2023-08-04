<template>
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
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEdit } from './useEdit';
import useDragStore from '@/store/modules/useDragStore';

const store = useDragStore();

/** 编辑操作 */
const { loading, onDel, onUpdateTag, onEdit, handleClose, selectTag, dialogVisible } = useEdit(store);

defineExpose({
    onEdit,
})
</script>

<style lang="less" scoped></style>
