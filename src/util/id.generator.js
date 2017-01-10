'use strict'

let eventId = []
let eventGroupId = []
let productId = []

export const ID_KIND = {
  EVENT: 'idkind-event',
  EVENTGROUP: 'idkind-eventgroup',
  PRODUCT: 'idkind-product'
}

export default function generateId (kind) {
  let idList

  switch (kind) {
  case ID_KIND.EVENT:
    idList = eventId
    break
  case ID_KIND.EVENTGROUP:
    idList = eventGroupId
    break
  case ID_KIND.PRODUCT:
    idList = productId
    break
  }

  let id
  do {
    let idValue = Math.floor(Math.random() * (100000 - 1)) + 1
    id = idValue.toString()
  } while (idList.indexOf(id) !== -1)

  idList.push(id)
  return id
}

export function initIds (eventIdList, eventGroupIdList, productIdList) {
  eventId = eventIdList.map(id => id)
  eventGroupId = eventGroupIdList.map(id => id)
  productId = productIdList.map(id => id)

  console.log(eventId)
  console.log(eventGroupId)
  console.log(productId)
}