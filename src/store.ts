import axios, {AxiosRequestConfig} from 'axios'
import { createStore, Commit} from 'vuex'

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
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
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
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = {method: 'get'}) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
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
      state.posts = rawData.data.list
    },
    fetchPost(state, rawData) {
      state.posts = [rawData.data]
    },
    deletePost(state, { data }) {
      state.posts = state.posts.filter(post => post._id !== data._id)
    },
    updatePost(state, { data }) {
      state.posts = state.posts.map(post => {
        if (post._id === data._id) {
          return data
        } else {
          return post
        }
      })
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
    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid ) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, id) {
      return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/post/${id}`, 'updatePost', commit, {
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
      return asyncAndCommit(`/post/${id}`,'deletePost', commit, { method: 'delete'})
    },
    // 组合 action
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
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
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find(post => post._id === id)
    }
  }
})

export default store