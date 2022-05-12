import "../css/popup.css"

// send message to background.js
chrome.runtime.sendMessage(
  {
    type: "getEmotions",
  },
  function (response) {
    const emotions = response.message.emotions
    const happy = emotions.happy
    const sad = emotions.sad
    const neutral = emotions.neutral
    const happyCount = happy.count
    const sadCount = sad.count
    const neutralCount = neutral.count
    const happyPercentage =
      (happyCount / (happyCount + sadCount + neutralCount)) * 100 || 0
    const sadPercentage =
      (sadCount / (happyCount + sadCount + neutralCount)) * 100 || 0
    const neutralPercentage =
      (neutralCount / (happyCount + sadCount + neutralCount)) * 100 || 0
    const happyHtml = `<div class="emotion-happy">
        <img width="20" height="20" src="${happy.URL}" alt="happy" />
        <br/>
        <small>${happyCount}</small>
        <br/
        <small>${happyPercentage.toFixed(2)}%</small>
    </div>`

    const sadHtml = `<div class="emotion-sad">
        <img width="20" height="20" src="${sad.URL}" alt="sad" />
        <br/
        <small>${sadCount}</small>
        <br/
        <small>${sadPercentage.toFixed(2)}%</small>
    </div>`

    const neutralHtml = `<div class="emotion-neutral">
        <img width="20" height="20" src="${neutral.URL}" alt="neutral" />
        <br/
        <small>${neutralCount}</small>
        <br/
        <small>${neutralPercentage.toFixed(2)}%</small>
    </div>`
    const html = `
    <p>Today's stats</p>
    <div class="emotions">
        ${happyHtml}
        ${neutralHtml}
        ${sadHtml}
    </div>`
    document.querySelector(".right").innerHTML = html
  }
)
