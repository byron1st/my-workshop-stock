/* global document */

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'

import dataStore from './flux/store.data'
import uiStore from './flux/store.ui'
import dispatcher from '../util/flux/dispatcher'
import initActions, {INITIALIZE_STORE} from './flux/actions'
import * as eventActions from './flux/actions.event'
import * as ch from '../util/ipc.channels'
import getText, {setLocale} from '../util/locale'

import Window from './components/window'

const BACKUP_TIME_INTERVAL = 5 * 60 * 1000

class Container extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentWillMount () {
    initActions()
    setLocale(remote.getCurrentWindow().initLocale)
    this._initStores()
    this._initIPC()
  }

  render () {
    console.log(this.state)
    return (
      <Window store={this.state} />
    )
  }

  _updateState (storeKind) {
    if (storeKind === 'data') {
      this.setState({ data: dataStore.getData() })
    } else if (storeKind === 'ui') {
      this.setState({ ui: uiStore.getData() })
    }
  }

  _initIPC () {
    setInterval(() => ipcRenderer.send(ch.BACKUP_DATA, this._getStoreData()), BACKUP_TIME_INTERVAL)

    ipcRenderer.on(ch.EXIT, () => {
      remote.dialog.showMessageBox({
        type: 'question',
        buttons: [getText('OK'), getText('Cancel')],
        defaultId: 1,
        message: getText('Will you quit the program?'),
        cancelId: 1
      }, index => {
        if (index === 0) {
          ipcRenderer.send(ch.EXIT_CONFIRMED, this._getStoreData())
        }
      })
    })

    ipcRenderer.on(ch.SAVE_EVENTGROUP, (event, eventGroup) => {
      dispatcher.dispatch(eventActions.ADD_EVENTGROUP, eventGroup)
    })
  }

  _initStores () {
    dataStore.addChangeListener(() => this._updateState('data'))
    uiStore.addChangeListener(() => this._updateState('ui'))

    dispatcher.dispatch(INITIALIZE_STORE, {
      initStore: remote.getCurrentWindow().initStore,
      locale: remote.getCurrentWindow().initLocale
    })
  }

  _getStoreData () {
    // TODO: dbRevision 값은 저장이 되지 못함.
    return dataStore.getData()
  }
}

ReactDOM.render(<Container />, document.getElementById('react-container'))
