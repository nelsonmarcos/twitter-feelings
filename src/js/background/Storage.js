import Emotion from "./Emotion"
class Storage {
  constructor() {
    this.emotions = {
      happy: new Emotion("happy"),
      sad: new Emotion("sad"),
      neutral: new Emotion("neutral"),
    }
    this.status = "Twitter makes you neutral"
    // set them chrome storage local
    this.set()
  }
  set() {
    chrome.storage.local.set({
      emotions: this.emotions,
      status: this.status,
    })
  }
  incrementEmotion(emotion) {
    this.emotions[emotion].increment()
    this.set()
    this.findStatus()
    console.log("incremented", emotion)
  }
  decrementEmotion(emotion) {
    this.emotions[emotion].decrement()
    this.set()
    this.findStatus()
    console.log("decremented", emotion)
  }
  findStatus() {
    const arr = Object.values(this.emotions)
    const max = arr.reduce((a, b) => {
      return a.count > b.count ? a : b
    })
    this.status = `Twitter makes you feel ${max.emotion}`
    this.set()
    console.log("found status", this.status)
  }
}

export default Storage
