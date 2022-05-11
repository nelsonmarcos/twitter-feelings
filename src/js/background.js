import "../img/icon-128.png"
import "../img/icon-34.png"
import "../img/happy.png"
import "../img/sad.png"
import "../img/neutral.png"
import Storage from "./background/Storage"
import Emotion from "./background/Emotion"
Storage = new Storage()

/**
 * @author Uğur Kellecioğlu <ugur.kellecioglu@outlook.com>
 */

// get message from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
    Storage.set()
    Storage.findStatus()
    sendResponse({
      type: "incrementEmotionWithId",
      message: Storage.status,
      ids: Storage.ids,
    })
  } else if (request.type === "decrementEmotionWithId") {
    const emotion = request.emotion
    const id = request.id

    Storage.decrementEmotionWithId(emotion, id)
    Storage.set()
    Storage.findStatus()
    sendResponse({
      type: "decrementEmotionWithId",
      message: Storage.status,
      ids: Storage.ids,
    })
  }
})

chrome.runtime.onInstalled.addListener(function () {
  // first time install
  // every day at 12 am reset the storage
  chrome.alarms.create("resetStorage", {
    when: new Date().setHours(24, 0, 0, 0),
  })

  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "resetStorage") {
      console.log("Reset storage", new Date().toLocaleString())
      Storage.resetStorage()
    }
  })

  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
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
    },
    { urls: ["<all_urls>"] },
    []
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
