/*eslint-disable no-unused-vars*/
'use strict'

import {Map} from 'immutable'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import * as util from '../../util/util'
import generateId from '../../util/id.generator'

let ipc = {}

export const ADD_NEWPRODUCT = 'add-newproduct'
export const ISVALIDNAME_FOR_PRODUCT = 'isvalidname-for-product'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.
  dispatcher.register(ADD_NEWPRODUCT, addNewProduct)
  dispatcher.register(ISVALIDNAME_FOR_PRODUCT, checkName)
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

function isValidNameForProduct (name) {
  return store.getValue('productList').find(product => {
    return product.get('name') === name
  }) === undefined
}