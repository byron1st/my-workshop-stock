'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import fs from 'fs'

import testMode from './app.mode'
import * as ch from '../util/ipc.channels'

const baseDBPathForTest = path.normalize('./test/resource')
const dbPathForTest = path.join(baseDBPathForTest, 'db')
const dbPathForProduction = path.join(app.getPath('userData'), 'db')

let dbPath = ''
let mainWindow = null
let closeConfirmed = false

if (testMode) {
  dbPath = dbPathForTest
} else {
  dbPath = dbPathForProduction
}

app.on('ready', initialize)
app.on('will-quit', wrapUp)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on(ch.EXIT_CONFIRMED, () => {
  closeConfirmed = true
  app.quit()
})

function initialize () {
  if (testMode) {
    prepareTestData()
  }
  let initStore = getInitData()
  createMainWindow(initStore)
}

function wrapUp () {
  console.log('will quit')
}

function createMainWindow (initStore) {
  mainWindow = new BrowserWindow({
    width: 995,
    height: 800,
    minWidth: 995,
    minHeight: 600
  })
  mainWindow.loadURL('file://' + __dirname + '/../mainwindow/index.html')
  mainWindow.productList = initStore.product
  mainWindow.eventList = initStore.event
  mainWindow.on('closed', () => mainWindow = null)
  mainWindow.on('close', event => {
    if (!closeConfirmed) {
      event.preventDefault()
      mainWindow.webContents.send(ch.EXIT)
    }
  })
  mainWindow.webContents.openDevTools()
}

function prepareTestData () {
  if (fs.readdirSync(dbPathForTest).length === 0) {
    let testDBData = JSON.parse(fs.readFileSync(path.join(baseDBPathForTest, 'db.test.json')).toString())
    testDBData.event.forEach(event => event.date = new Date(2016, 1, 3))
    saveDBFile(testDBData)
  }
}

function getInitData () {
  let dbFile = fs.readdirSync(dbPath).reduce((prev, next) => {
    if (prev > next) {
      return prev
    } else {
      return next
    }
  })
  console.log(dbFile)
  return JSON.parse(fs.readFileSync(path.join(dbPath, dbFile)).toString())
}

function saveDBFile (data) {
  let newDBFilePath = 'db_' + Date.now() + '.json'
  fs.writeFileSync(path.join(dbPath, newDBFilePath), JSON.stringify(data))
}