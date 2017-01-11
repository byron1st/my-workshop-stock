/*global document*/

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'
import path from 'path'
import fs from 'fs'

import dataStore from './flux/store.data'
import uiStore from './flux/store.ui'
import dispatcher from '../util/flux/dispatcher'
import initActions, {INITIALIZE_STORE} from './flux/actions'
import * as ch from '../util/ipc.channels'

import Window from './components/window'

const BACKUP_TIME_INTERVAL = 5 * 60 * 1000

class Container extends Component {
  constructor () {
    super()
    this.state = {}
    this.text = {}
  }
  componentWillMount () {
    initActions()
    dataStore.addChangeListener(() => this._updateState('data'))
    uiStore.addChangeListener(() => this._updateState('ui'))
    dispatcher.dispatch(INITIALIZE_STORE, {
      initStore: remote.getCurrentWindow().initStore,
      locale: remote.getCurrentWindow().initLocale
    })

    this.text = this._loadLocale(remote.getCurrentWindow().initLocale)
    setInterval(() => ipcRenderer.send(ch.BACKUP_DATA, this._getStoreData()), BACKUP_TIME_INTERVAL)
    ipcRenderer.on(ch.EXIT, () => {
      remote.dialog.showMessageBox({
        type: 'question',
        buttons: [this.text['OK'], this.text['Cancel']],
        defaultId: 1,
        message: this.text['Will you quit the program?'],
        cancelId: 1
      }, index => {
        if (index === 0) {
          ipcRenderer.send(ch.EXIT_CONFIRMED, this._getStoreData())
        }
      })
    })
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
  _updateState (storeKind) {
    if (storeKind === 'data') {
      this.setState({ data: dataStore.getData() })
    } else if (storeKind === 'ui') {
      this.setState({ ui: uiStore.getData() })
    }
  }
  _loadLocale (locale) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '/../../public/locales', locale + '.json')))
  }
  _getStoreData () {
    // TODO: dbRevision 값은 저장이 되지 못함.
    return dataStore.getData()
  }
}

ReactDOM.render(<Container />, document.getElementById('react-container'))