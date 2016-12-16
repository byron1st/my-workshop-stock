'use strict'

import * as eventActions from './actions.event'
import * as productActions from './actions.product'

export default function initActions (ipcModule) {
  eventActions.initialize(ipcModule)
  productActions.initialize(ipcModule)
}