<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ResponseType, ImageProps } from '../store'
import ColumnList from '../components/ColumnList.vue'
import useLoadMore from '../hooks/useLoadMore'
// import Uploader from '../components/Uploader.vue'
// import createMessage from '../components/createMessage'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList,
    // Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage )
    onMounted(() => {
      store.dispatch('fetchColumns',{ pageSize: 3})
    })
    // const list = computed(() => store.state.columns) // 数组时的写法
    const list = computed(() => store.getters.getColumns) // 数组时的写法
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns',total, {pageSize: 3, currentPage: (currentPage.value?currentPage.value+1:2) })
    // const beforeUpload = (file: File) => {
    //   const isJPG = file.type === 'image/jpeg'
    //   if (!isJPG) {
    //     createMessage('上传图片只能是 JPG 格式', 'error')
    //   }
    //   return isJPG
    // }
    // const onFileUPloaded = (rawData: ResponseType<ImageProps>) => {
    //   createMessage(`上传图片ID ${rawData.data._id}`,'success',2000)
    // }
    return {
      list,
      loadMorePage,
      isLastPage
      // beforeUpload,
      // onFileUPloaded
    }
  }
})
</script>

<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
      <!-- note:测试 Uploader 组件
    <uploader action="/upload" :beforeUpload="beforeUpload" @file-uploaded="onFileUPloaded">
      note:slot 父组件取得子组件的值
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" width="500">
      </template>
    </uploader> -->
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button 
    class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
    @click="loadMorePage"
    v-if="!isLastPage"
    >
    加载更多
    </button>
  </div>
</template>