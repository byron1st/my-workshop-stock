'use strict'

import {ID_KIND} from './const'

let ID_LIST = {}

export default function generateId (kind) {
  let idList = ID_LIST[kind]

  let id
  do {
    id = (Math.floor(Math.random() * (100000 - 1)) + 1).toString()
  } while (idList.indexOf(id) !== -1)

  idList.push(id)
  return id
}

export function initIds (eventIdList, eventGroupIdList, productIdList) {
  ID_LIST[ID_KIND.EVENT] = eventIdList.map(id => id)
  ID_LIST[ID_KIND.EVENTGROUP] = eventGroupIdList.map(id => id)
  ID_LIST[ID_KIND.PRODUCT] = productIdList.map(id => id)
}
