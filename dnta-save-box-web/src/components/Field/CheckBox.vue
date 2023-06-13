<template>
    <div class="check-box">

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

</script>

<style lang="less" scoped>
.check-box {
    --check-box-size: 30px;
    width: var(--check-box-size);
    height: var(--check-box-size);
    position: absolute;
    top: calc(0 - var(--check-box-size));
    height: calc(0 - var(--check-box-size));
    background-color: #fff;
    box-shadow: 0 0 16px var(--shadow-dark);
    border-radius: var(--check-box-size);
}
</style>
