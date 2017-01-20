'use strict'

import {app, BrowserWindow, ipcMain, Menu/*, autoUpdater*/} from 'electron'
import path from 'path'
import fs from 'fs'

import testMode from './app.mode'
import menu from './menu'
import * as ch from '../util/ipc.channels'
import * as c from '../util/const'
import * as util from '../util/util'

const baseDBPathForTest = path.normalize('./test/resource')
const dbPathForTest = path.join(baseDBPathForTest, 'db')
const dbPathForProduction = path.join(app.getPath('userData'), 'db')

const DB_FILE_LIST_LENGTH = 20

// import os from 'os'
// const platform = os.platform() + '_' + os.arch()
// const version = app.getVersion()
// autoUpdater.setFeedURL('https://lit-bayou-78984.herokuapp.com/update/'+platform+'/'+version)

let dbPath = ''
let dbFileList = []
let mainWindow = null
// let addWindow = null
let addWindowSet = {}
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
ipcMain.on(ch.EXIT_CONFIRMED, (event, store) => {
  closeConfirmed = true
  saveDBFile(store)
  app.quit()
})
ipcMain.on(ch.BACKUP_DATA, (event, store) => {
  saveDBFile(store)
})
ipcMain.on(ch.OPEN_ADDWINDOW, (event, productSet) => {
  createAddWindow(productSet)
})
ipcMain.on(ch.SAVE_EVENTGROUP, (event, eventGroup) => {
  mainWindow.webContents.send(ch.SAVE_EVENTGROUP, eventGroup)
})

function initialize () {
  // let isUpdate = autoUpdater.checkForUpdates()
  // console.log(isUpdate)
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  createMainWindow(getInitData())
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
  mainWindow.initStore = initStore
  mainWindow.initLocale = getInitLocale()
  mainWindow.on('closed', () => mainWindow = null)
  mainWindow.on('close', event => {
    if (!closeConfirmed) {
      event.preventDefault()
      mainWindow.webContents.send(ch.EXIT)
    }
  })

  if (testMode) {
    BrowserWindow.addDevToolsExtension('/Users/byron1st/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.4_0')
    mainWindow.webContents.openDevTools()
  }
}

function createAddWindow (productSet) {
  let addWindow = new BrowserWindow({
    width: 800,
    height: 450,
    resizable: false,
    autoHideMenuBar: true
  })
  let addWindowId = (Date.now()).toString()
  addWindow.loadURL('file://' + __dirname + '/../addwindow/index.html')
  addWindow.on('closed', () => delete addWindowSet[addWindowId])
  addWindow.productSet = productSet
  addWindow.initLocale = getInitLocale()
  addWindowSet[addWindowId] = addWindow

  if (testMode) {
    BrowserWindow.addDevToolsExtension('/Users/byron1st/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.4_0')
    addWindow.webContents.openDevTools()
  }
}

function getInitData () {
  const EMPTY_STORE = {
    productSet: {},
    eventSet: {},
    eventGroupSet: {},
    productIdList: [],
    eventGroupIdList: []
  }
  
  if (testMode) {
    prepareTestData()
  } else {
    if (!fs.existsSync(app.getPath('userData'))) {
      return EMPTY_STORE
    } else if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath)
    }
  }

  dbFileList = fs.readdirSync(dbPath).sort((prev, next) => {
    if (prev < next) {
      return 1
    } else {
      return -1
    }
  })

  if (dbFileList.length === 0) {
    // run at first time
    return EMPTY_STORE
  }
  return JSON.parse(fs.readFileSync(path.join(dbPath, dbFileList[0])).toString())
}

function prepareTestData () {
  if (fs.readdirSync(dbPathForTest).length === 0) {
    let testDBData = JSON.parse(fs.readFileSync(path.join(baseDBPathForTest, 'db.test.json')).toString())
    testDBData.eventGroupIdList.forEach(eventGroupId => testDBData.eventGroupSet[eventGroupId].date = getRandomDate())
    testDBData.eventGroupIdList.sort((prev, next) => testDBData.eventGroupSet[next].date - testDBData.eventGroupSet[prev].date)
    saveDBFile(testDBData)
  }

  function getRandomDate () {
    return new Date(util.getRandomIntInclusive(2013, 2016), util.getRandomIntInclusive(0, 11), util.getRandomIntInclusive(1, 30))
  }
}

function saveDBFile (data) {
  let newDBFilePath = 'db_' + Date.now() + '.json'
  if (dbFileList.length >= DB_FILE_LIST_LENGTH) {
    fs.unlinkSync(path.join(dbPath, dbFileList[DB_FILE_LIST_LENGTH - 1]))
    dbFileList.pop()
  }
  dbFileList.unshift(newDBFilePath)

  fs.writeFileSync(path.join(dbPath, newDBFilePath), JSON.stringify(data))
}

function getInitLocale () {
  let locale = app.getLocale()
  if (c.supportLocales.indexOf(locale) === -1) {
    locale = 'en'
  }
  return locale
}