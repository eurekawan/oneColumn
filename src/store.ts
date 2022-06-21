import axios from 'axios';
import { createStore, Commit} from 'vuex'

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
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: userProps;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}
const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
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
    },
    setLoading(state, status) {
      state.loading = status
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
     async fetchColumns({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    async fetchColumn({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    async fetchPosts({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
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