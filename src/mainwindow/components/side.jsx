'use strict'

import React from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as productActions from '../flux/actions.product'
import * as util from '../../util/util'
import getText from '../../util/locale'

export default ({data, ui}) => {
  return (
    <div className='ui visible right sidebar inverted vertical menu'>
      <div className='ui segment inverted'>
        <div className='ui center aligned large header inverted'>
          {getText('Stock')}
        </div>
        <button className='ui fluid compact blue button'
          onClick={() => {
            $('#ModalNewProduct').modal('show')
            $('#ModalNewProduct-name').val('')
          }}>
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
  return (
    <div className='product'>
      <i className='move icon EditableItemContent-moveHandler' />
      <div className='ui inverted action small input'>
        <input type='text' defaultValue={product.name} id={'input' + product.id} />
        <div className='ui icon button' onClick={() => {
          let arg = {
            id: product.id,
            name: $('#input' + product.id).val(),
            productIdList: $('#ProductList').sortable('toArray')
          }
          dispatcher.dispatch(productActions.SAVE_PRODUCT_NAME, arg)
        }}><i className='checkmark icon' /></div>
      </div>
    </div>
  )
}

const ItemContent = ({product}) => {
  return (
    <div className='product'>
      <a href='#' onClick={() => {
        let arg = { id: product.id, editable: true }
        dispatcher.dispatch(productActions.TOGGLE_PRODUCT_EDITABLE, arg)
      }}><i className='edit icon' /></a> {product.name}
      <a href='#' onClick={() => {
        dispatcher.dispatch(productActions.REMOVE_PRODUCT, product.id)
      }}><i className='ui right floated remove icon' /></a>
    </div>
  )
}
