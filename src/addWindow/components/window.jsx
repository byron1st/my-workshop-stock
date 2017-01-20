'use strict'

import React from 'react'
import PresentationalComp from './presentational'

import dispatcher from '../../util/flux/dispatcher'
import * as actions from '../flux/actions'

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
            <button className='ui primary button' onClick={this._save}>Save</button>
          </div>
        </div>
      </div>
    )
  }
  _save () {
    dispatcher.dispatch(actions.SAVE_EVENTGROUP)
  }
}