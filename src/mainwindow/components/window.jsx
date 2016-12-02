'use strict'

import React, {Component, PropTypes} from 'react'

import Body from './body'
import Side from './side'

export default class Window extends Component {
  render () {
    return (
      <div>
        <Side productList={this.props.store.productList}/>
        <Body eventList={this.props.store.eventList} newEvent={this.props.store.newEvent} productList={this.props.store.productList}/>
      </div>
    )
  }
}
Window.propTypes = {
  store: PropTypes.object.isRequired
}