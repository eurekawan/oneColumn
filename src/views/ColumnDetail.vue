<script lang='ts'>
import { defineComponent,computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'

export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = +route.params.id // +可以让String转化为Number
    // const column = testData.find(c => c.id === currentId)
    // const list = testPosts.filter(post => post.columnId === currentId)

    // const column = computed(() => store.state.columns.find(c => c.id === currentId))
    // const list = computed(() => store.state.posts.filter(post => post.columnId === currentId))
    const column = computed(() => store.getters.getColumnById(currentId))
    const list = computed(() => store.getters.getColumnByCid(currentId))
    return {
      column,
      list
    }
  }
})
</script>

<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column.title" class="rounded-circle border ">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<style></style>