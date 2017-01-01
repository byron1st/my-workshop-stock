'use strict'

import {Record, List, Map} from 'immutable'

import Store from '../../util/flux/store'
import * as c from '../../util/const'

const Data = Record({
  productSet: Map({}),
  eventList: List([]),
  productOrder: List([]),
  newEvent: c.defaultEventValue,
  isValidNameForProduct: true,
  searchTerm: '',
  locale: '',
  isArchivedVisible: false
})

export default new Store(new Data())
