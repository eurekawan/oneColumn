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
  }
})

export default store