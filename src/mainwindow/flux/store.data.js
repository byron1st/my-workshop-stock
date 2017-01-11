'use strict'

import {Record, Map, List} from 'immutable'

import Store from '../../util/flux/store'

const Data = Record({
  productSet: Map({}),
  eventSet: Map({}),
  eventGroupSet: Map({}),
  productIdList: List([]),
  eventGroupIdList: List([])
})

export default new Store(new Data())
