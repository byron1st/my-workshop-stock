'use strict'

import fs from 'fs'
import path from 'path'

let localeObject = {}

export function setLocale (locale) {
  localeObject = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../public/locales', locale + '.json')))
}

export default function getText (key) {
  return localeObject[key]
}