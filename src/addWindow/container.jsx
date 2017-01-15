/*global document*/

'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Window from './components/window'

class Container extends Component {
  render () {
    return (
      <Window />
    )
  }
}
Container.propTypes = {
}

ReactDOM.render(<Container />, document.getElementById('react-container'))