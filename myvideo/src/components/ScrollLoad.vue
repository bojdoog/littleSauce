<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { request } from "@/utils/request";
import DataMatch from "@/utils/data-match";
import _ from "lodash";

const props = defineProps({
  api: {
    type: String,
    required: true,
  },
  matchData: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  perPage: {
    type: Number,
    default: 10,
  },
  load: {
    type: Function,
  },
  beforeRequest: {
    type: Function,
  },
});

const emits = defineEmits(["fetchEnd", "loadEnd"]);
const dataMatch = new DataMatch();

const scrollData = reactive<any[]>([]);
const loading = ref(false);
const noMore = ref(false);
const page = ref(1);
const firstRequestStart = ref(true);
const disabled = computed(() => {
  return loading.value || noMore.value;
});
/**
 * 请求列表数据
 */
const fetchScrollData = () => {
  let params = props.params;
  if (props.beforeRequest) {
    params = props.beforeRequest(params);
  }
  if (params === undefined) {
    return Promise.resolve();
  }
  loading.value = true;
  return request("GET", props.api, undefined, {
    ...params,
    page: page.value,
    per_page: props.perPage,
  })
    .then((res: any) => {
      loading.value = false;
      const data = dataMatch.$matchData4String(props.matchData, res);
      if (data.length === 0) {
        noMore.value = true;
        return;
      }
      scrollData.push(...data);
      if (scrollData.length === res.data.meta.total) {
        noMore.value = true;
      }
      page.value++;
      emits("fetchEnd", {
        data,
        scrollData,
        page,
      });
    })
    .finally(() => {
      emits("loadEnd", {
        scrollData,
        page,
      });
    });
};

/**
 * 清除数据
 */
const clearScrollData = () => {
  page.value = 1;
  scrollData.length = 0;
  noMore.value = false;
};

/**
 * 执行第一次请求
 */
const firstFetchScrollData = () => {
  firstRequestStart.value = true;
  clearScrollData();
  fetchScrollData().then(() => {
    firstRequestStart.value = false;
  });
};

watch(() => props.params, _.throttle(firstFetchScrollData, 500), {
  immediate: true,
});

defineExpose({
  loading,
  scrollData,
  clearScrollData,
  fetchScrollData: firstFetchScrollData,
});
</script>

<template>
  <div class="scroll-load">
    <div
      class="scroll-list"
      v-if="!firstRequestStart"
      v-infinite-scroll="fetchScrollData"
      :infinite-scroll-disabled="disabled"
    >
      <slot v-bind="{ data: scrollData, loading }"></slot>
      <slot name="loading" v-if="loading && scrollData.length > 0">
        <span>加载中 请稍后...</span>
      </slot>
      <slot name="no-more" v-if="noMore && scrollData.length > 0">
        <span>没有更多数据了</span>
      </slot>
    </div>
    <div class="scroll-skeleton" v-if="firstRequestStart">
      <slot name="skeleton"></slot>
    </div>

    <slot name="no-data" v-if="!loading && scrollData.length == 0"></slot>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.scroll-load {
  width: 100%;
  height: 100%;
  .scroll-list {
    display: flex;
    overflow: auto;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    max-height: 100%;
    line-height: normal;
    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      width: 5px;
      // border: 1px solid rgba(0, 0, 0, 0.36);
      border-radius: 2px;
      background-color: #e5e5e5;
      // box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.36);
    }
    &::-webkit-scrollbar-track {
      border-radius: 2px;
      background-color: #ffffff;
    }
  }
  .scroll-skeleton {
    display: flex;
    overflow: auto;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    max-height: 100%;
    line-height: normal;
  }
  span {
    display: inline-block;
    width: 100%;
    height: 20px;
    text-align: center;
    color: #dfdfdf;
  }
}
</style>
