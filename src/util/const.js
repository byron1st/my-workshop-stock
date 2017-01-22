'use strict'

export const LOCALE_LIST = ['en', 'ko']

export const BACKUP_TIME_INTERVAL = 5 * 60 * 1000

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
  PRODUCTION: 'egkind-production',
  ALL: 'egkind-all'
}

export const ID_KIND = {
  EVENT: 'idkind-event',
  EVENTGROUP: 'idkind-eventgroup',
  PRODUCT: 'idkind-product'
}

export const UI_TAB = {
  ALL: 'uitab-all',
  READY: 'uitab-ready',
  PROCESSING: 'uitab-processing',
  DONE: 'uitab-done'
}

export const EMPTY_EVENT = {
  amount: 0,
  productId: '',
  error: {
    productId: true,
    amount: true
  }
}

export const STATUS_ICON_NAME = {
  ALL: 'hourglass full',
  READY: 'hourglass start',
  PROCESSING: 'hourglass half',
  DONE: 'hourglass end',
  ARCHIVED: 'archive'
}
