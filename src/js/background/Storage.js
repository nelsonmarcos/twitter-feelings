import Emotion from "./Emotion"
class Storage {
  constructor() {
    this.emotions = {
      happy: new Emotion("happy"),
      sad: new Emotion("sad"),
      neutral: new Emotion("neutral"),
    }
    this.status = "You feel neutral"
    // set them chrome storage local
    this.set()
  }
  // add one to the count of the emotion
  add(emotion) {
    this.emotions[emotion]++
    this.calculate()
    this.set()
  }

  // get key from chrome storage local
  get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key])
      })
    })
  }

  // reset the count of all emotions
  reset() {
    this.emotions = {
      happy: 0,
      sad: 0,
      neutral: 0,
    }
    this.status = "You feel neutral"
    this.set()
  }
  // set chrome storage local with the count of all emotions
  set() {
    chrome.storage.local.set({ emotions: this.emotions })
    chrome.storage.local.set({ status: this.status })
  }

  // calculate which emotion is the most
  calculate() {
    let max = 0
    let emotion = ""
    for (let key in this.emotions) {
      if (this.emotions[key] > max) {
        max = this.emotions[key]
        emotion = key
      }
    }
    this.status = `You feel ${emotion}`
    this.set()
  }

  // get emotion from chrome storage local
  getEmotion(emotionName) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("emotions", (result) => {
        resolve(result.emotions[emotionName])
      })
    })
  }
}

export default Storage
