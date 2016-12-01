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

const Data = Record({
  // productList: List([]),
  productList: productListTest,
  eventList: List([]),
  bodyTopAmount: 3000
})

export default new Store(new Data())
