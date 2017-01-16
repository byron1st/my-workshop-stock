'use strict'

import {List, Map, Record} from 'immutable'

import Store from '../../util/flux/store'

const Data = Record({
  eventGroupList: List([]),
  productSet: Map({})
})

export default new Store(new Data())
