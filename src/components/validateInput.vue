<script lang='ts'>
import { defineComponent, reactive, PropType , onMounted, watch, computed} from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg =  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email';
  message: string;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false, // 用于禁用 Attribute 继承
  setup(props,context) {
     const inputRef = reactive({
      // val: props.modelValue || '',
       val: computed({  // 不用下面的watch了，改用计算属性
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message:''
     })
    // watch(() => props.modelValue, (newValue) => {
    //   inputRef.val = newValue || ''
    // })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break;
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    // const updateValue = (e:Event) => {  // 写了v-model就不需要了
    //   const targetValue = (e.target as HTMLInputElement).value
    //   inputRef.val = targetValue
    //   context.emit('update:modelValue',targetValue)
    // }
    onMounted(() => {
      emitter.emit('form-item-created',validateInput)
    })
    return {
      inputRef,
      validateInput,
      // updateValue
    }
  }
})
</script>

<template>
  <div class="validate-input-container pb-3">
    <!-- $attrs的用法 -->
    <input 
      v-if ="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind = "$attrs" 
    >
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind = "$attrs" 
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<style></style>