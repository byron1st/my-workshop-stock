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
        <div className='ui center aligned large header inverted'>Stock</div>
        <div className='ui segment inverted'>
          <button className='ui fluid compact button' onClick={this._openNewProductModal}>Add a product</button>
          <NewProductModal isValidNameForProduct={this.props.isValidNameForProduct}/>
        </div>
        <div className='ui segment inverted'>
          <div className='ui relaxed middle aligned divided inverted list'>
            {this._getProductListView(this.props.productList)}
          </div>
        </div>
      </div>
    )
  }
  _getProductListView (productList) {
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
  isValidNameForProduct: PropTypes.bool.isRequired
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
        <div className='header'>Add a New Product</div>
        <div className='content'>
          <div className='ui form' id='modalNameForm'>
            <div className='field'>
              <label>Name</label>
              <input type='text' id='newProductName' onChange={this._checkName}/>     
            </div>
            <div className='ui error message'>
              <div className='header'>Duplicated Name</div>
              <p>There is the same name in the list.</p>
            </div>
          </div>
        </div>
        <div className='actions'>
          <div className='ui approve primary button' onClick={this._addNewProduct} id='modalCreateBtn'>Create</div>
          <div className='ui cancel button'>Cancel</div>
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
  isValidNameForProduct: PropTypes.bool.isRequired
}