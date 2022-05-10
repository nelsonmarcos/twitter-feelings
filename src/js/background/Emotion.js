// create a class with count of number
class Emotion {
  constructor(emotion) {
    this.emotion = emotion
    this.count = 0
    this.URL = chrome.extension.getURL(`${emotion}.png`)
  }
  increment() {
    this.count++
  }
  decrement() {
    this.count--
  }
}

export default Emotion
