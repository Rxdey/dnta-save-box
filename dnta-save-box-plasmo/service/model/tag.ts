import request from '../request';
import type { ResponseType } from '../responseTypes';

export type TagAllResponse = {
  id?: number,
  uid?: number,
  pid?: number,
  name?: string,
  desc_txt?: string,
  color?: string,
  index?: number,
  create_date?: string,
  update_date?: string
};
/**
 * 获取全部标签
 */
export const TagAll = (): Promise<ResponseType<TagAllResponse[]>> => request({
  url: '/tag/all',
  method: 'get'
}, {});

type AddTagParams = {
  name: string
}

export const addTag = (params: AddTagParams): Promise<ResponseType<number>> => request({
  url: '/tag/add',
  method: 'post'
}, params);