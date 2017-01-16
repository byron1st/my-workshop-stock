'use strict'

import dispatcher from '../../util/flux/dispatcher'
import store from './store'

export const INITIALIZE_STORE = 'initialize-store'
export const CHANGE_EVENTGROUP_FIELD = 'change-eventgroup-field'
export const CHANGE_EVENT_FIELD = 'change-event-field'

export function initialize () {
  dispatcher.register(INITIALIZE_STORE, initializeStore)
  dispatcher.register(CHANGE_EVENTGROUP_FIELD, changeEventGroupField)
  dispatcher.register(CHANGE_EVENT_FIELD, changeEventField)
}

function initializeStore (productSet) {
  store.setValue('productSet', productSet)
  store.emitChange()
}

/**
 * 
 * 
 * @param {object} {field: string, value: string}
 */
function changeEventGroupField (arg) {
  store.setInValue(['eventGroup', arg.field], arg.value)
  store.emitChange()
}

function changeEventField (arg) {
  arg
}