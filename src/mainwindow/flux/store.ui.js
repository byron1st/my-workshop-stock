'use strict'

import {Record, List} from 'immutable'

import Store from '../../util/flux/store'
import * as c from '../../util/const'

const Data = Record({
  isValidNameForProduct: true,
  searchTerm: '',
  locale: '',
  isArchivedVisible: false,
  editableProductList: List([]),
  activeTab: c.UI_TAB.ALL,
  activeKind: c.EVENTGROUP_KIND.ALL
})

export default new Store(new Data())
