<template>
  <router-view></router-view>
</template>

<script setup></script>

<style>
@import url('@/assets/styles/common.less');
@import url('@/assets/styles/theme.less');
html,body, #app {
  height: 100%;
  overflow-x: hidden;
}
.el-popup-parent--hidden #app, body[style="overflow: hidden;"] #app{
  filter: blur(2px);
}
</style>
