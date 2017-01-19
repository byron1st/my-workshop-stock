/*global $*/
'use strict'

import React, {Component, PropTypes} from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as actions from '../flux/actions'
import * as c from '../../util/const'
import * as util from '../../util/util'

export default class AddForm extends Component {
  componentDidMount () {
    $('select.dropdown').dropdown()
  }
  render () {
    let eventGroup = this.props.data.eventGroup
    let eventListView = []
    eventGroup.eventList.forEach((event, idx) => {
      if (idx !== 0){
        eventListView.push(
          <EventForm 
            event={event}
            idx={idx}
            productSet={this.props.data.productSet}
            text={this.props.text} />
        )
      }
    })
    return (
      <div className='ui raised segment'>
        <div className='ui form'>
          <div className='fields'>
            <TitleForm value={eventGroup.title} label='Title' />
            <DateForm value={eventGroup.date} label='Date' />
            <KindForm value={eventGroup.kind} label='Kind' />
          </div>
          <h4 className='ui dividing header'>Products</h4>
          <EventInputForm 
            event={eventGroup.eventList[0]}
            idx={0}
            productSet={this.props.data.productSet}
            text={this.props.text} />
          <div className='ui divider'></div>
          {eventListView}
        </div>
      </div>
    )
  }
}
AddForm.propTypes = {
  data: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
}

class TitleForm extends Component {
  render () {
    return (
      <div className='seven wide field'>
        <label>{this.props.label}</label>
        <input type='text' value={this.props.value} onChange={this._onChange}/>
      </div>
    )
  }
  _onChange(e) {
    dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {field: 'title', value: e.target.value})
  }
}
TitleForm.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired
}

class DateForm extends Component {
  componentDidMount() {
    $('#date-picker').calendar({
      type: 'date',
      today: true,
      formatter: {
        date: (date) => {
          dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {field: 'date', value: date})
          return util.getDateString(new Date(date))
        }
      }
    })
  }
  
  render () {
    return (
      <div className='four wide field'>
        <label>{this.props.label}</label>
        <div className='ui calendar' id='date-picker'>
          <div className='ui input left icon'>
            <i className='calendar icon'></i>
            <input type='text' defaultValue={util.getDateString(new Date(this.props.value))}/>
          </div>
        </div>
      </div>
    )
  }
}
DateForm.propTypes = {
  value: PropTypes.object,
  label: PropTypes.string.isRequired
}

class KindForm extends Component {
  render () {
    return (
      <div className='five wide field'>
        <label>{this.props.label}</label>
        <select className='ui search dropdown' value={this.props.value} onChange={this._onChange}>
          <option value={c.EVENTGROUP_KIND.SALE}>Sale</option>
          <option value={c.EVENTGROUP_KIND.PRODUCTION}>Production</option>
        </select>
      </div>
    )
  }
  _onChange (e) {
    dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {field: 'kind', value: e.target.value})
  }
}
KindForm.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired
}

class EventForm extends Component {
  render () {
    let productListView = []

    if (this.props.idx === 0) {
      productListView.push(
        <option value='' key={'-1'}>Select a product</option>
      )
    }

    let productList = Object.keys(this.props.productSet)
    productList.forEach(id => {
      let product = this.props.productSet[id]
      productListView.push(
        <option value={product.id} key={product.id}>{product.name}</option>
      )
    })
    return (
      <div className='fields'>
        <div className='ten wide field'>
          <label>Product</label>
          <select className='ui search dropdown' value={this.props.event.productId} onChange={this._onProductChange}>
            {productListView}
          </select>
        </div>
        <div className='five wide field'>
          <label>Amount</label>
          <input type='text' value={this.props.event.amount} onChange={this._onAmountChange}/>
        </div>
        {this._getButton()}
      </div>
    )
  }
  _onProductChange (e) {
    console.log(e.target.value)
  }
  _onAmountChange (e) {
    console.log(e.target.value)
  }
  _getButton () {
    return (
      <button className='ui icon button' onClick={() => this._onBtnClick()}>
        <i className='minus icon'></i>
      </button>
    )
  }
  _onBtnClick () {
    console.log('click-remove-btn')
  }
}
EventForm.propTypes = {
  event: PropTypes.object.isRequired,
  idx: PropTypes.number,
  productSet: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
}

class EventInputForm extends EventForm {
  _getButton () {
    return (
      <button className='ui icon button' onClick={() => this._onBtnClick()}>
        <i className='plus icon'></i>
      </button>
    )
  }
  _onBtnClick () {
    console.log('click-add-btn')
  }
}