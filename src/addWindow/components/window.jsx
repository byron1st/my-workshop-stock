'use strict'

import React, {PropTypes, Component} from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as actions from '../flux/actions'
import getText from '../../util/locale'
import * as util from '../../util/util'

import AddForm from './add.form'

export default class Window extends Component {
  componentDidMount () {
    $('#DateForm-datePicker').calendar({
      type: 'date',
      today: true,
      formatter: {
        date: (date) => {
          dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {field: 'date', value: date})
          return util.getDateString(new Date(date))
        }
      }
    })
    $('select.dropdown').dropdown()
  }

  componentDidUpdate (prevProps, prevState) {
    $('select.dropdown').dropdown()
  }

  render () {
    return (
      <div>
        <div className='ui attached raised segment'>
          <AddForm data={this.props.data} />
        </div>
        <div className='ui bottom attached borderless mini menu'>
          <div className='right floated item'>
            <button className='ui primary button' onClick={this._save}>{getText('Save')}</button>
          </div>
        </div>
      </div>
    )
  }

  _save () {
    dispatcher.dispatch(actions.SAVE_EVENTGROUP)
  }
}
Window.propTypes = {
  data: PropTypes.object.isRequired
}
