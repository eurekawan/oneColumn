import axios from 'axios';
import { createStore } from 'vuex'

interface userProps {
  isLogin: boolean;
  name?: String;
  id?: number;
  columnId?: number;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createAt?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: userProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: [],
    user: { isLogin : true,name: 'raina', columnId: 1}
  },
  mutations: {
    login(state) {
      state.user = {...state.user, isLogin : true, name: 'raina'}
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = [rawData.data.list]
    }
  },
  actions: {
    fetchColumns(context) { // actions接收一个与stores实例具有相同属性和方法的context对象
      axios.get('/columns').then(resp => {
      context.commit('fetchColumns', resp.data)
      })
    },
    fetchColumn({ commit },  cid) {
      axios.get(`/columns/${cid}`).then(resp => {
        commit('fetchColumn', resp.data)
      })
    },
    fetchPosts({ commit },  cid) {
      axios.get(`/columns/${cid}/posts`).then(resp => {
        commit('fetchPosts', resp.data)
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    },
  }
})

export default store