'use strict'

import {Record} from 'immutable'

import Store from '../../util/flux/store'
import * as test from './store.main.test'
import * as c from '../../util/const'

const Data = Record({
  // productList: List([]),
  // eventList: List([]),
  productList: test.productList,
  eventList: test.eventList,
  newEvent: c.defaultEventValue,
  isValidNameForProduct: true
})

export default new Store(new Data())
