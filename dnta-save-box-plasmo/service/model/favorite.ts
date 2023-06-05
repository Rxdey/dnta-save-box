import request from '../request';
import type { ResponseType } from '../responseTypes';


export type FavoriteData = {
    id?: number
    uid?: number
    tid?: number
    title?: string
    desc_txt?: string
    type?: string
    content?: string
    origin?: string
    path?: string
    preview_img?: string
    is_show?: boolean
}
/**
 * 添加 更新
 * @param params 
 * @returns 
 */
export const favoriteSave = (params: FavoriteData): Promise<ResponseType<number>> => request({
    url: '/favorite/save',
    method: 'POST'
}, params);

type FavoriteDelParams = {
    id: string | number
}
type FavoriteDelResponse = {
    row: number
}
export const favoriteDel = (params: FavoriteDelParams): Promise<ResponseType<FavoriteDelResponse>> => request({
    url: '/favorite/del',
    method: 'POST'
}, params);