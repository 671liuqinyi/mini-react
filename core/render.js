export function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type)
  // 给组件添加属性
  Object.keys(element.props)
    .filter((key) => key !== "children")
    .forEach((key) => (dom[key] = element.props[key]))
  // 递归生成子组件
  element.props.children.forEach((child) => render(child, dom))
  container.append(dom)
}
