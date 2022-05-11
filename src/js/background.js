import "../img/icon-128.png"
import "../img/icon-34.png"
import "../img/happy.png"
import "../img/sad.png"
import "../img/neutral.png"
import Storage from "./background/Storage"
import Emotion from "./background/Emotion"
Storage = new Storage()
console.log(Storage)

// // send message to content.js
// chrome.runtime.sendMessage(
//   {
//     type: "background",
//     message: Storage.emotions,
//   },
//   function (response) {
//     console.log("background.js", response)
//   }
// )

// get message from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("background.js", request)
  if (request.type === "getEmotions") {
    sendResponse({
      type: "getEmotions",
      message: {
        emotions: Storage.emotions,
        ids: Storage.ids,
        status: Storage.status,
      },
    })
  } else if (request.type === "incrementEmotion") {
    const emotion = request.emotion
    Storage.incrementEmotion(emotion)
    sendResponse({
      type: "incrementEmotion",
      message: Storage.status,
    })
  } else if (request.type === "decrementEmotion") {
    const emotion = request.emotion
    Storage.decrementEmotion(emotion)
    sendResponse({
      type: "decrementEmotion",
      message: Storage.status,
    })
  } else if (request.type === "incrementEmotionWithId") {
    const emotion = request.emotion
    console.log("🚀 ~ file: background.js ~ line 46 ~ emotion", emotion)
    const id = request.id
    console.log("🚀 ~ file: background.js ~ line 47 ~ id", id)

    Storage.incrementEmotionWithId(emotion, id)
    sendResponse({
      type: "incrementEmotionWithId",
      message: Storage.status,
    })
  }
})

// chrome.runtime.onInstalled.addListener(function (info) {
//   console.log("First install", info)
// })

chrome.runtime.onInstalled.addListener(function () {
  // ...
  console.log("First install")
  var callback = function (details) {
    if (details.url.includes("update_subscriptions")) {
      // get tab
      chrome.tabs.get(details.tabId, function (tab) {
        // send message to content.js
        chrome.tabs.sendMessage(tab.id, {
          type: "update_subscriptions",
          message: Storage.emotions,
        })
      })
    }
  }
  var filter = { urls: ["<all_urls>"] }
  var opt_extraInfoSpec = []

  chrome.webRequest.onBeforeRequest.addListener(
    callback,
    filter,
    opt_extraInfoSpec
  )
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // changeInfo object: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#changeInfo
    // status is more reliable (in my case)
    // use "alert(JSON.stringify(changeInfo))" to check what's available and works in your case
    if (changeInfo.status === "complete") {
      chrome.tabs.sendMessage(tabId, {
        message: "TabUpdated",
        status: Storage.status,
      })
    }
  })
})

console.log("background script now running")
