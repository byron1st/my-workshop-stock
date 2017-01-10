'use strict'

import {Record} from 'immutable'

import Store from '../../util/flux/store'
import * as c from '../../util/const'

const Data = Record({
  isValidNameForProduct: true,
  searchTerm: '',
  locale: '',
  isArchivedVisible: false
})

export default new Store(new Data())
