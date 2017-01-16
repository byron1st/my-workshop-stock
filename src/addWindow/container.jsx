/*global document*/

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote} from 'electron'
import fs from 'fs'
import path from 'path'

import dispatcher from '../util/flux/dispatcher'
import store from './flux/store'
import * as actions from './flux/actions'

import Window from './components/window'

class Container extends Component {
  constructor () {
    super()
    this.state = {}
    this.text = {}
  }
  componentWillMount () {
    store.addChangeListener(() => this._updateState())  
    actions.initialize()
    dispatcher.dispatch(actions.INITIALIZE_STORE, remote.getCurrentWindow().productSet)
    this.text = this._loadLocale(remote.getCurrentWindow().initLocale)
  }
  render () {
    console.log(this.state)
    return (
      <Window data={this.state} text={this.text} />
    )
  }
  _updateState () {
    this.setState(store.getData())
  }
  _loadLocale (locale) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '/../../public/locales', locale + '.json')))
  }
}
Container.propTypes = {
}

ReactDOM.render(<Container />, document.getElementById('react-container'))