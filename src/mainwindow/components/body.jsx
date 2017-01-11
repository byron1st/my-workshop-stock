'use strict'

import React, {/*Component, PropTypes*/} from 'react'

import PresentationalComp from './presentational'
// import BodyTop from './body.top'
import BodyList from './body.list'

export default class Body extends PresentationalComp {
  render () {
    return (
      <div id='body'>
        {/*<BodyTop newEvent={this.props.newEvent} productSet={this.props.productSet} productOrder={this.props.productOrder} text={this.props.text}/>*/}
        <BodyList 
          data={this.props.data}
          ui={this.props.ui}
          text={this.props.text} />
      </div>
    )
  }
}