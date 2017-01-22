'use strict'

import React from 'react'

import PresentationalComp from './presentational'
import dispatcher from '../../util/flux/dispatcher'
import * as productActions from '../flux/actions.product'
import * as util from '../../util/util'
import getText from '../../util/locale'

export default class Side extends PresentationalComp {
  componentDidMount () {
    $('#product-list').sortable({
      handle: '.product-move-handle'
    })
    $('#product-list').disableSelection()
  }
  render () {
    return (
      <div className='ui visible right sidebar inverted vertical menu'>
        <div className='ui segment inverted'>
          <div className='ui center aligned large header inverted'>{getText('Stock')}</div>
          <button className='ui fluid compact blue button' onClick={this._openNewProductModal}>{getText('Add a New Product')}</button>
          <NewProductModal data={this.props.data} ui={this.props.ui} />
        </div>
        <div className='ui segment inverted'>
          <div className='ui relaxed middle aligned divided inverted list' id='product-list'>
            {this._getProductListView()}
          </div>
        </div>
      </div>
    )
  }
  _getProductListView () {
    let data = this.props.data
    return data.productIdList.map(id => {
      let product = data.productSet[id]
      let itemContentView
      if (isEditable.call(this, id)) {
        itemContentView = (
          <div className='product'>
            <i className='move icon product-move-handle' />
            <div className='ui inverted action small input'>
              <input type='text' defaultValue={product.name} id={'input' + product.id} />
              <div className='ui icon button' onClick={() => {
                let arg = {
                  id: product.id,
                  name: $('#input' + product.id).val(),
                  productIdList: $('#product-list').sortable('toArray')
                }
                dispatcher.dispatch(productActions.SAVE_PRODUCT_NAME, arg)
              }}><i className='checkmark icon' /></div>
            </div>
          </div>)
      } else {
        itemContentView = (
          <div className='product'>
            <a href='#' onClick={() => {
              let arg = { id: product.id, editable: true }
              dispatcher.dispatch(productActions.TOGGLE_PRODUCT_EDITABLE, arg)
            }}><i className='edit icon' /></a> {product.name}
            <a href='#' onClick={() => {
              dispatcher.dispatch(productActions.REMOVE_PRODUCT, product.id)
            }}><i className='ui right floated remove icon' /></a>
          </div>)
      }

      return (
        <div className='item' key={product.id} id={product.id}>
          <div className='middle aligned content'>
            {itemContentView}
          </div>
          <div className='extra'>
            <span>{util.getCurrencyValue(product.stock)}</span>
          </div>
        </div>)
    })

    function isEditable (id) {
      return this.props.ui.editableProductList.indexOf(id) !== -1
    }
  }
  _openNewProductModal () {
    $('#newProductModal').modal('show')
    $('#newProductName').val('')
  }
}

class NewProductModal extends PresentationalComp {
  componentDidMount () {
    $('#newProductModal').modal({
      closable: false
    })
  }
  componentDidUpdate () {
    if (this.props.ui.isValidNameForProduct) {
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
        <div className='header'>{getText('Add a New Product')}</div>
        <div className='content'>
          <div className='ui form' id='modalNameForm'>
            <div className='field'>
              <label>{getText('Name')}</label>
              <input type='text' id='newProductName' onChange={this._checkName} />
            </div>
            <div className='ui error message'>
              <div className='header'>{getText('Duplicated Name')}</div>
              <p>{getText('There is the same name in the list.')}</p>
            </div>
          </div>
        </div>
        <div className='actions'>
          <div className='ui approve primary button' onClick={this._addNewProduct} id='modalCreateBtn'>{getText('Create')}</div>
          <div className='ui cancel button'>{getText('Cancel')}</div>
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
