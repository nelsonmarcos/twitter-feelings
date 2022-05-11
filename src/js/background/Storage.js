import Emotion from "./Emotion"
class Storage {
  constructor() {
    this.emotions = {
      happy: new Emotion("happy"),
      sad: new Emotion("sad"),
      neutral: new Emotion("neutral"),
    }
    this.ids = {}
    this.status = "Twitter makes you neutral"
    // set them chrome storage local
    this.set()
  }
  set() {
    chrome.storage.local.set({
      emotions: this.emotions,
      status: this.status,
      ids: this.ids,
    })
  }
  incrementEmotion(emotion) {
    this.emotions[emotion].increment()
    this.set()
    this.findStatus()
  }
  decrementEmotion(emotion) {
    this.emotions[emotion].decrement()
    this.set()
    this.findStatus()
  }
  findStatus() {
    const arr = Object.values(this.emotions)
    const max = arr.reduce((a, b) => {
      return a.count > b.count ? a : b
    })
    this.status = `Twitter makes you feel ${max.emotion}`

    this.set()
  }
  incrementEmotionWithId(emotion, id) {
    this.emotions[emotion].increment()
    this.ids[id] = emotion

    this.set()
    this.findStatus()
  }
  decrementEmotionWithId(emotion, id) {
    const current = this.ids[id]
    this.emotions[current].decrement()
    if (this.emotions[emotion].count === 0) {
      delete this.ids[id]
    } else {
      this.ids[id] = emotion
    }
    this.set()
  }
}

export default Storage
