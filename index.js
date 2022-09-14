import { createElement, render } from "./core/index.js";
let text = "123";
const element = createElement(
  "div",
  { name: "title", age: 18, style: "background:skyblue" },
  text,
  createElement(
    "section",
    {},
    createElement("input", {
      value: text,
      onchange: (e) => {
        renderer(e.target.value);
      },
    })
  )
);
const container = document.querySelector("#root");

function renderer(value) {
  text = value;
  render(element, container);
}
renderer();
// console.log(`element`, element);
