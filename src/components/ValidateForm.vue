<script lang='ts'>
import { defineComponent, onUnmounted} from 'vue'
import mitt from 'mitt'
type Events = {
    'form-item-created': ValidateFunc
}
type ValidateFunc = () => boolean
export const emitter = mitt<Events>()
export default defineComponent({
  name: 'validateForm',
  emit: ['form-submit'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit',result)
    }
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
  }
  }
})
</script>

<template>
  <form class="vaildate-form-container">
    <slot name="default"></slot>
    <div class="submit_area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">登录</button>
      </slot>
    </div>
  </form>
</template>

<style></style>