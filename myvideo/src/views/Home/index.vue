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
  padding: 50px 0 0 50px;
}
</style>