import axios, {AxiosRequestConfig} from 'axios'
import { createStore, Commit } from 'vuex'
import { arrToObj, objToArr} from './helper'

export interface ResponseType<p = {}> {
  code: number;
  message: string;
  data: p;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createAt?: string;
  fitUrl?: string;
}
export interface ColumnProps {

  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
export interface GlobalErrorProps{
  status: boolean;
  message?: string;
}
interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  // columns: ColumnProps[];
  // posts: PostProps[];
  columns: { data: ListProps<ColumnProps>; isLoaded: boolean };
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  user: UserProps;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  // commit(mutationName, data)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, isLoaded: false },
    posts: { data: {}, loadedColumns: [] },
    user: { isLogin: false }
  },
  mutations: {
    createPost(state, newPost) {
      // state.posts.push(newPost) // 注掉的是改成数组改成对象前的
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns(state, rawData) {
      // state.columns = rawData.data.list
      state.columns.data = arrToObj(rawData.data.list)
      state.columns.isLoaded = true
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    // fetchPosts(state, rawData) {
    //   state.posts.data = arrToObj(rawData.data.list)
    // },
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list)}
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost(state, { data }) {
      // state.posts = state.posts.filter(post => post._id !== data._id) // 数组时的写法
      delete state.posts.data[data._id]
    },
    updatePost(state, { data }) {
      // state.posts = state.posts.map(post => { // 数组时的写法
      //   if (post._id === data._id) {
      //     return data
      //   } else {
      //     return post
      //   }
      // })
      state.posts.data[data._id] = data
    },
    setLoading(state, status) {
      state.loading = status
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      // 每次发送请求都携带 token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser( state, rawData ) {
      state.user = { isLogin: true, ...rawData.data }
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    logout(state) {
      state.token = ''
      localStorage.remove('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // -----把下面这些较为重复的再抽离出来形成函数: getAndCommit
    // async fetchColumns({ commit }) {
    //   const { data } = await axios.get('/columns') // actions接收一个与stores实例具有相同属性和方法的context对象
    //   commit('fetchColumns',data)
    //   // axios.get('/columns').then(resp => {
    //   // commit('fetchColumns', resp.data)
    //   // })
    // },
    // async fetchColumn({ commit },  cid) {
    //   const { data } = await axios.get(`/columns/${cid}`)
    //     commit('fetchColumn', data)
    // },
    // async fetchPosts({ commit },  cid) {
    //   const { data } = await axios.get(`/columns/${cid}/posts`)
    //     commit('fetchPosts', data)
    // }
    fetchColumns({ state, commit }) {
      if (!state.columns.isLoaded) {
        return getAndCommit('/columns', 'fetchColumns', commit)
      }
    },
    fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit,{ method: 'get' }, cid)
      }
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({data: currentPost})
      }
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    createPost({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`,'deletePost', commit, { method: 'delete'})
    },
    // 组合 action
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })    
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      // return state.columns.find(c => c._id === id) // 数组时的写法
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      // return state.posts.filter(post => post.column === cid)
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})

export default store