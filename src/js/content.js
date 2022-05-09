console.log("hello from conent")

// get message from background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content.js", request)
  sendResponse({
    message: "hello from content.js",
  })
})

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "content",
    message: "hello from content",
  },
  function (response) {
    console.log("content.js", response)
  }
)
