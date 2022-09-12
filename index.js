import { createElement } from "./core/index.js"
const root = createElement(
  "h1",
  { name: "title", age: 18 },
  createElement("a"),
  "hello world"
)
console.log(`root`, root)
