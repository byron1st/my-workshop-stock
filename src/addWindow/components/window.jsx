'use strict'

import React from 'react'
import PresentationalComp from './presentational'

import AddForm from './add.form'

export default class Window extends PresentationalComp {
  render () {
    return (
      <AddForm eventGroup={{}} text={this.props.text} />
    )
  }
}