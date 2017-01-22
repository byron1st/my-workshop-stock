'use strict'

import React from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as productActions from '../flux/actions.product'
import getText from '../../util/locale'

export default () => {
  function _onNameChange (e) {
    dispatcher.dispatch(productActions.ISVALIDNAME_FOR_PRODUCT, e.target.value)
  }

  function _addProduct () {
    dispatcher.dispatch(productActions.ADD_NEWPRODUCT, {name: $('#ModalNewProduct-name').val()})
  }

  return (
    <div className='ui small modal' id='ModalNewProduct'>
      <div className='header'>{getText('Add a New Product')}</div>
      <div className='content'>
        <div className='ui form' id='ModalNewProduct-nameForm'>
          <div className='field'>
            <label>{getText('Name')}</label>
            <input type='text' id='ModalNewProduct-name' onChange={_onNameChange} />
          </div>
          <div className='ui error message'>
            <div className='header'>{getText('Duplicated Name')}</div>
            <p>{getText('There is the same name in the list.')}</p>
          </div>
        </div>
      </div>
      <div className='actions'>
        <div className='ui approve primary button' id='ModalNewProduct-createBtn' onClick={_addProduct}>
          {getText('Create')}
        </div>
        <div className='ui cancel button'>
          {getText('Cancel')}
        </div>
      </div>
    </div>
  )
}
