'use strict'

import {Map} from 'immutable'

export const defaultEventValue = new Map({
  date: new Date(),
  amount: 0,
  productId: '',
  productName: '',
  type: 'sale'
})