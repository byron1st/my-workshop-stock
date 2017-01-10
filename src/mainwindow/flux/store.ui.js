'use strict'

import {Record} from 'immutable'

import Store from '../../util/flux/store'

const Data = Record({
  isValidNameForProduct: true,
  searchTerm: '',
  locale: '',
  isArchivedVisible: false
})

export default new Store(new Data())
