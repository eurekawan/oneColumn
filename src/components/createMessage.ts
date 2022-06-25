import { createApp, h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'
// 用函数创建组件-----------
// const createMessage = (message: string, type: MessageType,timeout = 2000) => {
//   const messageInstance = createApp(Message, { // 两个对象，一个是组件 Message，一个是组件的props
//     message,
//     type
//   })
  // const mountNode = document.createElement('div')
  // document.body.appendChild(mountNode)
  // messageInstance.mount(mountNode) // messageInstance方法怪载到mountNode上
  // setTimeout(() => {
  //   messageInstance.unmount() // 挂载多久后会被卸载
  //   document.body.removeChild(mountNode)
  // }, timeout)

   // 用 h 改造----------------
  const createMessage = (message: string, type: MessageType,timeout?: number) => {
    const messageVnode = h(Message, { // 两个对象，一个是组件 Message，一个是组件的props
      message,
      type
    })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVnode, mountNode)
  const destory = () => { // 除定时外，还希望 实例调用方法清除
    render(null, mountNode)
    document.body.removeChild(mountNode)
  }
  if (timeout) {
  setTimeout(() => {
    destory()
  }, timeout)
  }
  return {
    destory
  }
}

export default createMessage