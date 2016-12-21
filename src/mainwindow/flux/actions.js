'use strict'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import * as eventActions from './actions.event'
import * as productActions from './actions.product'

export const INITIALIZE_STORE = 'initialize-store'

export default function initActions (ipcModule) {
  eventActions.initialize(ipcModule)
  productActions.initialize(ipcModule)
  dispatcher.register(INITIALIZE_STORE, initializeStore)
}

function initializeStore (arg) {
  store.setValue('productList', arg.productList)
  store.setValue('eventList', arg.eventList)
  store.emitChange()
}