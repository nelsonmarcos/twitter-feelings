import emotionsHtml from "../emotions.html"
import statusHtml from "../status.html"
import "../css/emotions.css"
import "../css/status.css"
//create a div

let statusDiv = document.createElement("div")
statusDiv.innerHTML = statusHtml

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "getEmotions",
  },
  function (response) {
    let div = document.createElement("div")
    div.innerHTML = emotionsHtml
    const emotions = response.message.emotions
    div.querySelector("#happy-emotion").src = emotions.happy.URL
    div.querySelector("#neutral-emotion").src = emotions.neutral.URL
    div.querySelector("#sad-emotion").src = emotions.sad.URL
    var ids = response.message.ids
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
            const as = wrapper.parentElement.querySelectorAll("a")
            const a = Array.from(as).find((item) =>
              item.href.includes("/status/")
            )
            var url = ""
            if (a) {
              url = a.href.split("status/")[1]
              if (url.includes("/")) {
                wrapper.classList.add(url.split("/")[0])
              } else {
                wrapper.classList.add(url)
              }
            }

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
                      removeStatus()
                      injectStatus(response.message)
                      ids = response.ids
                    }
                  )
                } else {
                  item.value.classList.remove("passive")
                  item.value.classList.add("active")
                  const as =
                    item.value.parentElement.parentElement.querySelectorAll(
                      "article a"
                    )
                  let a = Array.from(as).find((item) =>
                    item.href.includes("/status/")
                  )
                  if (a.href.split("status/")[1].includes("/"))
                    a = a.href.split("status/")[1].split("/")[0]
                  else a = a.href.split("status/")[1]

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
                            id: a,
                          },
                          function (response) {
                            ids = response.ids
                            removeStatus()
                            injectStatus(response.message)
                          }
                        )
                      }
                    }
                  })
                  chrome.runtime.sendMessage(
                    {
                      type: "incrementEmotionWithId",
                      emotion: item.key,
                      id: a,
                    },
                    function (response) {
                      ids = response.ids
                      removeStatus()
                      injectStatus(response.message)
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
        console.log(error + "" + error.stack + "" + error.message)
      }
    }, 1000)
  }
)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "TabUpdated") {
    try {
      document.querySelector(".twitter-feelings-status-wrapper").remove()
    } catch (error) {}
    removeStatus()
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
  if (document.querySelector(".twitter-feelings-status-wrapper")) return
  const wrapper = await _waitForElement(
    `[data-testid="primaryColumn"] > div > div`
  )
  const h2 = wrapper.querySelector(`[role="heading"]`)
  statusDiv.querySelector("#twitter-feelings-status").innerHTML = status
  if (h2) {
    // for profiles, dashboard
    statusDiv.querySelector(
      ".twitter-feelings-status-wrapper"
    ).style.marginTop = "0"
    h2.insertAdjacentHTML("beforebegin", statusDiv.innerHTML)
  } else {
    // for explore
    statusDiv.querySelector(
      ".twitter-feelings-status-wrapper"
    ).style.marginTop = "3rem"
    wrapper.insertAdjacentHTML("beforeend", statusDiv.innerHTML)
  }
}

const removeStatus = () => {
  Array.from(
    document.querySelectorAll(".twitter-feelings-status-wrapper")
  ).forEach((i) => i.remove())
}
