/*global $*/
'use strict'

import React, {Component, PropTypes} from 'react'

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
              <AmountInputForm amount={this.props.amount}/>
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
  amount: PropTypes.number.isRequired,
  productList: PropTypes.array.isRequired
}

class ProductInputForm extends Component {
  render () {
    return (
      <div className='six wide field'>
        <label>Product</label>
        <select className='ui search dropdown'>
          <option value=''>Search a product</option>
          {this._getOptions(this.props.productList)}
        </select>
      </div>
    )
  }
  _getOptions (productList) {
    return productList.map(product => <option value={product.id} key={product.id}>{product.name}</option>)
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
        <input type='text' value={this._getCurrencyValue(this.props.amount)} onChange={this._onChange}/>
      </div>
    )
  }
  _getCurrencyValue (amount) {
    let converted = amount.toString()

    let idx = converted.indexOf('.')
    if (idx === -1) idx = converted.length
    for (idx -= 3; idx > 0; idx -= 3) {
      let left = converted.substring(0, idx)
      let right = converted.substring(idx)
      converted = left + ',' + right
    }
    return converted
  }
  _onChange (e) {
    console.log(e) //TODO: add dispatcher.
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
        <select className='ui selection compact dropdown'>
          <option value='sale'>Sale</option>
          <option value='production'>Prod.</option>
        </select>
      </div>
    )
  }
}
TypeInputForm.propTypes = {
}

class DateInputForm extends Component {
  componentDidMount () {
    $('#datePicker').calendar({ 
      type: 'date',
      formatter: {
        date: (date) => {
          let dateObj = new Date(date)
          return dateObj.getFullYear() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getDate()
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
            <input type='text'/>
          </div>
        </div>
      </div>
    )
  }
}
DateInputForm.propTypes = {
}