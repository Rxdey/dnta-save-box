import { defineStore } from 'pinia';
import { uniqueArray } from '@/utils';

const useDragStore = defineStore('drag', {
    state: () => ({
        dragData: null,
        favoriteList: [], // 当前收藏列表，不做缓存
        active: -1, // 当前激活的分组，用于校验拖拽时是否移除
        nsfw: sessionStorage.getItem('nsfw') == 1 ? 1 : 0,
        type: '',
        sort: 'DESC',
        editShow: false,
        selectEdit: null,
        dragIn: false // 是否有开始拖拽，用于禁止子元素事件
    }),
    actions: {
        async UPDATE_EDIT_SHOW(data) {
            this.editShow = data;
        },
        async UPDATE_SELECT_EDIT(data) {
            this.selectEdit = data;
        },
        async UPDATE_DRAGIN(data) {
            this.dragIn = data;
        },
        async UPDATE_SORT(data) {
            this.sort = data ? 'ASC' : 'DESC';
        },
        async UPDATE_TYPE(data) {
            this.type = data;
        },
        async UPDATE_NSFW(data) {
            sessionStorage.setItem('nsfw', data ? 1 : 0);
            this.nsfw = data ? 1 : 0;
        },
        async UPDATE_DRAG_DATA(data) {
            this.dragData = data;
        },
        async UPDATE_FAVORITE_LIST(data) {
            this.favoriteList = uniqueArray(data);
        },
        async UPDATE_FAVORITE_BY_ID(data) {
            this.favoriteList = this.favoriteList.map(item => {
                return item.id === data.id ? {...item, ...data} : item;
            });
        },
        async UPDATE_ACTIVE(data) {
            this.active = data;
        }
    }
});

export default useDragStore;