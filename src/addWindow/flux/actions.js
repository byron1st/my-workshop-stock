'use strict'

import dispatcher from '../../util/flux/dispatcher'
import store from './store'
import * as c from '../../util/const'
import * as util from '../../util/util'

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
  let newValue
  if (arg.field === 'eventList') {
    let newEvent = store.getInValue(['eventGroup', arg.field, 0])
    newValue = store.getInValue(['eventGroup', arg.field]).withMutations(eventList => {
      eventList.set(0, newEvent.set('amount', 0)).push(newEvent)
    })
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