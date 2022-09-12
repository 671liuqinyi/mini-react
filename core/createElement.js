// 模拟React.createElement方法

export default function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  }
}

// 创建文本节点对象，方便统一处理
function createTextNode(child) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: child,
      children: [],
    },
  }
}
