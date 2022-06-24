import { onUnmounted } from "vue"

function useDOMCreate(nodeId: string) {
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
}

export default useDOMCreate