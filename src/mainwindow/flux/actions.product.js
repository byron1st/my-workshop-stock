'use strict'

import {Map, List} from 'immutable'
import {remote} from 'electron'

import dispatcher from '../../util/flux/dispatcher'
import dataStore from './store.data'
import uiStore from './store.ui'
import * as c from '../../util/const'
import generateId from '../util/id.generator'
import getText from '../../util/locale'

export const ADD_NEWPRODUCT = 'add-newproduct'
export const ISVALIDNAME_FOR_PRODUCT = 'isvalidname-for-product'
export const TOGGLE_PRODUCT_EDITABLE = 'toggle-product-editable'
export const SAVE_PRODUCT_NAME = 'save-product-name'
export const REMOVE_PRODUCT = 'remove-product'

export function initialize () {
  dispatcher.register(ADD_NEWPRODUCT, addNewProduct)
  dispatcher.register(ISVALIDNAME_FOR_PRODUCT, checkName)
  dispatcher.register(TOGGLE_PRODUCT_EDITABLE, toggleProductEditable)
  dispatcher.register(SAVE_PRODUCT_NAME, saveProductName)
  dispatcher.register(REMOVE_PRODUCT, removeProduct)
}

function addNewProduct (newProductObj) {
  if (!_isValidNameForProduct(newProductObj.name)) {
    return // TODO: show the error
  }

  let product = new Map({
    id: generateId(c.ID_KIND.PRODUCT),
    name: newProductObj.name,
    stock: 0
  })

  let productSet = dataStore.getValue('productSet').set(product.get('id'), product)
  let productIdList = dataStore.getValue('productIdList').push(product.get('id'))

  dataStore.setValue('productSet', productSet)
  dataStore.setValue('productIdList', productIdList)
  dataStore.emitChange()
}

function checkName (name) {
  uiStore.setValue('isValidNameForProduct', _isValidNameForProduct(name))
  uiStore.emitChange()
}

/**
 * Toggle the editable of a product
 *
 * @param      {object}  arg     {id: string, editable: bool}
 */
function toggleProductEditable (arg) {
  let editableProductList = uiStore.getValue('editableProductList')
  if (editableProductList.find((id) => id === arg.id) === undefined) {
    uiStore.setValue('editableProductList', editableProductList.push(arg.id))
    uiStore.emitChange()
  }
}

/**
 * Saves a product name.
 *
 * @param      {object}  arg     {id: string, name: string, productIdList: array<string>}
 */
function saveProductName (arg) {
  let product = dataStore.getValue('productSet').get(arg.id)
  if (product !== undefined) {
    if (product.get('name') !== arg.name && !_isValidNameForProduct(arg.name)) {
      return remote.dialog.showErrorBox(getText('Duplicated Name'), getText('There is the same name in the list.'))
    }

    dataStore.setValue('productSet', dataStore.getValue('productSet').set(arg.id, product.set('name', arg.name)))
    dataStore.setValue('productIdList', List(arg.productIdList))
    uiStore.setValue('editableProductList', uiStore.getValue('editableProductList').filter(id => id !== arg.id))
    dataStore.emitChange()
    uiStore.emitChange()
  }
}

/**
 * Removes a product.
 *
 * @param      {object}  arg     {id: number}
 */
function removeProduct (productId) {
  let product = dataStore.getValue('productSet').get(productId)
  if (product !== undefined) {
    remote.dialog.showMessageBox({
      type: 'question',
      buttons: [getText('OK'), getText('Cancel')],
      defaultId: 1,
      message: getText('Will you delete this product? Every related event will be deleted together.'),
      cancelId: 1
    }, (index) => {
      if (index === 1) {
        return
      } else {
        let order = dataStore.getValue('productIdList').findKey(id => id === productId)
        dataStore.setValue('productSet', dataStore.getValue('productSet').delete(productId))
        dataStore.setValue('productIdList', dataStore.getValue('productIdList').splice(order, 1))

        let filteredEventSet = dataStore.getValue('eventSet').filterNot(event => event.get('productId') === productId)
        let updatedEventGroupSet = dataStore.getValue('eventGroupSet').map(eventGroup => {
          let updatedEventIdList = eventGroup.get('eventIdList').filterNot(id => {
            return filteredEventSet.find((v, k) => k === id) === undefined
          })
          return eventGroup.set('eventIdList', updatedEventIdList)
        })

        // dataStore.setValue('eventList', dataStore.getValue('eventList').filterNot(event => event.get('productId') === productId))
        dataStore.setValue('eventSet', filteredEventSet)
        dataStore.setValue('eventGroupSet', updatedEventGroupSet)
        dataStore.emitChange()
      }
    })
  }
}

function _isValidNameForProduct (name) {
  return dataStore.getValue('productSet').find(product => {
    return product.get('name') === name
  }) === undefined
}
