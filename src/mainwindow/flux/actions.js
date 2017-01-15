'use strict'

import Immutable from 'immutable'

import dispatcher from '../../util/flux/dispatcher'
// import store from './store.main'
import dataStore from './store.data'
import uiStore from './store.ui'
import {initIds} from '../../util/id.generator'
import * as eventActions from './actions.event'
import * as productActions from './actions.product'

export const INITIALIZE_STORE = 'initialize-store'

export default function initActions (ipcModule) {
  eventActions.initialize(ipcModule)
  productActions.initialize(ipcModule)
  dispatcher.register(INITIALIZE_STORE, initializeStore)
}

/**
 * Initialize the store
 * 
 * @param   arg   {Object}    {initStore: Object, initLocale: String}
 */
function initializeStore (arg) {
  initIds(Object.keys(arg.initStore.eventSet), arg.initStore.eventGroupIdList, arg.initStore.productIdList)
  dataStore.setValue('productSet', Immutable.fromJS(arg.initStore.productSet))
  dataStore.setValue('eventSet', Immutable.fromJS(arg.initStore.eventSet))
  dataStore.setValue('eventGroupSet', Immutable.fromJS(arg.initStore.eventGroupSet))
  dataStore.setValue('productIdList', Immutable.fromJS(arg.initStore.productIdList))
  dataStore.setValue('eventGroupIdList', Immutable.fromJS(arg.initStore.eventGroupIdList))
  uiStore.setValue('locale', arg.locale)
  dataStore.emitChange()
  uiStore.emitChange()
}