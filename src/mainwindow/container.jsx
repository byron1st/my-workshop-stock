/*global document*/

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'
import path from 'path'
import fs from 'fs'

import store from './flux/store.main'
import dispatcher from '../util/flux/dispatcher'
import initActions, {INITIALIZE_STORE} from './flux/actions'
import * as ch from '../util/ipc.channels'

import Window from './components/window'

class Container extends Component {
  constructor () {
    super()
    this.state = {}
    this.text = {}
  }
  componentWillMount () {
    initActions()
    store.addChangeListener(this._updateState.bind(this))
    dispatcher.dispatch(INITIALIZE_STORE, {
      productList: remote.getCurrentWindow().productList,
      eventList: remote.getCurrentWindow().eventList,
      locale: remote.getCurrentWindow().initLocale
    })
    this.text = this._loadLocale(remote.getCurrentWindow().initLocale)
  }
  componentWillUpdate(_, nextState) {
    if (nextState.locale !== this.state.locale) {
      this.text = this._loadLocale(nextState.locale)
    }
  }
  render () {
    console.log(this.state)
    return (
      <Window store={this.state} text={this.text}/>
    )
  }
  _updateState () {
    this.setState(store.getData())
  }
  _loadLocale (locale) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '/../../../locales', locale + '.json')))
  }
}

ipcRenderer.on(ch.EXIT, () => {
  remote.dialog.showMessageBox({
    type: 'question',
    buttons: ['OK', 'Cancel'],
    defaultId: 1,
    message: 'Will you quit the program?',
    cancelId: 1
  }, index => {
    if (index === 0) {
      let storeData = store.getData()
      ipcRenderer.send(ch.EXIT_CONFIRMED, {
        product: storeData.productList,
        event: storeData.eventList
      })
    }
  })
})
ReactDOM.render(<Container />, document.getElementById('react-container'))