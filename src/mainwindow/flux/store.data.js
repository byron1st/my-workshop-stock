'use strict'

import {Record} from 'immutable'

import Store from '../../util/flux/store'
import * as c from '../../util/const'

const Data = Record({
  productSet: {},
  eventSet: {},
  eventGroupSet: {},
  productIdList: [],
  eventGroupIdList: []
})

export default new Store(new Data())
