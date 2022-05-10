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
import statusHtml from "../status.html"

//create a div
let div = document.createElement("div")
div.innerHTML = emotionsHtml

let statusDiv = document.createElement("div")
statusDiv.innerHTML = statusHtml

// get #happy-emotion and add hover event listener

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "getEmotions",
  },
  function (response) {
    const status = response.message.status
    statusDiv.querySelector("#twitter-feelings-status").innerHTML = status
    console.log("content.js", statusDiv)
    console.log("timer")
    setTimeout(() => {
      const h2s = document.querySelector(
        '[role="heading"] > span'
      ).parentElement
      console.log(h2s)
      h2s.insertAdjacentHTML("beforebegin", statusDiv.innerHTML)
    }, 10000)

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
                const bool = arr.find((item) =>
                  item.value.classList.contains("active")
                )
                if (bool) return
                arr
                  .filter((item2) => item2.key != item.key)
                  .forEach((item2) => {
                    item2.value.classList.add("passive")
                  })
              })
              item.value.addEventListener("mouseleave", () => {
                const bool = arr.find((item) =>
                  item.value.classList.contains("active")
                )
                if (bool) return
                arr.forEach((item2) => {
                  item2.value.classList.remove("passive")
                })
              })
              item.value.addEventListener("click", () => {
                if (item.value.classList.contains("active")) {
                  item.value.classList.remove("active")
                  chrome.runtime.sendMessage(
                    {
                      type: "decrementEmotion",
                      emotion: item.key,
                    },
                    function (response) {
                      console.log("content.js", response)
                      document.querySelector(
                        "#twitter-feelings-status"
                      ).innerText = response.message // TODO: status should be updated
                    }
                  )
                } else {
                  item.value.classList.remove("passive")
                  item.value.classList.add("active")
                  chrome.runtime.sendMessage(
                    {
                      type: "incrementEmotion",
                      emotion: item.key,
                    },
                    function (response) {
                      console.log("incrementEmotionfdfd", response)
                      document.querySelector(
                        "#twitter-feelings-status"
                      ).innerText = response.message // TODO: status should be updated
                    }
                  )
                }

                arr.forEach((item2) => {
                  if (item2.key != item.key) {
                    if (item2.value.classList.contains("active")) {
                      //send message to decrement emotion
                      item2.value.classList.remove("active")
                      item2.value.classList.add("passive")
                      chrome.runtime.sendMessage(
                        {
                          type: "decrementEmotion",
                          emotion: item2.key,
                        },
                        function (response) {
                          console.log("decremented", response)
                          document.querySelector(
                            "#twitter-feelings-status"
                          ).innerText = response.message // TODO: status should be updated
                        }
                      )
                    }
                  }
                })
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
