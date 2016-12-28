'use strict'

import Immutable from 'immutable'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import {initIds} from '../../util/id.generator'
import * as eventActions from './actions.event'
import * as productActions from './actions.product'

export const INITIALIZE_STORE = 'initialize-store'

export default function initActions (ipcModule) {
  eventActions.initialize(ipcModule)
  productActions.initialize(ipcModule)
  dispatcher.register(INITIALIZE_STORE, initializeStore)
}

function initializeStore (arg) {
  initIds(arg.eventList, arg.productOrder)
  store.setValue('productSet', Immutable.fromJS(arg.productSet))
  store.setValue('eventList', Immutable.fromJS(arg.eventList))
  store.setValue('productOrder', Immutable.fromJS(arg.productOrder))
  store.setValue('locale', arg.locale)
  store.emitChange()
}