'use strict'

import dispatcher from '../../util/flux/dispatcher'
import store from './store'
import * as util from '../../util/util'

export const INITIALIZE_STORE = 'initialize-store'
export const CHANGE_EVENTGROUP_FIELD = 'change-eventgroup-field'
export const CHANGE_EVENT_FIELD = 'change-event-field'
export const REMOVE_EVENT = 'remove-event'

export function initialize () {
  dispatcher.register(INITIALIZE_STORE, initializeStore)
  dispatcher.register(CHANGE_EVENTGROUP_FIELD, changeEventGroupField)
  dispatcher.register(CHANGE_EVENT_FIELD, changeEventField)
  dispatcher.register(REMOVE_EVENT, removeEvent)
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
  let newValue
  if (arg.field === 'eventList') {
    let newEvent = store.getInValue(['eventGroup', arg.field, 0])
    if (newEvent.get('productId') && newEvent.get('amount') !== 0) {
      newValue = store.getInValue(['eventGroup', arg.field]).withMutations(eventList => {
        eventList.set(0, newEvent.set('amount', 0)).push(newEvent)
      })
    } else {
      //TODO: show error message
      return
    }
  } else {
    newValue = arg.value
  }
  store.setInValue(['eventGroup', arg.field], newValue)
  store.emitChange()
}

/**
 * 
 * 
 * @param {object} {idx: number, field: string, value: string}
 */
function changeEventField (arg) {
  if (arg.field === 'amount' && !util.isNumeric(arg.value)) {
    return
  }

  let newValue
  if (arg.field === 'amount') {
    newValue = Number(arg.value)
  } else {
    newValue = arg.value
  }

  store.setInValue(['eventGroup', 'eventList', arg.idx, arg.field], newValue)
  store.emitChange()
}

function removeEvent (idx) {
  let eventList = store.getInValue(['eventGroup', 'eventList'])
  store.setInValue(['eventGroup', 'eventList'], eventList.delete(idx))
  store.emitChange()
}