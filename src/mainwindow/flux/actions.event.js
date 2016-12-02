'use strict'

import dispatcher from '../../util/flux/dispatcher'
import store from './store.main'
import * as util from '../../util/util'

let ipc = {}

export const UPDATE_NEWEVENT_FIELD = 'update-newevent-field'

export function initialize (ipcModule) {
  ipc = ipcModule
  ipc //TODO: should be deleted.
  dispatcher.register(UPDATE_NEWEVENT_FIELD, updateNewEventField)
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