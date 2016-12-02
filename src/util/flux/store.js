'use strict'

import EventEmitter from 'events'

const CHANGE_EVENT = 'change-event'

export default class Store extends EventEmitter {
  constructor (storeData) {
    super()
    this.data = storeData
  }

  getData () {
    return this.data.toJS()
  }

  setData (store) {
    this.data = this.data.merge(store)
  }

  getValue (key) {
    return this.data.get(key)
  }

  getInValue (keysList) {
    return this.data.getIn(keysList)
  }

  setValue (key, value) {
    this.data = this.data.set(key, value)
  }

  setInValue (keysList, value) {
    this.data = this.data.setIn(keysList, value)
  }

  emitChange () {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback)
  }
}
