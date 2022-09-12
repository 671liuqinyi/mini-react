import { createElement, render } from "./core/index.js"

const element = createElement(
  "h1",
  { name: "title", age: 18, style: "background:skyblue" },
  createElement("a", { href: "https://www.bilibili.com" }, "bilibili"),
  "hello world"
)
// console.log(`element`, element)
const container = document.querySelector("#root")
render(element, container)
