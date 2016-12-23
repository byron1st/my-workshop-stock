'use strict'

import React, {Component, PropTypes} from 'react'

import BodyTop from './body.top'
import BodyList from './body.list'

export default class Body extends Component {
  render () {
    return (
      <div id='body'>
        <BodyTop newEvent={this.props.newEvent} productList={this.props.productList} text={this.props.text}/>
        <BodyList eventList={this.props.eventList} searchTerm={this.props.searchTerm} text={this.props.text}/>
      </div>
    )
  }
}
Body.propTypes = {
  eventList: PropTypes.array.isRequired,
  newEvent: PropTypes.object.isRequired,
  productList: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  text: PropTypes.object.isRequired
}