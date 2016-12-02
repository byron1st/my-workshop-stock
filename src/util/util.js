'use strict'

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
  let converted = amount.toString()

  let idx = converted.indexOf('.')
  if (idx === -1) idx = converted.length
  for (idx -= 3; idx > 0; idx -= 3) {
    let left = converted.substring(0, idx)
    let right = converted.substring(idx)
    converted = left + ',' + right
  }
  return converted
}