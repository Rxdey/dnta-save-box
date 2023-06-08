<template>
    <el-aside class="aside">
        <div class="aside-wrap">
            <div class="aside-container">
                <Tag label="我的收藏" @click="onSelect(-1)" :active="active === -1">
                    <EpManagement />
                </Tag>
                <Tag v-for="(tag, i) in props.tagList" :key="tag.id" @click="onSelect(i, tag)" :label="tag.name" :active="active === i" edit @onEdit="onEdit(tag)" :id="tag.id" drag>
                    <IcBaselineFavoriteBorder />
                </Tag>
            </div>
            <div class="aside-add">
                <Tag @onLeftClick="onAddTag">
                    <EpPlus />
                    <template #label>
                        <div class="add-input">
                            <input class="add-input-inner" type="text" placeholder="输入收藏夹名字" v-model="tanName" />
                        </div>
                    </template>
                </Tag>
            </div>
        </div>
        <div class="aside-wrap">
            <Tag label="回收站" @click="onSelect(-2)" :active="active === -2">
                <EpManagement />
            </Tag>
        </div>
        <div class="aside-wrap">
            <Tag label="视频" @click="onSelect(-3)" :active="active === -3">
                <EpManagement />
            </Tag>
        </div>
    </el-aside>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Tag from '../components/Tag/Tag.vue';
import { IcBaselineFavoriteBorder } from '@/components/Icon';
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


const onEdit = () => {
    console.log('edit');
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
// watch(() => active.value, () => {
//     store.UPDATE_ACTIVE(active.value)
// })
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
