import Emotion from "./background/Emotion"

console.log("hello from conent")

// let element = document.createElement("div")
// element.innerHTML = "hello from content.js"
// document.body.appendChild(element)

// get message from background.js
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("content.jsxx", request)
//   sendResponse({
//     message: "hello from content.js",
//   })
// })

var emotions = {}
import emotionsCss from "../css/emotions.css"
import emotionsHtml from "../emotions.html"
//create a div
let div = document.createElement("div")
div.innerHTML = emotionsHtml

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "getEmotions",
  },
  function (response) {
    emotions = response.message
    setInterval(() => {
      try {
        const articles = Array.from(document.querySelectorAll("article"))
        if (articles.length > 0) {
          articles.forEach((article) => {
            if (article.parentElement.childNodes.length < 2) {
              article.style.padding = "1rem 3rem 2rem 1rem"
              article.insertAdjacentHTML("beforebegin", div.innerHTML)
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    }, 1000)
  }
)
