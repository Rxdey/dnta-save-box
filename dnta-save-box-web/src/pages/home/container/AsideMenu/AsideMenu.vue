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
            </div>
        </div>
        <div class="aside-wrap">
            <Tag @onLeftClick="onAddTag">
                <EpPlus />
                <template #label>
                    <!-- <div class="add-input">
                        <input class="add-input-inner" type="text" placeholder="输入收藏夹名字" v-model="tanName" @keydown.enter="onAddTag" />
                    </div> -->
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
    <el-dialog v-model="dialogVisible" title="编辑收藏夹" :before-close="handleClose" append-to-body class="edit-dialog">
        <div class="edit-container">
            <div class="edit-form-item">
                <p class="label">收藏夹名字</p>
                <Field placeholder="输入收藏夹名字" v-model="selectTag.name"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="onDel">删除收藏夹</el-button>
                <el-button @click="dialogVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Tag from '../../components/Tag/Tag.vue';
import { IcBaselineFavoriteBorder, IcOutlineAutoDelete, IcRoundVideoCameraBack, IcRoundFolderSpecial } from '@/components/Icon';
import Field from '@/components/Field/Field.vue';
import useDragStore from '@/store/modules/useDragStore';
// import * as Server from '@/service/model/api';

const props = defineProps({
    tagList: {
        type: Array,
        default: () => []
    }
});

const store = useDragStore();
const emit = defineEmits(['change', 'add']);
// const active = ref(-1);
const active = computed(() => store.active);
const tanName = ref('');
const dialogVisible = ref(false);
const selectTag = ref(null);


const onEdit = (data) => {
    selectTag.value = data;
    dialogVisible.value = true;

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
    emit('change', index, tag);
};

const handleClose = (done) => {
    done();
};

const onDel = () => {

}

</script>

<style lang="less">
@import url('./index.less');
</style>
