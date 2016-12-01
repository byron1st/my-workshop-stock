'use strict'

import {List, Record} from 'immutable'

import Store from '../../util/flux/store'

const Data = Record({
  productList: List([]),
  eventList: List([]),
  bodyTopAmount: 0
})

export default new Store(new Data())
