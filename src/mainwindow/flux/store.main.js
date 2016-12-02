'use strict'

import {List, Map, Record} from 'immutable'

import Store from '../../util/flux/store'

const p1 = new Map({
  id: 'id1',
  name: '제품 1',
  amount: 100,
  editable: false
})
const p2 = new Map({
  id: 'id2',
  name: '제품 asdf 1',
  amount: 200,
  editable: true
})
const p3 = new Map({
  id: 'id3',
  name: '제품 kkkk 1',
  amount: -100,
  editable: false
})
const p4 = new Map({
  id: 'id4',
  name: '제품 1 yyyyoaijsdofi',
  amount: 100,
  editable: false
})
const productListTest = List([p1, p2, p3, p4])

const e1 = new Map({
  id: 'e1',
  date: new Date(2016, 1, 3),
  amount: 100,
  productId: 'id1',
  productName: '제품 1',
  editable: false
})
const e2 = new Map({
  id: 'e2',
  date: new Date(2016, 1, 3),
  amount: 3200,
  productId: 'id1',
  productName: '제품 1',
  editable: false
})
const e3 = new Map({
  id: 'e3',
  date: new Date(2016, 1, 3),
  amount: -100,
  productId: 'id1',
  productName: '제품 1',
  editable: false
})
const eventListTest = List([e1, e2, e3])

const Data = Record({
  // productList: List([]),
  // eventList: List([]),
  // bodyTopAmount: 0
  productList: productListTest,
  eventList: eventListTest,
  bodyTopAmount: 3000
})

export default new Store(new Data())
