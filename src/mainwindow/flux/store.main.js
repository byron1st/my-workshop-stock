'use strict'

import {Record, List} from 'immutable'

import Store from '../../util/flux/store'
import * as c from '../../util/const'

const Data = Record({
  productList: List([]),
  eventList: List([]),
  newEvent: c.defaultEventValue,
  isValidNameForProduct: true,
  searchTerm: '',
  locale: ''
})

export default new Store(new Data())
