/*global document*/

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'

import store from './flux/store.main'
import dispatcher from '../util/flux/dispatcher'
import initActions, {INITIALIZE_STORE} from './flux/actions'
import * as ch from '../util/ipc.channels'

import Window from './components/window'

class Container extends Component {
  constructor () {
    super()
    this.state = {}
  }
  componentWillMount () {
    initActions()
    store.addChangeListener(this._updateState.bind(this))
    dispatcher.dispatch(INITIALIZE_STORE, {
      productList: remote.getCurrentWindow().productList,
      eventList: remote.getCurrentWindow().eventList
    })
  }
  render () {
    console.log(this.state)
    return (
      <Window store={this.state}/>
    )
  }
  _updateState () {
    this.setState(store.getData())
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
      ipcRenderer.send(ch.EXIT_CONFIRMED)
    }
  })
})
ReactDOM.render(<Container />, document.getElementById('react-container'))