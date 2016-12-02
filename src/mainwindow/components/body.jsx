'use strict'

import React, {Component, PropTypes} from 'react'

import BodyTop from './body.top'
import BodyList from './body.list'

export default class Body extends Component {
  render () {
    return (
      <div id='body'>
        <BodyTop newEvent={this.props.newEvent} productList={this.props.productList}/>
        <BodyList eventList={this.props.eventList}/>
      </div>
    )
  }
}
Body.propTypes = {
  eventList: PropTypes.array.isRequired,
  newEvent: PropTypes.object.isRequired,
  productList: PropTypes.array.isRequired
}