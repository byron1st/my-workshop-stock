'use strict'

import React from 'react'
import PresentationalComp from './presentational'

import AddForm from './add.form'

export default class Window extends PresentationalComp {
  render () {
    return (
      <div>
        <div className='ui attached raised segment'>
          <AddForm data={this.props.data} text={this.props.text} />
        </div>
        <div className='ui bottom attached borderless mini menu'>
          <div className='right floated item'>
            <button className='ui positive button'>Save</button>
          </div>
        </div>
      </div>
    )
  }
}