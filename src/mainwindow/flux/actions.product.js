/*eslint-disable no-unused-vars*/
'use strict'

import {Map} from 'immutable'
import {remote} from 'electron'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import * as util from '../../util/util'
import generateId from '../../util/id.generator'

let ipc = {}

export const ADD_NEWPRODUCT = 'add-newproduct'
export const ISVALIDNAME_FOR_PRODUCT = 'isvalidname-for-product'
export const TOGGLE_PRODUCT_EDITABLE = 'toggle-product-editable'
export const SAVE_PRODUCT_NAME = 'save-product-name'
export const REMOVE_PRODUCT = 'remove-product'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.
  dispatcher.register(ADD_NEWPRODUCT, addNewProduct)
  dispatcher.register(ISVALIDNAME_FOR_PRODUCT, checkName)
  dispatcher.register(TOGGLE_PRODUCT_EDITABLE, toggleProductEditable)
  dispatcher.register(SAVE_PRODUCT_NAME, saveProductName)
  dispatcher.register(REMOVE_PRODUCT, removeProduct)
}

function addNewProduct (newProductObj) {
  if (!isValidNameForProduct(newProductObj.name)) {
    return // TODO: show the error
  }

  let product = new Map({
    id: generateId('product'),
    name: newProductObj.name,
    amount: 0,
    editable: false
  })

  let productList = store.getValue('productList').push(product)
  
  store.setValue('productList', productList)
  store.emitChange()
}

function checkName (name) {
  store.setValue('isValidNameForProduct', isValidNameForProduct(name))
  store.emitChange()
}

/**
 * Toggle the editable of a product
 *
 * @param      {object}  arg     {productId: string, editable: bool}
 */
function toggleProductEditable (arg) {
  let productList = store.getValue('productList')
  let productIdx = productList.findKey(product => product.get('id') === arg.productId)
  if (productIdx !== undefined) {
    let toggledProduct = productList.get(productIdx).set('editable', arg.editable)
    store.setValue('productList', productList.set(productIdx, toggledProduct))
    store.emitChange()
  }
}

/**
 * Saves a product name.
 *
 * @param      {object}  arg     {productId: string, name: string}
 */
function saveProductName (arg) {
  let productList = store.getValue('productList')
  let productIdx = productList.findKey(product => product.get('id') === arg.productId)
  if (productIdx !== undefined) {
    let toggledProduct = productList.get(productIdx).withMutations(product => {
      product.set('editable', false).set('name', arg.name)
    })

    let eventList = store.getValue('eventList').asMutable()
    for (let i = 0; i < eventList.size; i++) {
      if (eventList.get(i).get('productId') === arg.productId) {
        eventList.set(i, eventList.get(i).set('productName', arg.name))
      }
    }
    
    store.setValue('productList', productList.set(productIdx, toggledProduct))
    store.setValue('eventList', eventList.asImmutable())
    store.emitChange()
  }
}

/**
 * Removes a product.
 *
 * @param      {object}  arg     {productId: number, text: object}
 */
function removeProduct (arg) {
  let productList = store.getValue('productList')
  let productIdx = productList.findKey(product => product.get('id') === arg.productId)
  if (productIdx !== undefined) {
    remote.dialog.showMessageBox({
      type: 'question',
      buttons: [arg.text['OK'], arg.text['Cancel']],
      defaultId: 1,
      message: arg.text['Will you delete this product? Every related event will be deleted together.'],
      cancelId: 1
    }, (index) => {
      if (index === 1) {
        return
      } else {
        store.setValue('productList', store.getValue('productList').delete(productIdx))
        store.setValue('eventList', store.getValue('eventList').filterNot(event => event.get('productId') === arg.productId))
        store.emitChange()
      }
    })
  }
}

function isValidNameForProduct (name) {
  return store.getValue('productList').find(product => {
    return product.get('name') === name
  }) === undefined
}