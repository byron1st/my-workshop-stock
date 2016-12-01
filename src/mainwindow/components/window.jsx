'use strict'

import React, {Component, PropTypes} from 'react'

import Body from './body'
import Side from './side'

export default class Window extends Component {
  render () {
    return (
      <div>
        <h1>Hello, it's Stock!</h1>
        <Body bodyTopAmount={this.props.store.bodyTopAmount} eventList={this.props.store.eventList}/>
        <Side productList={this.props.store.productList}/>
      </div>
    )
  }
}
Window.propTypes = {
  store: PropTypes.object.isRequired
}