'use strict'

import Immutable, {Map, Record} from 'immutable'

import Store from '../../util/flux/store'
import {getEmptyEventGroup} from '../../util/util'

const Data = Record({
  eventGroupList: Immutable.fromJS(
    [getEmptyEventGroup()]
  ),
  productSet: Map({})
})

export default new Store(new Data())
