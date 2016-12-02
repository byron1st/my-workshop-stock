'use strict'

import {Map, Record} from 'immutable'

import Store from '../../util/flux/store'
import * as test from './store.main.test'

const defaultEventValue = new Map({
  date: new Date(),
  amount: 0,
  productId: '',
  productName: '',
  type: 'sale'
})

const Data = Record({
  // productList: List([]),
  // eventList: List([]),
  productList: test.productList,
  eventList: test.eventList,
  newEvent: defaultEventValue
})

export default new Store(new Data())
