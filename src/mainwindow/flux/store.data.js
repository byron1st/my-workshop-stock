'use strict'

import {Record} from 'immutable'

import Store from '../../util/flux/store'

const Data = Record({
  productSet: {},
  eventSet: {},
  eventGroupSet: {},
  productIdList: [],
  eventGroupIdList: []
})

export default new Store(new Data())
