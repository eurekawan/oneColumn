import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
  currentPage: number;
  pageSize: number;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>,
params: LoadParams={currentPage: 2, pageSize: 5}) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  // ----------👇下面这样写无法获得响应式对象的最新值 currentPage.value 是常量2 => 要用计算属性
  // const requstParams = { // 发送请求时用到的参数
  //   currentPage: currentPage.value,
  //   pageSize:params.pageSize
  // }
  // ----------👇使用计算属性获得响应式对象的最新之
  const requstParams =  computed(() => ({ // 发送请求时用到的参数
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requstParams.value).then(() => {
      currentPage.value++ // 下次请求时页面加 1
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value/ params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore