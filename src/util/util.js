'use strict'

import Immutable, {Map} from 'immutable'
import * as c from './const'

/**
 * Gets the date string.
 *
 * @param      {Date}  date    The date
 * @return     {string}  The date string.
 */
export function getDateString (date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

/**
 * Gets the currency value.
 *
 * @param      {number}  amount  The amount
 * @return     {string} currency string value
 */
export function getCurrencyValue (amount) {
  let isNegative = amount < 0
  let converted
  if (isNegative) {
    let notNegativeAmount = amount * -1
    converted = notNegativeAmount.toString()
  } else {
    converted = amount.toString()
  }

  let idx = converted.indexOf('.')
  if (idx === -1) idx = converted.length
  for (idx -= 3; idx > 0; idx -= 3) {
    let left = converted.substring(0, idx)
    let right = converted.substring(idx)
    converted = left + ',' + right
  }

  if (isNegative) {
    return '-' + converted
  } else {
    return converted  
  }
}

/**
 * Determines if numeric.
 *
 * @param      {string}   n       Number string
 * @return     {boolean}  True if numeric, False otherwise.
 */
export function isNumeric (n) {
  return ((!isNaN(parseFloat(n)) && isFinite(n)) || n === '')
}

/**
 * get a random integer number. (from the MDN site) 
 */
export function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getEmptyEventGroup () {
  return {
    title: '',
    kind: c.EVENTGROUP_KIND.SALE,
    date: new Date(),
    eventList: [Immutable.fromJS(c.EMPTY_EVENT)], // not IdList
    error: Map({title: true})
  }
}