import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
interface userProps {
  isLogin: boolean;
  name?: String;
  id?: number;
  columnId?: number;
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
    user: { isLogin: true}
  },
  mutations: {
    login(state) {
      state.user = {...state.user, isLogin : true,name: 'raina', columnId: 1}
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
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