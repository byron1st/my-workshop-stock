'use strict'

import {List, Map} from 'immutable'

const p1 = new Map({
  id: 1,
  name: '제품 1',
  amount: 3200,
  editable: false
})
const p2 = new Map({
  id: 2,
  name: '제품 asdf 1',
  amount: 0,
  editable: false
})
const p3 = new Map({
  id: 3,
  name: '제품 kkkk 1',
  amount: 0,
  editable: false
})
const p4 = new Map({
  id: 4,
  name: '제품 1 yyyyoaijsdofi',
  amount: 0,
  editable: false
})
export const productList = List([p1, p2, p3, p4])

const e1 = new Map({
  id: 11,
  date: new Date(2016, 1, 3),
  amount: 100,
  productId: 1,
  productName: '제품 1',
  editable: false
})
const e2 = new Map({
  id: 22,
  date: new Date(2016, 1, 3),
  amount: 3200,
  productId: 1,
  productName: '제품 1',
  editable: false
})
const e3 = new Map({
  id: 33,
  date: new Date(2016, 1, 3),
  amount: -100,
  productId: 1,
  productName: '제품 1',
  editable: false
})
export const eventList = List([e1, e2, e3])