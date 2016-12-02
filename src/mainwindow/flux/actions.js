'use strict'

import * as eventActions from './actions.event'

export default function initActions (ipcModule) {
  eventActions.initialize(ipcModule)
}