import { defineStore } from 'pinia';
import { uniqueArray } from '@/utils';

const useDragStore = defineStore('drag', {
    state: () => ({
        dragData: null,
        favoriteList: [], // 当前收藏列表，不做缓存
        active: -1, // 当前激活的分组，用于校验拖拽时是否移除
    }),
    actions: {
        async UPDATE_DRAG_DATA(data) {
            this.dragData = data;
        },
        async UPDATE_FAVORITE_LIST(data) {
            this.favoriteList = uniqueArray(data);
        },
        async UPDATE_ACTIVE(data) {
            this.active = data;
        }
    }
});

export default useDragStore