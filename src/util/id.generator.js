'use strict'

let eventId = []
let productId = []

export default function generateId (kind) {
  let idList
  if (kind === 'event') {
    idList = eventId
  } else {
    idList = productId
  }

  let id
  do {
    let idValue = Math.floor(Math.random() * (100000 - 1)) + 1
    id = idValue.toString()
  } while (idList.indexOf(id) !== -1)

  idList.push(id)
  return id
}

export function initIds (eventList, productOrder) {
  eventId = eventList.map(event => event.id)
  productId = productOrder.map(id => id)
  console.log(productOrder)
}