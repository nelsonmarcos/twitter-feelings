import Emotion from "./background/Emotion"

console.log("hello from conent")

import emotionsCss from "../css/emotions.css"
import emotionsHtml from "../emotions.html"
import statusHtml from "../status.html"

//create a div
let div = document.createElement("div")
div.innerHTML = emotionsHtml

let statusDiv = document.createElement("div")
statusDiv.innerHTML = statusHtml

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "getEmotions",
  },
  function (response) {
    console.log("🚀 ~ file: content.js ~ line 22 ~ response", response)
    const ids = response.message.ids
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
            if (wrapper.classList.length >= 1) return
            const as = wrapper.parentElement.querySelectorAll("a")
            const a = as[as.length - 1]
            const url = a.href.split("status/")[1].split("/")[0]
            wrapper.classList.add(url)

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

              if (
                ids[url] &&
                wrapper.classList.contains(url) &&
                item.key === ids[url]
              ) {
                item.value.classList.add("active")
                arr
                  .filter((item2) => item2.key !== item.key)
                  .forEach((item2) => {
                    item2.value.classList.remove("active")
                    item2.value.classList.add("passive")
                  })
              }
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
                      type: "decrementEmotionWithId",
                      emotion: item.key,
                      id: as[as.length - 1].href
                        .split("status/")[1]
                        .split("/")[0],
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
                  console.log(
                    "🚀 ~ file: content.js ~ line 111 ~ item.value.addEventListener ~ item",
                    item
                  )
                  const as =
                    item.value.parentElement.parentElement.querySelectorAll(
                      "article a"
                    )
                  arr.forEach((item2) => {
                    if (item2.key != item.key) {
                      if (item2.value.classList.contains("active")) {
                        //send message to decrement emotion
                        item2.value.classList.remove("active")
                        item2.value.classList.add("passive")
                        chrome.runtime.sendMessage(
                          {
                            type: "decrementEmotionWithId",
                            emotion: item.key,
                            id: as[as.length - 1].href
                              .split("status/")[1]
                              .split("/")[0],
                          },
                          function (response) {
                            document.querySelector(
                              "#twitter-feelings-status"
                            ).innerText = response.message
                          }
                        )
                      }
                    }
                  })
                  chrome.runtime.sendMessage(
                    {
                      type: "incrementEmotionWithId",
                      emotion: item.key,
                      id: as[as.length - 1].href
                        .split("status/")[1]
                        .split("/")[0],
                    },
                    function (response) {
                      document.querySelector(
                        "#twitter-feelings-status"
                      ).innerText = response.message
                    }
                  )
                }
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "TabUpdated") {
    injectStatus(request.status)
  }
  if (request.type === "update_subscriptions") {
    // get all a
    const as = Array.from(document.querySelectorAll("a"))
    as.forEach((a) => {
      if (a.href.includes("status")) {
        // console.log(a.href.split("status/")[1])
      }
    })
  }
})

function _waitForElement(selector, delay = 50, tries = 100) {
  const element = document.querySelector(selector)

  if (!window[`__${selector}`]) {
    window[`__${selector}`] = 0
    window[`__${selector}__delay`] = delay
    window[`__${selector}__tries`] = tries
  }

  function _search() {
    return new Promise((resolve) => {
      window[`__${selector}`]++
      setTimeout(resolve, window[`__${selector}__delay`])
    })
  }

  if (element === null) {
    if (window[`__${selector}`] >= window[`__${selector}__tries`]) {
      window[`__${selector}`] = 0
      return Promise.resolve(null)
    }

    return _search().then(() => _waitForElement(selector))
  } else {
    return Promise.resolve(element)
  }
}

const injectStatus = async (status) => {
  const h2s = await _waitForElement(`[role="heading"] > span`)
  const parent = h2s.parentElement
  statusDiv.querySelector("#twitter-feelings-status").innerHTML = status
  parent.insertAdjacentHTML("beforebegin", statusDiv.innerHTML)
}
