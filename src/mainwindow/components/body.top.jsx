/*global $*/
'use strict'

import React, {Component, PropTypes} from 'react'

import * as util from '../../util/util'
import dispatcher from '../../util/flux/dispatcher'
import * as eventActions from '../flux/actions.event'

export default class BodyTop extends Component {
  componentDidMount () {
    $('select.dropdown').dropdown()
  }
  render () {
    return (
      <div className='ui padded segment'>
        <div className='ui container'>
          <div className='ui form'>
            <div className='fields'>
              <ProductInputForm productList={this.props.productList}/>
              <AmountInputForm amount={this.props.newEvent.amount}/>
              <TypeInputForm />
              <DateInputForm />
            </div>
          </div>
          <button className='ui fluid compact button'>Add</button>
        </div>
      </div>
    )
  }
}
BodyTop.propTypes = {
  newEvent: PropTypes.object.isRequired,
  productList: PropTypes.array.isRequired
}

class ProductInputForm extends Component {
  render () {
    return (
      <div className='six wide field'>
        <label>Product</label>
        <select className='ui search dropdown' onChange={this._selectProduct}>
          <option value=''>Search a product</option>
          {this._getOptions(this.props.productList)}
        </select>
      </div>
    )
  }
  _getOptions (productList) {
    return productList.map(product => <option value={product.id} key={product.id}>{product.name}</option>)
  }
  _selectProduct (e) {
    dispatcher.dispatch(eventActions.UPDATE_NEWEVENT_FIELD, { field: 'productId', value: e.target.value})
  }
}
ProductInputForm.propTypes = {
  productList: PropTypes.array.isRequired
}

class AmountInputForm extends Component {
  render () {
    return (
      <div className='three wide field'>
        <label>Amount</label>
        <input type='text' value={util.getCurrencyValue(this.props.amount)} onChange={this._changeAmount}/>
      </div>
    )
  }
  _changeAmount (e) {
    dispatcher.dispatch(eventActions.UPDATE_NEWEVENT_FIELD, { field: 'amount', value: e.target.value})
  }
}
AmountInputForm.propTypes = {
  amount: PropTypes.number.isRequired
}

class TypeInputForm extends Component {
  render () {
    return (
      <div className='three wide field'>
        <label>Type</label>
        <select className='ui selection compact dropdown' onChange={this._changeType}>
          <option value='sale'>Sale</option>
          <option value='production'>Prod.</option>
        </select>
      </div>
    )
  }
  _changeType (e) {
    dispatcher.dispatch(eventActions.UPDATE_NEWEVENT_FIELD, { field: 'type', value: e.target.value})
  }
}
TypeInputForm.propTypes = {
}

class DateInputForm extends Component {
  componentDidMount () {
    $('#datePicker').calendar({ 
      type: 'date',
      today: true,
      formatter: {
        date: (date) => {
          dispatcher.dispatch(eventActions.UPDATE_NEWEVENT_FIELD, { field: 'date', value: date})
          return util.getDateString(new Date(date))
        }
      }
    })
  }
  render () {
    return (
      <div className='four wide field'>
        <label>Date</label>
        <div className='ui calendar' id='datePicker'>
          <div className='ui input left icon'>
            <i className='calendar icon'></i>
            <input type='text' defaultValue={util.getDateString(new Date())}/>
          </div>
        </div>
      </div>
    )
  }
}
DateInputForm.propTypes = {
}