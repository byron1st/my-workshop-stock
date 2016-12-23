/*global $*/
'use strict'

import React, {Component, PropTypes} from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as productActions from '../flux/actions.product'
import * as util from '../../util/util'

export default class Side extends Component {
  render () {
    return (
      <div className='ui visible right sidebar inverted vertical menu'>
        <div className='ui center aligned large header inverted'>{this.props.text['Stock']}</div>
        <div className='ui segment inverted'>
          <button className='ui fluid compact button' onClick={this._openNewProductModal}>{this.props.text['Add a New Product']}</button>
          <NewProductModal isValidNameForProduct={this.props.isValidNameForProduct} text={this.props.text}/>
        </div>
        <div className='ui segment inverted'>
          <div className='ui relaxed middle aligned divided inverted list'>
            {this._getProductListView(this.props.productList, this.props.text)}
          </div>
        </div>
      </div>
    )
  }
  _getProductListView (productList, text) {
    return productList.map(product => {
      let itemContentView
      if (product.editable) {
        itemContentView = <div className='product' id={product.id}>
          <div className='ui mini icon input'>
            <input type='text' defaultValue={product.name} id={'input' + product.id}/>
          </div>
          <a href='#' onClick={() => {
            let arg = { productId: product.id, name: $('#input' + product.id).val() }
            dispatcher.dispatch(productActions.SAVE_PRODUCT_NAME, arg)
          }}><i className='checkmark box icon'></i></a>
        </div>
        
      } else {
        itemContentView = <div className='product' id={product.id}>
          {product.name} <a href='#' onClick={() => {
            let arg = { productId: product.id, editable: true }
            dispatcher.dispatch(productActions.TOGGLE_PRODUCT_EDITABLE, arg)
          }}>
            <i className='edit icon'></i>
          </a>
          <a href='#' onClick={() => {
            dispatcher.dispatch(productActions.REMOVE_PRODUCT, {productId: product.id, text: text})
          }}><i className='ui right floated remove icon'></i></a>
        </div>
      }
      return (<div className='item' key={product.id}>
                <div className='middle aligned content'>
                  {itemContentView}
                </div>
                <div className='extra'>
                   <span>{util.getCurrencyValue(product.amount)}</span>
                </div>
              </div>)
    })
  }
  _openNewProductModal () {
    $('#newProductModal').modal('show')
    $('#newProductName').val('')
  }
}
Side.propTypes = {
  productList: PropTypes.array.isRequired,
  isValidNameForProduct: PropTypes.bool.isRequired,
  text: PropTypes.object.isRequired
}

class NewProductModal extends Component {
  componentDidMount () {
    $('#newProductModal').modal({
      closable: false
    })
  }
  componentDidUpdate () {
    if (this.props.isValidNameForProduct) {
      $('#modalNameForm').removeClass('error')
      $('#modalCreateBtn').removeClass('disabled')
    } else {
      $('#modalNameForm').addClass('error')
      $('#modalCreateBtn').addClass('disabled')
    }
  }
  render () {
    return (
      <div className='ui small modal' id='newProductModal'>
        <div className='header'>{this.props.text['Add a New Product']}</div>
        <div className='content'>
          <div className='ui form' id='modalNameForm'>
            <div className='field'>
              <label>{this.props.text['Name']}</label>
              <input type='text' id='newProductName' onChange={this._checkName}/>     
            </div>
            <div className='ui error message'>
              <div className='header'>{this.props.text['Duplicated Name']}</div>
              <p>{this.props.text['There is the same name in the list.']}</p>
            </div>
          </div>
        </div>
        <div className='actions'>
          <div className='ui approve primary button' onClick={this._addNewProduct} id='modalCreateBtn'>{this.props.text['Create']}</div>
          <div className='ui cancel button'>{this.props.text['Cancel']}</div>
        </div>
      </div>
    )
  }
  _addNewProduct () {
    dispatcher.dispatch(productActions.ADD_NEWPRODUCT, { name: $('#newProductName').val() })
  }
  _checkName (e) {
    dispatcher.dispatch(productActions.ISVALIDNAME_FOR_PRODUCT, e.target.value)
  }
}
NewProductModal.propTypes = {
  isValidNameForProduct: PropTypes.bool.isRequired,
  text: PropTypes.object.isRequired
}