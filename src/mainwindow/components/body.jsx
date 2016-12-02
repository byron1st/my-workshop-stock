'use strict'

import React, {Component, PropTypes} from 'react'

import BodyTop from './body.top'
import BodyList from './body.list'

export default class Body extends Component {
  render () {
    return (
      <div id='body'>
        <BodyTop amount={this.props.bodyTopAmount} productList={this.props.productList}/>
        <BodyList eventList={this.props.eventList}/>
      </div>
    )
  }
}
Body.propTypes = {
  bodyTopAmount: PropTypes.number.isRequired,
  eventList: PropTypes.array.isRequired,
  productList: PropTypes.array.isRequired
}