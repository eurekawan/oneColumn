<script lang='ts'>
import { defineComponent,computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ColumnProps, GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
import { addColumnAvatar } from '../helper'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id // +可以让string转化为number
    // const column = testData.find(c => c.id === currentId)
    // const list = testPosts.filter(post => post.columnId === currentId)

    // const column = computed(() => store.state.columns.find(c => c.id === currentId))
    // const list = computed(() => store.state.posts.filter(post => post.columnId === currentId))
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    }) 

    const total = computed(() => store.state.posts.total)
    const currentPage = computed(() => store.state.posts.currentPage)
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { cid: currentId,params:{ pageSize: 3 }})
    })

    const list = computed(() => store.getters.getPostsByCid(currentId))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts',total, {pageSize: 3, currentPage: (currentPage.value?currentPage.value+1:2) })
    return {
      column,
      list,
      isLastPage,
      loadMorePage
    }
  }
})
</script>

<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border border-light my-3">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button 
    class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
    @click="loadMorePage"
    v-if="!isLastPage"
    >
    </button> 
  </div>
</template>

<style scoped>
.column-detail-page img {
  width: 150px;
  height: 150px;
}
</style>