import "../img/icon-128.png"
import "../img/icon-34.png"
import Storage from "./background/Storage"

Storage = new Storage()
console.log(Storage.get("happy"))

// send message to content.js
chrome.runtime.sendMessage(
  {
    type: "background",
    message: "hello from background",
  },
  function (response) {
    console.log("background.js", response)
  }
)

// get message from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("background.js", request)
  sendResponse({
    message: "hello from background.js",
  })
})

chrome.runtime.onInstalled.addListener(function (info) {
  console.log("First install", info)
})
