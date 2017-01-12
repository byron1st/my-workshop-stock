'use strict'

import {Map} from 'immutable'

export const defaultEventValue = new Map({
  date: new Date(),
  amount: 0,
  productId: '',
  productName: '',
  type: 'sale'
})

export const supportLocales = ['en', 'ko']

export const EVENT_TYPE = {
  READY: 'event-ready',
  PROCESSING: 'event-processing',
  DONE: 'event-done',
  ARCHIVED: 'event-archived'
}

export const EVENTGROUP_STATUS = {
  READY: 'egstatus-ready',
  PROCESSING: 'egstatus-processing',
  DONE: 'egstatus-done',
  ARCHIVED: 'egstatus-archived'
}

export const EVENTGROUP_KIND = {
  SALE: 'egkind-sale',
  PRODUCTION: 'egkind-production'
}

export const ID_KIND = {
  EVENT: 'idkind-event',
  EVENTGROUP: 'idkind-eventgroup',
  PRODUCT: 'idkind-product'
}
