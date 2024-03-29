<script lang='ts'>
import axios from 'axios'
import { defineComponent, PropType, ref, watch } from 'vue'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean; 
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null) // 在 setup 中拿到 dom 结点 ：<null | HTMLInputElement>
    // const fileStatus = ref<UploadStatus>('ready')  // 下面为修改后，因为要添加头图
    // const uploadedData = ref()
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    const uploadedData = ref(props.uploaded)
    // watch(props.uploaded, (newValue) => {
    //   // 监测异步的uploadedData;因为 props.uploaded是普通object而不是响应式对象，所以这样写会报错，修改为如下写法
    // })
    watch(()=>props.uploaded, (newValue) => {
      // 监测异步的uploadedData;因为 props.uploaded是普通object而不是响应式对象，所以这样写会报错
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return 
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file',files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then((resp) => {
          uploadedData.value = resp.data
          fileStatus.value = 'success'
          context.emit('file-uploaded',resp.data)
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
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
      uploadedData,
      triggerUpload,
      handleFileChange
    }
  }
})
</script>

<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
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