/*eslint-disable no-unused-vars*/
'use strict'

import {Map, List} from 'immutable'
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

  // let productList = store.getValue('productList').push(product)
  let productSet = store.getValue('productSet').set(product.get('id'), product)
  let productOrder = store.getValue('productOrder').push(product.get('id'))
  
  store.setValue('productSet', productSet)
  store.setValue('productOrder', productOrder)
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
  let product = store.getValue('productSet').get(arg.productId)
  if (product !== undefined) {
    let toggledProduct = product.set('editable', arg.editable)
    store.setValue('productSet', store.getValue('productSet').set(arg.productId, toggledProduct))
    store.emitChange()
  }
}

/**
 * Saves a product name.
 *
 * @param      {object}  arg     {productId: number, name: string, productOrder: array<number>, text: object}
 */
function saveProductName (arg) {
  let product = store.getValue('productSet').get(arg.productId)
  if (product !== undefined) {
    if (product.get('name') !== arg.name && !isValidNameForProduct(arg.name)) {
      return remote.dialog.showErrorBox(arg.text['Duplicated Name'], arg.text['There is the same name in the list.'])
    }

    let toggledProduct = product.withMutations(product => {
      product.set('editable', false).set('name', arg.name)
    })

    let eventList = store.getValue('eventList').asMutable()
    for (let i = 0; i < eventList.size; i++) {
      if (eventList.get(i).get('productId') === arg.productId) {
        eventList.set(i, eventList.get(i).set('productName', arg.name))
      }
    }
    
    store.setValue('productSet', store.getValue('productSet').set(arg.productId, toggledProduct))
    store.setValue('eventList', eventList.asImmutable())
    store.setValue('productOrder', List(arg.productOrder))
    store.emitChange()
  }
}

/**
 * Removes a product.
 *
 * @param      {object}  arg     {productId: number, text: object}
 */
function removeProduct (arg) {
  let product = store.getValue('productSet').get(arg.productId)
  if (product !== undefined) {
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
        let order = store.getValue('productOrder').findKey(id => id === arg.productId)
        store.setValue('productSet', store.getValue('productSet').delete(arg.productIdx))
        store.setValue('productOrder', store.getValue('productOrder').splice(order, 1))
        store.setValue('eventList', store.getValue('eventList').filterNot(event => event.get('productId') === arg.productId))
        store.emitChange()
      }
    })
  }
}

function isValidNameForProduct (name) {
  return store.getValue('productSet').find(product => {
    return product.get('name') === name
  }) === undefined
}