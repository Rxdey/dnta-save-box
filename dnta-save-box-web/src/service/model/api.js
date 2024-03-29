import request from '../request';

/**
 * 登录-接口
 */
export const LoginUsePOST = (params) => request({
    url: '/login',
    method: 'POST'
}, params);


/**
 * 所有标签-接口
 */
export const TagAllUseGET = (params) => request({
    url: '/tag/all',
    method: 'GET'
}, params);


/**
 * 获取收藏-接口
 */
export const FavoriteGetUseGET = (params) => request({
    url: '/favorite/get',
    method: 'GET'
}, params);


/**
 * 新增标签-接口
 */
export const TagAddUsePOST = (params) => request({
    url: '/tag/add',
    method: 'POST'
}, params);


/**
 * 更新标签-接口
 */
export const TagUpdateUsePOST = (params) => request({
    url: '/tag/update',
    method: 'POST'
}, params);


/**
 * 增加收藏-接口
 */
export const FavoriteAddUsePOST = (params) => request({
    url: '/favorite/add',
    method: 'POST'
}, params);


/**
 * 更新收藏-接口
 */
export const FavoriteUpdateUsePOST = (params) => request({
    url: '/favorite/update',
    method: 'POST'
}, params);
/**
 * 更新收藏排序-接口
 */
export const FavoriteSoreUsePOST = (params) => request({
    url: '/favorite/sort',
    method: 'POST'
}, params);

/**
 * 重置排序-接口
 */
export const FavoriteUpdateSortUsePOST = (params) => request({
    url: '/favorite/updateSort',
    method: 'POST'
}, params);

/**
 * 彻底删除收藏
 */
export const FavoriteDelUsePOST = (params) => request({
    url: '/favorite/del',
    method: 'POST'
}, params);
/**
 * 批量删除收藏
 */
export const FavoriteBatchDelUsePOST = (params) => request({
    url: '/favorite/batchDel',
    method: 'POST'
}, params);

/**
 * 彻底删除收藏夹
 */
export const TagDelUsePOST = (params) => request({
    url: '/tag/del',
    method: 'POST'
}, params);


/**
 * 获取视频
 */
export const VideoUseGet = (params) => request({
    url: '/video/get',
    method: 'GET'
}, params);

/**
 * 拉取视频封面
 */
export const VideoGetCoverUseGet = (params) => request({
    url: '/video/getCover',
    method: 'GET'
}, params);

/**
 * 拉取视频封面
 */
export const FavoriteUploadImage = (params) => request({
    url: '/favorite/uploadImage',
    headers: {
        'content-type': 'multipart/form-data'
    },
    method: 'POST'
}, params);