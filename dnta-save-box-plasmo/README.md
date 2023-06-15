# DNTA BOX 插件
## 简介

* 🍯 收藏图片会下载到本地(🍬emmm 因为其它的工具只存地址然后图片可能会失效还有被防外链所以才做的这个🍭)
* 🍮 使用 [plasmoHQ](https://github.com/PlasmoHQ/plasmo) 开发
* 🍔 只调试了`Chrome`浏览器
* 🍟 引入了MUI导致打包出来有点大😢😢😢，但是不想再改了
* 🌭 ~~略显诡异的画风(bushi~~

## 使用

1. 进入`dnta-save-box-plasmo`目录打包插件

    ```shell
    cd ./dnta-save-box-plasmo
    pnpm install
    pnpm build
    ```
2. 浏览器加载已解压扩展(build目录下chrome-mv3-prod)
3. 在页面右键，就能看到收藏选项
4. 目前选择文本会收藏为文本，图片元素上会收藏图片(如果图片被禁止事件需要单独打开图片才行)，其它的会收藏为网页
5. 插件需要页面加载完才会运行
🍮🍯🥛🧃