<script lang='ts'>
import axios from 'axios'
import { defineComponent, ref } from 'vue'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null) // 在 setup 中拿到 dom 结点 ：<null | HTMLInputElement>
    const fileStatus = ref<UploadStatus>('ready')
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        fileStatus.value = 'loading'
        const files = Array.from(currentTarget.files)
        const formData = new FormData()
        formData.append('file',files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then((resp) => {
          console.log(resp.data);
          fileStatus.value = 'success'
        }).catch(() => {
          fileStatus.value = 'error'
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = '' // 第一个 value 是 dom 结点，第二个 value 是 输入框的值
          }
        })
      }
    }
    return {
      fileInput,
      fileStatus,
      triggerUpload,
      handleFileChange
    }
  }
})
</script>

<template>
  <div class="file-upload">
    <button class="btn btn-primary" @click.prevent="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传...</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else>点击上传</span>
    </button>
    <!-- d-none 即 display: none -->
    <input 
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >
  </div>
</template>

<style></style>