<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup() {
    // 不用在 index.html 中添加 <div id="back"></div> 了
    // const node = document.createElement('div')
    // node.id = 'back'
    // document.body.appendChild(node)
    // onUnmounted(() => {
    //   document.body.removeChild(node)
    // })
    useDOMCreate('back')
  }
})
</script>

<template>
<!-- 任意传送门 teleport，使其与<div id="app"></div>同级 -->
<teleport to="#back">
  <div
    class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
    :style="{ backgroundColor: background || ''}"
  >
    <div class="loading-content">
      <div class="spinner-border text-primary" role="status">
        <!-- <span class="sr-only">{{ text || 'loading'}}</span> -->
      </div>
      <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
  </div>
  </teleport>
</template>

<style>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>