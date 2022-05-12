import Emotion from "./Emotion"

/**
 * @author Uğur Kellecioğlu <ugur.kellecioglu@outlook.com>
 */

/**
 * @class Storage
 */
class Storage {
  constructor() {
    this.emotions = {
      happy: new Emotion("happy"),
      sad: new Emotion("sad"),
      neutral: new Emotion("neutral"),
    }
    this.ids = {}
    this.status = "Twitter makes you feel neutral"
    // set them chrome storage local
    this.set()
  }
  /**
   * @memberof Storage
   * @description Set the storage to chrome storage local
   */
  set() {
    chrome.storage.local.set({
      emotions: this.emotions,
      status: this.status,
      ids: this.ids,
    })
  }

  /**
   * @memberof Storage
   * @description Find how twitter make you feel
   */
  findStatus() {
    const arr = Object.values(this.emotions) // get the values of the emotions
    const max = arr.reduce((a, b) => {
      // get the max value
      return a.count > b.count
        ? a
        : a.count === b.count
        ? this.emotions.neutral
        : b
    })
    this.status = `Twitter makes you feel ${max.emotion}`
    this.set()
  }
  /**
   * @param {String} emotion - The emotion name
   * @param {String} id - The tweet id
   * @memberof Storage
   * @description Increment the emotion count with the id
   */
  incrementEmotionWithId(emotion, id) {
    this.emotions[emotion].increment()
    this.ids[id] = emotion
  }
  /**
   * @param {*} emotion - The emotion name
   * @param {*} id - The tweet id
   * @memberof Storage
   * @description Decrement the emotion count with the id
   */
  decrementEmotionWithId(emotion, id) {
    const current = this.ids[id] // get the current emotion
    this.emotions[current].decrement() // decrement the current emotion
    if (this.emotions[emotion].count === 0) {
      delete this.ids[id] // delete the id from the ids
    } else {
      this.ids[id] = emotion // set the new emotion
    }
  }

  /**
   * @memberof Storage
   * @description Reset the storage
   */
  resetStorage() {
    this.emotions = {
      happy: new Emotion("happy"),
      sad: new Emotion("sad"),
      neutral: new Emotion("neutral"),
    }
    this.ids = {}
    this.status = "Twitter makes you feel neutral"
    this.set()
  }
}

export default Storage
