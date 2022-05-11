/**
 * @author Uğur Kellecioğlu <ugur.kellecioglu@outlook.com>
 */

/**
 * @class Emotion
 * @param {string} emotion - The emotion name
 */
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
