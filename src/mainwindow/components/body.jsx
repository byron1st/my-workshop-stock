'use strict'

import React, {Component, PropTypes} from 'react'

import BodyTop from './body.top'
import BodyList from './body.list'

export default class Body extends Component {
  render () {
    return (
      <div>
        <BodyTop amount={this.props.bodyTopAmount}/>
        <BodyList eventList={this.props.eventList}/>
      </div>
    )
  }
}
Body.propTypes = {
  bodyTopAmount: PropTypes.number.isRequired,
  eventList: PropTypes.array.isRequired
}