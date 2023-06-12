<template>
  <router-view></router-view>
</template>

<script setup></script>

<style>

html,body, #app {
  height: 100%;
  overflow-x: hidden;
}
.el-popup-parent--hidden #app, body[style="overflow: hidden;"] #app{
  filter: blur(2px);
}
</style>
