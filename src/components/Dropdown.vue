<script lang='ts'>
import { defineComponent, ref, watch} from 'vue'
import useClickOutside from '../hooks/useClickOutside'

export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false)
    const dropdownRdef=ref<null| HTMLElement>(null)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    const isClickOutside = useClickOutside(dropdownRdef)
    // const handler = (e: MouseEvent) => {
    //   if (dropdownRdef.value) {
    //     if (!dropdownRdef.value.contains(e.target as HTMLElement) && isOpen.value) {
    //       isOpen.value = false
    //     }
    //   }
    // }
    // onMounted(() => {
    //   document.addEventListener('click',handler)
    // })
    // onUnmounted(() => {
    //   document.removeEventListener('click',handler)
    // })
    watch(isClickOutside,() => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRdef
    }
  }
})
</script>

<template>
<div class="dropdown" ref="dropdownRdef">
  <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
    {{title}}
  </a>
  <ul class="dropdown-menu" :style="{display:'block'}" v-if="isOpen">
    <slot></slot>
  </ul>
</div>
</template>

<style></style>

