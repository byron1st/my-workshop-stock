/*global document*/

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import store from './flux/store.main'

import Window from './components/window'

class Container extends Component {
  constructor () {
    super()
    this.state = {}
  }
  componentWillMount () {
    store.addChangeListener(this._updateState.bind(this))
    store.emitChange()
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

ReactDOM.render(<Container />, document.getElementById('react-container'))