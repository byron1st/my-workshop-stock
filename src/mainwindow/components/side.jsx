/*global $*/
'use strict'

import React, {Component, PropTypes} from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as productActions from '../flux/actions.product'
import * as util from '../../util/util'

export default class Side extends Component {
  componentDidMount () {
    $('#product-list').sortable({
      handle: '.product-move-handle'
    })
    $('#product-list').disableSelection()
  }
  render () {
    return (
      <div className='ui visible right sidebar inverted vertical menu'>
        <div className='ui center aligned large header inverted'>{this.props.text['Stock']}</div>
        <div className='ui segment inverted'>
          <button className='ui fluid compact button' onClick={this._openNewProductModal}>{this.props.text['Add a New Product']}</button>
          <NewProductModal isValidNameForProduct={this.props.isValidNameForProduct} text={this.props.text}/>
        </div>
        <div className='ui segment inverted'>
          <div className='ui relaxed middle aligned divided inverted list' id='product-list'>
            {this._getProductListView(this.props.productSet, this.props.productOrder, this.props.text)}
          </div>
        </div>
      </div>
    )
  }
  _getProductListView (productSet, productOrder, text) {
    return productOrder.map(id => {
      let product = productSet[id]
      let itemContentView
      if (product.editable) {
        itemContentView = <div className='product'>
          <i className='move icon product-move-handle'></i>
          <div className='ui inverted action small input'>
            <input type='text' defaultValue={product.name} id={'input' + product.id}/>
            <div className='ui icon button' onClick={() => {
              let arg = {
                productId: product.id,
                name: $('#input' + product.id).val(),
                productOrder: $('#product-list').sortable('toArray'),
                text: text
              }
              dispatcher.dispatch(productActions.SAVE_PRODUCT_NAME, arg)
            }}><i className='checkmark icon'></i></div>
          </div>
        </div>
        
      } else {
        itemContentView = <div className='product'>
          <a href='#' onClick={() => {
            let arg = { productId: product.id, editable: true }
            dispatcher.dispatch(productActions.TOGGLE_PRODUCT_EDITABLE, arg)
          }}><i className='edit icon'></i></a> {product.name}
          <a href='#' onClick={() => {
            dispatcher.dispatch(productActions.REMOVE_PRODUCT, {productId: product.id, text: text})
          }}><i className='ui right floated remove icon'></i></a>
        </div>
      }
      return (<div className='item' key={product.id} id={product.id}>
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
  productSet: PropTypes.object.isRequired,
  productOrder: PropTypes.array.isRequired,
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