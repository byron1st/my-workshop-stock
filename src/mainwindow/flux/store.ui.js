'use strict'

import {Record, List} from 'immutable'

import Store from '../../util/flux/store'

const Data = Record({
  isValidNameForProduct: true,
  searchTerm: '',
  locale: '',
  isArchivedVisible: false,
  editableProductList: List([])
})

export default new Store(new Data())
