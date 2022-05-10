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
      message: Storage.emotions,
    })
  }
})

// chrome.runtime.onInstalled.addListener(function (info) {
//   console.log("First install", info)
// })
