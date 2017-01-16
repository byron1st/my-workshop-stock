'use strict'

import React from 'react'
import PresentationalComp from './presentational'

import AddForm from './add.form'

export default class Window extends PresentationalComp {
  render () {
    return (
      <div className='ui container'>
        <AddForm data={this.props.data} text={this.props.text} />
      </div>
    )
  }
}