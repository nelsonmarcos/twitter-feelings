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
    console.log(
      "🚀 ~ file: Storage.js ~ line 22 ~ Storage ~ incrementEmotion ~ emotion",
      emotion
    )
    this.emotions[emotion].increment()
    this.set()
    this.findStatus()
  }
  decrementEmotion(emotion) {
    console.log(
      "🚀 ~ file: Storage.js ~ line 28 ~ Storage ~ decrementEmotion ~ emotion",
      emotion
    )
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
    console.log(
      "🚀 ~ file: Storage.js ~ line 39 ~ Storage ~ findStatus ~ this.status",
      this.status
    )
    this.set()
  }
  incrementEmotionWithId(emotion, id) {
    console.log(
      "🚀 ~ file: Storage.js ~ line 43 ~ Storage ~ incrementEmotionWithId ~ emotion, id",
      emotion,
      id
    )
    this.emotions[emotion].increment()
    this.ids[id] = emotion

    this.set()
    this.findStatus()
  }
}

export default Storage
