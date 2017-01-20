'use strict'

import {remote, ipcRenderer} from 'electron'
import Immutable from 'immutable'

import dispatcher from '../../util/flux/dispatcher'
import uiStore from './store.ui'
import dataStore from './store.data'
import * as c from '../../util/const'
import * as ch from '../../util/ipc.channels'
import generateId from '../../util/id.generator'
import getText from '../../util/locale'

let ipc = {}

export const DELETE_EVENTGROUP = 'delete-eventgroup'
export const SEARCH_PRODUCTNAME = 'search-productname'
export const PROCEED_EVENTGROUP_STATUS = 'proceed-eventgroup-status'
export const UNDO_EVENTGROUP_STATUS = 'undo-eventgroup-status'
export const TOGGLE_ARCHIVED = 'toggle-archived'
export const CHANGE_ACTIVE_TAB = 'change-active-tab'
export const CHANGE_ACTIVE_KIND = 'change-active-kind'
export const OPEN_ADDWINDOW = 'open-addwindow'
export const ADD_EVENTGROUP = 'add-eventgroup'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.

  dispatcher.register(DELETE_EVENTGROUP, deleteEventGroup)
  dispatcher.register(SEARCH_PRODUCTNAME, searchProductName)
  dispatcher.register(PROCEED_EVENTGROUP_STATUS, proceedEventGroupStatus)
  dispatcher.register(UNDO_EVENTGROUP_STATUS, undoEventGroupStatus)
  dispatcher.register(TOGGLE_ARCHIVED, toggleArchived)
  dispatcher.register(CHANGE_ACTIVE_TAB, changeActiveTab)
  dispatcher.register(CHANGE_ACTIVE_KIND, changeActiveKind)
  dispatcher.register(OPEN_ADDWINDOW, openAddwindow)
  dispatcher.register(ADD_EVENTGROUP, addEventGroup)
}

/**
 * 
 * 
 * @param {Object} {eventGroupId: String}
 */
function deleteEventGroup (eventGroupId) {
  remote.dialog.showMessageBox({
    type: 'question',
    buttons: [getText('OK'), getText('Cancel')],
    defaultId: 1,
    message: getText('Will you delete this event?'),
    cancelId: 1
  }, (index) => {
    if (index === 1) {
      return
    } else {
      let eventGroup = dataStore.getInValue(['eventGroupSet', eventGroupId])
      let eventIdList = eventGroup.get('eventIdList')
      
      let filteredEventGroupIdList = dataStore.getValue('eventGroupIdList').filter(id => id !== eventGroupId)
      let filteredEventSet = dataStore.getValue('eventSet').filter(event => {
        let id = event.get('id')
        if (eventIdList.indexOf(id) === -1) {
          return true
        } else {
          _refineProductAmount(event.get('productId'), eventGroup.get('kind'), (event.get('amount') * -1))
          return false
        }
      })

      dataStore.setValue('eventGroupSet', dataStore.getValue('eventGroupSet').delete(eventGroupId))
      dataStore.setValue('eventGroupIdList', filteredEventGroupIdList)
      dataStore.setValue('eventSet', filteredEventSet)
      dataStore.emitChange()
    }
  })
}

function searchProductName (searchTerm) {
  uiStore.setValue('searchTerm', searchTerm)
  uiStore.emitChange()
}

function proceedEventGroupStatus (eventGroupId) {
  let eventGroup = dataStore.getInValue(['eventGroupSet', eventGroupId])
  let changedEventGroup
  switch (eventGroup.get('status')) {
  case c.EVENTGROUP_STATUS.READY:
    changedEventGroup = eventGroup.set('status', c.EVENTGROUP_STATUS.PROCESSING)
    break
  case c.EVENTGROUP_STATUS.PROCESSING:
    changedEventGroup = eventGroup.set('status', c.EVENTGROUP_STATUS.DONE)
    break
  case c.EVENTGROUP_STATUS.DONE:
    changedEventGroup = eventGroup.set('status', c.EVENTGROUP_STATUS.ARCHIVED)
    break
  }

  dataStore.setValue('eventGroupSet', dataStore.getValue('eventGroupSet').set(eventGroupId, changedEventGroup))
  dataStore.emitChange()
}

function undoEventGroupStatus (eventGroupId) {
  let eventGroup = dataStore.getInValue(['eventGroupSet', eventGroupId])
  let changedEventGroup
  switch (eventGroup.get('status')) {
  case c.EVENTGROUP_STATUS.PROCESSING:
    changedEventGroup = eventGroup.set('status', c.EVENTGROUP_STATUS.READY)
    break
  case c.EVENTGROUP_STATUS.DONE:
    changedEventGroup = eventGroup.set('status', c.EVENTGROUP_STATUS.PROCESSING)
    break
  case c.EVENTGROUP_STATUS.ARCHIVED:
    changedEventGroup = eventGroup.set('status', c.EVENTGROUP_STATUS.DONE)
    break
  }

  dataStore.setValue('eventGroupSet', dataStore.getValue('eventGroupSet').set(eventGroupId, changedEventGroup))
  dataStore.emitChange()
}

function toggleArchived (isArchivedVisible) {
  uiStore.setValue('isArchivedVisible', isArchivedVisible)
  uiStore.emitChange()
}

function changeActiveTab (tab) {
  uiStore.setValue('activeTab', tab) 
  uiStore.emitChange()
}

function changeActiveKind (kind) {
  uiStore.setValue('activeKind', kind) 
  uiStore.emitChange()
}

function openAddwindow () {
  ipcRenderer.send(ch.OPEN_ADDWINDOW, dataStore.getValue('productSet').toJS())
}

function addEventGroup (transportedEventGroup) {
  let newEventGroup = {
    id: generateId(c.ID_KIND.EVENTGROUP),
    title: transportedEventGroup.title,
    date: transportedEventGroup.date,
    kind: transportedEventGroup.kind,
    status: c.EVENTGROUP_STATUS.READY
  }

  let newEventIdList = []
  transportedEventGroup.eventList.forEach(transportedEvent => {
    let newEvent = {
      id: generateId(c.ID_KIND.EVENT),
      amount: transportedEvent.amount,
      productId: transportedEvent.productId
    }
    newEventIdList.push(newEvent.id)
    dataStore.setInValue(['eventSet', newEvent.id], Immutable.fromJS(newEvent))
    _refineProductAmount(newEvent.productId, newEventGroup.kind, newEvent.amount)
  })
  newEventGroup.eventIdList = newEventIdList
  
  let updatedEventGroupSet = dataStore.getValue('eventGroupSet').set(newEventGroup.id, Immutable.fromJS(newEventGroup))
  let sortedList = dataStore.getValue('eventGroupIdList').push(newEventGroup.id).sort((prev, next) => {
    if (updatedEventGroupSet.getIn([prev, 'date']) < updatedEventGroupSet.getIn([next, 'date'])) {
      return 1
    } else {
      return -1
    }
  })

  dataStore.setValue('eventGroupIdList', sortedList)
  dataStore.setValue('eventGroupSet', updatedEventGroupSet)
  dataStore.emitChange()
}

function _refineProductAmount (productId, kind, value) {
  let changedValue = value
  if (kind === c.EVENTGROUP_KIND.SALE) {
    changedValue = -1 * changedValue
  }

  let product = dataStore.getValue('productSet').get(productId)
  if (product !== undefined) {
    let changedProduct = product.set('stock', product.get('stock') + changedValue)
    dataStore.setValue('productSet', dataStore.getValue('productSet').set(productId, changedProduct))
  }
}