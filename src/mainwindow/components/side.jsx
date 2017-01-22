'use strict'

import React from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as productActions from '../flux/actions.product'
import * as util from '../../util/util'
import getText from '../../util/locale'

export default ({data, ui}) => {
  function _openModal () {
    $('#ModalNewProduct').modal('show')
    $('#ModalNewProduct-name').val('')
  }

  return (
    <div className='ui visible right sidebar inverted vertical menu'>
      <div className='ui segment inverted'>
        <div className='ui center aligned large header inverted'>
          {getText('Stock')}
        </div>
        <button className='ui fluid compact blue button' onClick={_openModal}>
          {getText('Add a New Product')}
        </button>
      </div>
      <div className='ui segment inverted'>
        <ProductList productIdList={data.productIdList}
          productSet={data.productSet}
          editableProductList={ui.editableProductList} />
      </div>
    </div>
  )
}

const ProductList = ({productIdList, productSet, editableProductList}) => {
  return (
    <div className='ui relaxed middle aligned divided inverted list' id='ProductList'>
      {productIdList.map(id => {
        let product = productSet[id]
        return (
          <div className='item' key={product.id} id={product.id}>
            <div className='middle aligned content'>
              {editableProductList.indexOf(id) !== -1
                ? <EditableItemContent product={product} /> : <ItemContent product={product} />}
            </div>
            <div className='extra'>
              <span>{util.getCurrencyValue(product.stock)}</span>
            </div>
          </div>)
      })}
    </div>
  )
}

const EditableItemContent = ({product}) => {
  function _saveChange () {
    dispatcher.dispatch(productActions.SAVE_PRODUCT_NAME, {
      id: product.id,
      name: $('#input' + product.id).val(),
      productIdList: $('#ProductList').sortable('toArray')
    })
  }

  return (
    <div className='product'>
      <i className='move icon EditableItemContent-moveHandler' />
      <div className='ui inverted action small input'>
        <input type='text' defaultValue={product.name} id={'input' + product.id} />
        <div className='ui icon button' onClick={_saveChange}>
          <i className='checkmark icon' />
        </div>
      </div>
    </div>
  )
}

const ItemContent = ({product}) => {
  function _toggleEdit () {
    dispatcher.dispatch(productActions.TOGGLE_PRODUCT_EDITABLE, {
      id: product.id,
      editable: true
    })
  }

  function _removeProduct () {
    dispatcher.dispatch(productActions.REMOVE_PRODUCT, product.id)
  }

  return (
    <div className='product'>
      <a href='#' onClick={_toggleEdit}>
        <i className='edit icon' />
      </a> {product.name}
      <a href='#' onClick={_removeProduct}>
        <i className='ui right floated remove icon' />
      </a>
    </div>
  )
}
