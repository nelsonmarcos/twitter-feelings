import "../img/icon-128.png"
import "../img/icon-34.png"
import "../img/happy.png"
import "../img/sad.png"
import "../img/neutral.png"
import Storage from "./background/Storage"
import Emotion from "./background/Emotion"
Storage = new Storage()

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
  } else if (request.type === "incrementEmotionWithId") {
    const emotion = request.emotion
    const id = request.id

    Storage.incrementEmotionWithId(emotion, id)
    sendResponse({
      type: "incrementEmotionWithId",
      message: Storage.status,
    })
  } else if (request.type === "decrementEmotionWithId") {
    const emotion = request.emotion
    const id = request.id

    Storage.decrementEmotionWithId(emotion, id)
    sendResponse({
      type: "decrementEmotionWithId",
      message: Storage.status,
    })
  }
})

// chrome.runtime.onInstalled.addListener(function (info) {
//   console.log("First install", info)
// })

chrome.runtime.onInstalled.addListener(function () {
  console.log("First install")
  // every day at 12 am reset the storage
  chrome.alarms.create("resetStorage", {
    when: new Date().setHours(12, 0, 0, 0),
    periodInMinutes: 1440,
  })

  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "resetStorage") {
      Storage.resetStorage()
    }
  })

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
    if (changeInfo.status === "complete") {
      chrome.tabs.sendMessage(tabId, {
        message: "TabUpdated",
        status: Storage.status,
      })
    }
  })
})

console.log("background script now running")
