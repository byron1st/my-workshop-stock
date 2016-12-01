'use strict'

class Dispatcher {
  constructor () {
    this.callbacks = {}
  }

  /**
   * register - register a callback to be dispatched
   *
   * @param  {string} key
   * @param  {func} callback
   */
  register (key, callback) {
    this.callbacks[key] = callback
  }

  /**
   * dispatch - dispatch a callback with the argument
   *
   * @param  {type} key
   * @param  {type} argument
   */
  dispatch (key, argument) {
    this.callbacks[key](argument)
  }
}

export default new Dispatcher()
