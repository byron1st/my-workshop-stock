'use strict'

import React from 'react'

import PresentationalComp from './presentational'
import BodyList from './body.list'

export default class Body extends PresentationalComp {
  render () {
    return (
      <div id='body'>
        <BodyList data={this.props.data}
          ui={this.props.ui} />
      </div>
    )
  }
}
