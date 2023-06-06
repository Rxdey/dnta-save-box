<template>
  <div class="login">
    <div class="login-modal">
      <div class="logo">
        <img src="/32.png" alt="">
        WORLD PACK
      </div>
      <div class="login-form">

        <div class="form-wrap">
          <label class="label">账号</label>
          <div class="form-input">
            <input type="text" placeholder="请输入账号" v-model="form.userName" />
          </div>
        </div>

        <div class="form-wrap">
          <label class="label">密码</label>
          <div class="form-input">
            <input type="password" placeholder="请输入密码" v-model="form.password" />
          </div>
        </div>
        <div class="tip-wrap">
          <span class="tip">忘记密码?</span>
          <span class="tip">注册</span>
        </div>

        <div class="button-wrap">
          <el-button type="primary" round size="large" :loading="loading" @click="onLogin">登录</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import md5 from 'md5';
import Server from '@/service';
import jsCookie from 'js-cookie';
import { customStorage } from '@/utils';

const router = useRouter();
const loading = ref(false);
const form = ref({
  userName: '',
  password: ''
});

const onLogin = async () => {
  if (!form.value.userName || !form.value.password) {
    ElMessage.error('请输入账号和密码');
    return;
  }
  loading.value = true;
  const params = {
    userName: form.value.userName,
    password: md5(form.value.password).toUpperCase()
  };
  const res = await Server.LoginUsePOST(params);
  loading.value = false;
  const { msg, data, success, token } = res;
  if (!success) {
    msg && ElMessage.error(msg);
    return;
  }
  jsCookie.set('token', token);
  customStorage.setItem('userInfo', data);
  ElNotification({
    title: '登录成功',
    message: '欢迎回来',
    type: 'success',
  });
  window.postMessage({type: 'worldpack', action: 'login', token }, '/');
  router.push('/home');
}

</script>

<style lang="less">
@import url('./index.less');
</style>
