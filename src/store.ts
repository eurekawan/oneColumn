import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
interface userProps {
  isLogin: boolean;
  name?: String;
  id?: number;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: userProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: false}
  },
  mutations: {
    login(state) {
      state.user = {...state.user, isLogin : true,name: 'raina'}
    }
  },
  getters: {
    getColumnById: (state) => (id: number) => {
      return state.columns.find(c => c.id === id)
    },
    getColumnByCid: (state) => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid)
    },
  }
})

export default store