'use strict'

import dispatcher from '../../util/flux/dispatcher'
import store from './store'

export const INITIALIZE_STORE = 'initialize-store'

export function initialize () {
  dispatcher.register(INITIALIZE_STORE, initializeStore)
}

function initializeStore (productSet) {
  store.setValue('productSet', productSet)
  store.emitChange()
}