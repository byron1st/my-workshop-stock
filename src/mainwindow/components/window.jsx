'use strict'

import React, {Component, PropTypes} from 'react'

import Body from './body'
import Side from './side'

export default class Window extends Component {
  render () {
    return (
      <div>
        <Side 
          data={this.props.store.data}
          ui={this.props.store.ui} />
        <Body
          data={this.props.store.data}
          ui={this.props.store.ui} />
      </div>
    )
  }
}
Window.propTypes = {
  store: PropTypes.object.isRequired
}