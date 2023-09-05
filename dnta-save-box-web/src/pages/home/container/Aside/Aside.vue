<template>
    <transition name="aside">
        <el-aside class="aside" v-show="!hideMenu">
            <div class="aside-menu" v-for="menu in menuList" :key="menu.id">
                <TagItem 
                    :label="menu.name" 
                    @click="onSelect(menu)" 
                    :icon="menu.icon" 
                    :edit="!!menu.edit"
                    @onEdit="onEdit(menu)" 
                    :id="menu.id" 
                    :drag="!!menu.drag"
                    :count="menu.favorite_count" 
                    :active="activeKey == menu.url" 
                />
                <div class="aside-item">
                    <TagItem 
                        v-for="child in menu.children" 
                        :key="child.id"
                        :label="child.name" 
                        @click="onSelect(child)" 
                        :icon="child.icon" 
                        :edit="!!child.edit"
                        @onEdit="onEdit(child)" 
                        :id="child.id" 
                        :drag="!!child.drag"
                        :count="child.favorite_count" 
                        :active="activeKey == child.url" 
                    />
                <!-- 增加标签 -->
                <TagItem @onLeftClick="onAddTag" v-if="menu.id === 'all'">
                    <v-icon icon="mdi:plus" />
                    <template #label>
                        <Field v-model="tagName" placeholder="输入收藏夹名字" @enter="onAddTag" />
                    </template>
                </TagItem>
                </div>
            </div>
        </el-aside>
    </transition>
    <editModal ref="edit" @del="onDel"/>
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
import { menus } from './menu';

const route = useRoute();
const router = useRouter();
const store = useMainStore();
const { loading, fetch } = useFetch();

const menuList = ref(menus);
const tagName = ref('');
const edit = ref(null);
const activeKey = computed(() => route.path);
const hideMenu = computed(() => store.hideMenu);

/** 编辑弹窗 */
const onEdit = (data) => {
    edit.value.onEdit(data);
};
/** 删除回调 */
const onDel = (id) => {
    console.log(id)
    menuList.value[0].children = menuList.value[0].children.filter(item => item.id !== id)
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
    menuList.value[0].children.splice(menuList.value[0].children.length - 1, 0, {
        id: res,
        name: tagName.value,
        key: res,
        edit: true,
        url: `/home/collect/${res}`,
        drag: true,
        nsfw: 0
    });
    tagName.value = '';
};

const onSelect = ({ id, url }) => {
    router.replace({
        path: url
    });
};

const queryData = async () => {
    const res = await fetch(Server.TagAllUseGET, { nsfw: store.nsfw });
    if (!res) return;
    menuList.value[0].children.unshift(...res.map((item) => ({ ...item, url: `/home/collect/${item.id}`, edit: true, drag: true })));
};

onMounted(() => {
    queryData();
});
</script>

<style lang="less">
@import url('./index.less');
</style>
