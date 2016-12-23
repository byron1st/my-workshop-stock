'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import fs from 'fs'

import testMode from './app.mode'
import * as ch from '../util/ipc.channels'

const baseDBPathForTest = path.normalize('./test/resource')
const dbPathForTest = path.join(baseDBPathForTest, 'db')
const dbPathForProduction = path.join(app.getPath('userData'))
const dbFileListLength = 5

let dbPath = ''
let dbFileList = []
let mainWindow = null
let closeConfirmed = false

if (testMode) {
  dbPath = dbPathForTest
} else {
  dbPath = dbPathForProduction
}

if (!testMode && !fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath)
}

app.on('ready', initialize)
app.on('will-quit', wrapUp)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on(ch.EXIT_CONFIRMED, (event, store) => {
  closeConfirmed = true
  saveDBFile(store)
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
  mainWindow.initLocale = 'ko' //TODO: 나중에 OS 설정에서 가져오도록 변경.
  mainWindow.on('closed', () => mainWindow = null)
  mainWindow.on('close', event => {
    if (!closeConfirmed) {
      event.preventDefault()
      mainWindow.webContents.send(ch.EXIT)
    }
  })

  if (testMode) {
    mainWindow.webContents.openDevTools()
  }
}

function prepareTestData () {
  if (fs.readdirSync(dbPathForTest).length === 0) {
    let testDBData = JSON.parse(fs.readFileSync(path.join(baseDBPathForTest, 'db.test.json')).toString())
    testDBData.event.forEach(event => event.date = new Date(2016, 1, 3))
    saveDBFile(testDBData)
  }
}

function getInitData () {
  dbFileList = fs.readdirSync(dbPath).sort((prev, next) => {
    if (prev < next) {
      return 1
    } else {
      return -1
    }
  })

  if (dbFileList.length === 0) {
    // run at first time
    return {
      product: [],
      event: []
    }
  }

  return JSON.parse(fs.readFileSync(path.join(dbPath, dbFileList[0])).toString())
}

function saveDBFile (data) {
  let newDBFilePath = 'db_' + Date.now() + '.json'
  if (dbFileList.length >= dbFileListLength) {
    fs.unlinkSync(path.join(dbPath, dbFileList[dbFileListLength - 1]))
    dbFileList.pop()
  }
  dbFileList.unshift(newDBFilePath)
  fs.writeFileSync(path.join(dbPath, newDBFilePath), JSON.stringify(data))
}