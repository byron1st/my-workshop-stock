'use strict'

import {ID_KIND} from '../../util/const'

let ID_LIST = {}

export default function generateId (kind) {
  let id
  do {
    id = (Math.floor(Math.random() * (100000 - 1)) + 1).toString()
  } while (ID_LIST[kind].indexOf(id) !== -1)

  ID_LIST[kind].push(id)
  return id
}

export function initIds (eventIdList, eventGroupIdList, productIdList) {
  ID_LIST[ID_KIND.EVENT] = eventIdList.map(id => id)
  ID_LIST[ID_KIND.EVENTGROUP] = eventGroupIdList.map(id => id)
  ID_LIST[ID_KIND.PRODUCT] = productIdList.map(id => id)
}
