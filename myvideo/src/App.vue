<template>
    <router-view />
</template>

<style lang="scss">
    :root {
        --bgcolor: red;
    }
    html,
    body {
        // 全局 不能被用户选中
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        margin: 0;
        padding: 0;
    }
</style>
