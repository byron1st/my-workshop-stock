/*global $*/
'use strict'

import {Map} from 'immutable'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import * as util from '../../util/util'
import generateId from '../../util/id.generator'

let ipc = {}

export const UPDATE_NEWEVENT_FIELD = 'update-newevent-field'
export const ADD_NEWEVENT = 'add-newevent'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.
  dispatcher.register(UPDATE_NEWEVENT_FIELD, updateNewEventField)
  dispatcher.register(ADD_NEWEVENT, addNewEvent)
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
  let productId = Number(newEventObj.productId)
  if (newEventObj.type === 'sale') {
    amount = amount * -1
  }
  let event = new Map({
    id: generateId('event'),
    date: newEventObj.date,
    amount: amount,
    productId: productId,
    productName: store.getValue('productList').find(product => product.get('id') === productId).get('name'),
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

  store.setInValue(['newEvent', 'amount'], 0)
  store.setValue('eventList', eventList)
  store.emitChange()
}