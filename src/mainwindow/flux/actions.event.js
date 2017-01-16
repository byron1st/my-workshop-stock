'use strict'

import {remote, ipcRenderer} from 'electron'

import dispatcher from '../../util/flux/dispatcher'
import uiStore from './store.ui'
import dataStore from './store.data'
import * as c from '../../util/const'
import * as ch from '../../util/ipc.channels'

let ipc = {}

export const DELETE_EVENTGROUP = 'delete-eventgroup'
export const SEARCH_PRODUCTNAME = 'search-productname'
export const PROCEED_EVENTGROUP_STATUS = 'proceed-eventgroup-status'
export const UNDO_EVENTGROUP_STATUS = 'undo-eventgroup-status'
export const TOGGLE_ARCHIVED = 'toggle-archived'
export const CHANGE_ACTIVE_TAB = 'change-active-tab'
export const OPEN_ADDWINDOW = 'open-addwindow'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.

  dispatcher.register(DELETE_EVENTGROUP, deleteEventGroup)
  dispatcher.register(SEARCH_PRODUCTNAME, searchProductName)
  dispatcher.register(PROCEED_EVENTGROUP_STATUS, proceedEventGroupStatus)
  dispatcher.register(UNDO_EVENTGROUP_STATUS, undoEventGroupStatus)
  dispatcher.register(TOGGLE_ARCHIVED, toggleArchived)
  dispatcher.register(CHANGE_ACTIVE_TAB, changeActiveTab)
  dispatcher.register(OPEN_ADDWINDOW, openAddwindow)
}

function deleteEventGroup (arg) {
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
      let eventGroup = dataStore.getInValue(['eventGroupSet', arg.eventGroupId])
      let eventIdList = eventGroup.get('eventIdList')

      let filteredEventGroupIdList = dataStore.getValue('eventGroupIdList').filter(id => id !== arg.eventGroupId)
      let filteredEventSet = dataStore.getValue('eventSet').filter(event => {
        let id = event.get('id')
        if (eventIdList.indexOf(id) === -1) {
          return true
        } else {
          return false
        }
      })

      dataStore.setValue('eventGroupSet', dataStore.getValue('eventGroupSet').delete(arg.eventGroupId))
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

function openAddwindow () {
  ipcRenderer.send(ch.OPEN_ADDWINDOW, dataStore.getValue('productSet').toJS())
}

// function _refineProductAmount (productId, changedValue) {
//   let product = store.getValue('productSet').get(productId)
//   if (product !== undefined) {
//     let changedProduct = product.set('amount', product.get('amount') + changedValue)
//     store.setValue('productSet', store.getValue('productSet').set(productId, changedProduct))
//   }
// }