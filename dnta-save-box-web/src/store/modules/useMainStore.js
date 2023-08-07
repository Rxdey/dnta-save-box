import { defineStore } from 'pinia';
import { uniqueArray } from '@/utils';

const useMainStore = defineStore('drag', {
    state: () => ({
        dragData: null, // 拖拽的数据
        favoriteList: [], // 当前收藏列表，不做缓存
        active: -1, // 当前激活的分组，用于校验拖拽时是否移除 -1：全部 -2：回收站 -3：视频 -4： 未分类
        nsfw: sessionStorage.getItem('nsfw') == 1 ? 1 : 0,
        type: '',
        sort: 'DESC', // 排序
        editShow: false, // 编辑弹窗公用
        selectEdit: null,
        dragIn: false, // 是否有开始拖拽，用于禁止子元素事件
        checkList: [], // 选择列表
        waterfall: false, // 瀑布流
        hideMenu: false, // 隐藏菜单
    }),
    actions: {
        async UPDATE_WATERFALL(data) {
            this.waterfall = data;
        },
        async UPDATE_EDIT_SHOW(data) {
            this.editShow = data;
        },
        async UPDATE_CHECK_LIST(data) {
            this.checkList = data;
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
        },
        async UPDATE_HIDE_MENU(data) {
            this.hideMenu = data;
        }
    }
});

export default useMainStore;