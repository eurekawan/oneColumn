<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
// import { PostProps } from '../testData'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const uploadedData = ref()
    const titleVal = ref('')
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const store = useStore<GlobalDataProps>()
    let imageId = ''
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = {data: currentPost.image}
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id,
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'creatPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push( {name: 'column', params: {id: column}})
            }, 2000)
          })
          // store.commit('createPost', newPost)
          // router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/jpeg'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片不能超过 1Mb', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode
    }
  }
})
</script>

<template>
  <div class="create-post-page">
    <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
    <uploader action="/upload"
    :beforeUpload = "uploadCheck"
    @file-uploaded="handleFileUploaded"
    :uploaded="uploadedData"
    class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" alt="">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode ? '更新文章' : '发表文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<style>
/* scoped 难以作用到slot */
  .create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
    background: #000;
  }
  .create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>