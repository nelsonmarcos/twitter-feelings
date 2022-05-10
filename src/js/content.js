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

import emotionsCss from "../css/emotions.css"
import emotionsHtml from "../emotions.html"
//create a div
let div = document.createElement("div")
div.innerHTML = emotionsHtml
// get #happy-emotion and add hover event listener

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "getEmotions",
  },
  function (response) {
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
      try {
        // get all #twitter-feelings-wrapper
        const feelingsWrappers = Array.from(
          document.querySelectorAll("#twitter-feelings-wrapper")
        )
        if (feelingsWrappers.length > 0) {
          feelingsWrappers.forEach((wrapper) => {
            // get .emotion-happy
            const happy = wrapper.querySelector(".emotion-happy")
            // get .emotion-sad
            const sad = wrapper.querySelector(".emotion-sad")
            // get .emotion-neutral
            const neutral = wrapper.querySelector(".emotion-neutral")
            const arr = [
              {
                key: "happy",
                value: happy,
              },
              {
                key: "sad",
                value: sad,
              },
              {
                key: "neutral",
                value: neutral,
              },
            ]
            arr.forEach((item) => {
              if (!item.value) return

              if (
                item.value.classList.contains("click") ||
                item.value.classList.contains("mouseenter") ||
                item.value.classList.contains("mouseleave")
              )
                return
              item.value.addEventListener("mouseenter", () => {
                item.value.style.opacity = "1"
                arr
                  .filter((item2) => item2.key != item.key)
                  .forEach((item2) => {
                    item2.value.style.opacity = "0.5"
                  })
              })
              item.value.addEventListener("mouseleave", () => {
                arr.forEach((item2) => {
                  item2.value.style.opacity = "1"
                })
              })
              item.value.addEventListener("click", () => {
                chrome.runtime.sendMessage(
                  {
                    type: "incrementEmotion",
                    emotion: item.key,
                  },
                  function (response) {
                    console.log("incrementEmotion", response)
                  }
                )
              })
              item.value.classList.add("mouseenter")
              item.value.classList.add("mouseleave")
              item.value.classList.add("click")
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
    }, 1000)
  }
)
