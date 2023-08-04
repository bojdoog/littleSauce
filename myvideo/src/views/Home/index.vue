<template>
    <div class="home">
        <videos />
    </div>
</template>

<script lang="ts">
    import videos from "./components/videos.vue";
    export default {
        components: {
            videos,
        },
    };
</script>

<style lang="scss" scoped>
    .home {
    }
</style>