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
    id = Math.random()
  } while (idList.indexOf(id) !== -1)

  idList.push(id)
  return id
}

export function initIds (eventList, productList) {
  eventId = eventList.map(event => event.id)
  productId = productList.map(product => product.id)
}