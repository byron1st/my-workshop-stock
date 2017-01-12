/*global $*/
'use strict'

import {Map} from 'immutable'
import {remote} from 'electron'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import uiStore from './store.ui'
import * as util from '../../util/util'
import * as c from '../../util/const'
import generateId from '../../util/id.generator'

let ipc = {}

export const UPDATE_NEWEVENT_FIELD = 'update-newevent-field'
export const ADD_NEWEVENT = 'add-newevent'
export const DELETE_EVENT = 'delete-event'
export const SEARCH_PRODUCTNAME = 'search-productname'
export const APPROVE_EVENT = 'approve-event'
export const DISAPPROVE_EVENT = 'disapprove-event'
export const TOGGLE_ARCHIVED = 'toggle-archived'
export const CHANGE_ACTIVE_TAB = 'change-active-tab'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.
  dispatcher.register(UPDATE_NEWEVENT_FIELD, updateNewEventField)
  dispatcher.register(ADD_NEWEVENT, addNewEvent)
  dispatcher.register(DELETE_EVENT, deleteEvent)
  dispatcher.register(SEARCH_PRODUCTNAME, searchProductName)
  dispatcher.register(APPROVE_EVENT, approveEvent)
  dispatcher.register(DISAPPROVE_EVENT, disapproveEvent)
  dispatcher.register(TOGGLE_ARCHIVED, toggleArchived)
  dispatcher.register(CHANGE_ACTIVE_TAB, changeActiveTab)
}

/**
 * update newEvent field
 *
 * @param      {object}  arg     {field: string, value: string}
 */
function updateNewEventField (arg) {
  if (arg.field === 'amount') {
    if (arg.value.indexOf(',') !== -1) {
      arg.value = arg.value.replace(',', '')
    }
    if (!util.isNumeric(arg.value)) {
      return
    }
    arg.value = Number(arg.value)
  }
  store.setInValue(['newEvent', arg.field], arg.value)
  store.emitChange()
}

/**
 * Adds a new event.
 *
 * @param      {object}  newEventObj  The new event object
 */
function addNewEvent (newEventObj) {
  /*validate fields*/
  let validationResult = true
  if (newEventObj.productId === '') {
    $('#productInputForm').addClass('error')
    validationResult = false
  }
  if (newEventObj.amount === 0) {
    $('#amountInputForm').addClass('error')
    validationResult = false
  }
  if (!validationResult) {
    return
  }

  /*create an object of a new event*/
  let amount = newEventObj.amount
  let productId = newEventObj.productId
  if (newEventObj.type === 'sale') {
    amount = amount * -1
  }
  let event = new Map({
    id: generateId('event'),
    date: newEventObj.date,
    amount: amount,
    productId: productId,
    productName: store.getValue('productSet').get(productId).get('name'),
    editable: false,
    status: c.EVENT_TYPE.READY
  })

  /*insert the new one and sort the list*/
  let eventList = store.getValue('eventList')
    .insert(0, event)
    .sort((prev, next) => {
      if (prev.get('date') < next.get('date')) {
        return 1
      } else {
        return 0
      }
    })

  refineProductAmount(event.get('productId'), event.get('amount'))
  store.setInValue(['newEvent', 'amount'], 0)
  store.setValue('eventList', eventList)
  store.emitChange()
}

/**
 * Delete an event
 *
 * @param      {object}  arg     {eventIndex: number, text: object}
 */
function deleteEvent (arg) {
  remote.dialog.showMessageBox({
    type: 'question',
    buttons: [arg.text['OK'], arg.text['Cancel']],
    defaultId: 1,
    message: arg.text['Will you delete this event?'],
    cancelId: 1
  }, (index) => {
    if (index === 1) {
      return
    } else {
      let willBeDeletedEvent = store.getValue('eventList').get(arg.eventIndex)
      refineProductAmount(willBeDeletedEvent.get('productId'), (-1 * willBeDeletedEvent.get('amount')))
      store.setValue('eventList', store.getValue('eventList').delete(arg.eventIndex))
      store.emitChange()
    }
  })
}

function searchProductName (searchTerm) {
  store.setValue('searchTerm', searchTerm)
  store.emitChange()
}

function approveEvent (index) {
  let event = store.getValue('eventList').get(index)
  let approvedEvent
  switch (event.get('status')) {
  case c.EVENT_TYPE.READY:
    approvedEvent = event.set('status', c.EVENT_TYPE.PROCESSING)
    break
  case c.EVENT_TYPE.PROCESSING:
    approvedEvent = event.set('status', c.EVENT_TYPE.DONE)
    break
  case c.EVENT_TYPE.DONE:
    approvedEvent = event.set('status', c.EVENT_TYPE.ARCHIVED)
    break
  }

  store.setValue('eventList', store.getValue('eventList').set(index, approvedEvent))
  store.emitChange()
}

function disapproveEvent (index) {
  let event = store.getValue('eventList').get(index)
  let approvedEvent
  switch (event.get('status')) {
  case c.EVENT_TYPE.PROCESSING:
    approvedEvent = event.set('status', c.EVENT_TYPE.READY)
    break
  case c.EVENT_TYPE.DONE:
    approvedEvent = event.set('status', c.EVENT_TYPE.PROCESSING)
    break
  case c.EVENT_TYPE.ARCHIVED:
    approvedEvent = event.set('status', c.EVENT_TYPE.DONE)
    break
  }

  store.setValue('eventList', store.getValue('eventList').set(index, approvedEvent))
  store.emitChange()
}

function toggleArchived (isArchivedVisible) {
  store.setValue('isArchivedVisible', isArchivedVisible)
  store.emitChange()
}

function changeActiveTab (tab) {
  uiStore.setValue('activeTab', tab) 
  uiStore.emitChange()
}

function refineProductAmount (productId, changedValue) {
  let product = store.getValue('productSet').get(productId)
  if (product !== undefined) {
    let changedProduct = product.set('amount', product.get('amount') + changedValue)
    store.setValue('productSet', store.getValue('productSet').set(productId, changedProduct))
  }
}