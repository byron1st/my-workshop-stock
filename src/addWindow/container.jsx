/* global document */

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote} from 'electron'

import dispatcher from '../util/flux/dispatcher'
import store from './flux/store'
import * as actions from './flux/actions'
import {setLocale} from '../util/locale'

import Window from './components/window'

class Container extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentWillMount () {
    actions.initialize()
    setLocale(remote.getCurrentWindow().initLocale)
    this._initStores()
  }

  render () {
    console.log(this.state)
    return (
      <Window data={this.state} />
    )
  }

  _updateState () {
    this.setState(store.getData())
  }

  _initStores () {
    store.addChangeListener(() => this._updateState())
    dispatcher.dispatch(actions.INITIALIZE_STORE, remote.getCurrentWindow().productSet)
  }
}

ReactDOM.render(<Container />, document.getElementById('react-container'))
