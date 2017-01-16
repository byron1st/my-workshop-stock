'use strict'

import React from 'react'
import PresentationalComp from './presentational'

import AddForm from './add.form'

export default class Window extends PresentationalComp {
  render () {
    let addFormView = []
    this.props.data.eventGroupList.forEach((eventGroup, idx) => {
      addFormView.push(
        <AddForm key={'eg-idx' + idx}
          eventGroup={eventGroup} idx={idx} text={this.props.text} />
      )
    })
    return (
      <div className='ui container'>
        {addFormView}
      </div>
    )
  }
}