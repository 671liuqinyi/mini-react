// 根据fiber创建dom
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);
  // 给组件添加属性
  Object.keys(fiber.props)
    .filter((key) => key !== "children")
    .forEach((key) => (dom[key] = fiber.props[key]));
  return dom;
}

// 下一个要执行的任务
let nextUnitOfWork = null;
// fiber树的根(work in progress Root)
let wipRoot = null;
// 创建初始任务
export function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: { children: [element] },
  };
  wipRoot = nextUnitOfWork;
}

/* 生成虚拟dom方法  
  1.递归生成子组件(react15的做法，无法中止递归，效率较低)
  element.props.children.forEach((child) => render(child, dom))
  2.并行渲染，render过程可以被中断
  使用requestIdleCallback模拟react的并行渲染,react实际使用的是自己的scheduler库
*/
function workLoop(deadline) {
  console.log("work loop");
  // 是否应该交出执行权
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 获得下一个要执行的任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 当剩余时间小于1ms代表需要交出执行权
    // console.log('rest time',deadline.timeRemaining())
    shouldYield = deadline.timeRemaining() < 1;
  }
  // commit 修改
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
    console.log("commit Root");
  }
  // 当浏览器有时间时再执行
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

// 执行单元任务
function performUnitOfWork(fiber) {
  // console.log(`fiber`, fiber)
  // 如果当前fiber没有dom，生成一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  let prevSibling = null;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const newFiber = {
      type: element.type,
      dom: null,
      props: element.props,
      parent: fiber,
    };
    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }

  // 如果当前fiber有孩子节点，下一次肯定直接执行孩子节点，直接返回
  if (fiber.child) {
    return fiber.child;
  }
  // 寻找当前fiber的sibling节点,然后返回
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
// 全部dom遍历完调用
function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}
// 递归执行单个任务
function commitWork(fiber) {
  fiber.parent.dom.appendChild(fiber.dom);
  fiber.child && commitWork(fiber.child);
  fiber.sibling && commitWork(fiber.sibling);
}
