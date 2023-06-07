<template>
    <el-aside class="aside">
        <div class="aside-container">
            <Tag label="我的收藏" @click="onSelect(-1)" :active="active === -1">
                <EpManagement />
            </Tag>
            <Tag v-for="(tag, i) in props.tagList" :key="tag.id" @click="onSelect(i, tag)" :label="tag.name" :active="active === i" edit @onEdit="onEdit(tag)" drag>
                <IcBaselineFavoriteBorder />
            </Tag>
        </div>
        <div class="aside-add">
            <Tag @onLeftClick="onAddTag">
                <EpPlus />
                <template #label>
                    <div class="add-input">
                        <input class="add-input-inner" type="text" placeholder="输入收藏夹名字" />
                    </div>
                </template>
            </Tag>
        </div>
    </el-aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Tag from '../components/Tag/Tag.vue';
import { IcBaselineFavoriteBorder } from '@/components/Icon';

const props = defineProps({
    tagList: {
        type: Array,
        default: () => []
    }
});
const emit = defineEmits(['change']);

const active = ref(-1);

const onAddTag = () => {
    console.log('add')
};
const onEdit = () => {
    console.log('edit')
};

const onSelect = (index, tag) => {
    if (active.value === index) return;
    active.value = index;
    emit('change', index, tag);
}

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
