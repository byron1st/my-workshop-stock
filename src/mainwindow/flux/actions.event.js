/*global $*/
'use strict'

import {Map} from 'immutable'
import {remote} from 'electron'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import * as util from '../../util/util'
import generateId from '../../util/id.generator'

let ipc = {}

export const UPDATE_NEWEVENT_FIELD = 'update-newevent-field'
export const ADD_NEWEVENT = 'add-newevent'
export const DELETE_EVENT = 'delete-event'
export const SEARCH_PRODUCTNAME = 'search-productname'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.
  dispatcher.register(UPDATE_NEWEVENT_FIELD, updateNewEventField)
  dispatcher.register(ADD_NEWEVENT, addNewEvent)
  dispatcher.register(DELETE_EVENT, deleteEvent)
  dispatcher.register(SEARCH_PRODUCTNAME, searchProductName)
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
    editable: false
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

function refineProductAmount (productId, changedValue) {
  let product = store.getValue('productSet').get(productId)
  if (product !== undefined) {
    let changedProduct = product.set('amount', product.get('amount') + changedValue)
    store.setValue('productSet', store.getValue('productSet').set(productId, changedProduct))
  }
}