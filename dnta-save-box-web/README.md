# DNTA BOX 收藏页面

## 简介

* 收藏内容的管理页面
* 删除、移动、排序、修改之类的功能
* 加入隐藏功能，收藏夹和收藏内容都可以切换隐藏(切换`NSFW`的选项)
* 查看隐藏内容方式是点击一下你的头像，出现边框即开启
* 图片会存储在`服务端根目录/download/image/`下，没有的话先建一个吧
* 魔法棒图标是重设排序字段权重用的(不会重置排序)

* 视频的话，emmm, 不支持视频收藏。这个是看本地视频的...
* 具体作用是：
    1. 视频下载到`服务端根目录/download/video/source`下
    2. 点视频页右边的 ↓ 图标。
    3. 服务端会截取视频封面，挪动位置然后输出到 `服务端根目录/download/video/result`这里
    4. 再刷新页面就能看到了
    5. 视频默认隐藏
    6. 服务端需要`ffmpeg`


## 使用

1. 进入`dnta-save-box-plasmo`目录打包项目

    ```shell
    cd ./dnta-save-box-web

    yarn

    yarn build
    ```
2. 自己部署
