'use strict'

import {app, BrowserWindow, ipcMain, Menu/* , autoUpdater */} from 'electron' // eslint-disable-line standard/object-curly-even-spacing
import path from 'path'
import fs from 'fs'

import testMode from './app.mode'
import menu from './menu'
import * as ch from '../util/ipc.channels'
import * as c from '../util/const'
import * as util from '../util/util'

const BASE_DB_PATH_FOR_TEST = path.normalize('./test/resource')
const DB_PATH_FOR_TEST = path.join(BASE_DB_PATH_FOR_TEST, 'db')
const DB_PATH_FOR_PRODUCTION = path.join(app.getPath('userData'), 'db')
const DB_FILE_LIST_LENGTH = 20
const DB_PATH = _getDBPath(testMode)
const DB_FILE_LIST = _getDBFileList(DB_PATH)

// import os from 'os'
// const platform = os.platform() + '_' + os.arch()
// const version = app.getVersion()
// autoUpdater.setFeedURL('https://lit-bayou-78984.herokuapp.com/update/'+platform+'/'+version)

let locale
let mainWindow = null
let addWindowSet = {}
let closeConfirmed = false

app.on('ready', _initialize)
app.on('will-quit', _wrapUp)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on(ch.EXIT_CONFIRMED, (event, store) => {
  closeConfirmed = true
  _saveDBFile(store)
  app.quit()
})
ipcMain.on(ch.BACKUP_DATA, (event, store) => {
  _saveDBFile(store)
})
ipcMain.on(ch.OPEN_ADDWINDOW, (event, productSet) => {
  _createAddWindow(productSet, locale)
})
ipcMain.on(ch.SAVE_EVENTGROUP, (event, eventGroup) => {
  mainWindow.webContents.send(ch.SAVE_EVENTGROUP, eventGroup)
})

function _initialize () {
  // let isUpdate = autoUpdater.checkForUpdates()
  // console.log(isUpdate)
  locale = _getInitLocale()
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  _createMainWindow(_getInitData(), locale)
}

function _wrapUp () {
  console.log('will quit')
}

function _createMainWindow (initStore, initLocale) {
  mainWindow = new BrowserWindow({
    width: 995,
    height: 800,
    minWidth: 995,
    minHeight: 600
  })
  mainWindow.loadURL(path.join('file://', __dirname, '/../mainwindow/index.html'))
  mainWindow.initStore = initStore
  mainWindow.initLocale = initLocale
  mainWindow.on('closed', () => {
    mainWindow = null
  })
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

function _createAddWindow (productSet, initLocale) {
  const addWindowId = (Date.now()).toString()

  let addWindow = new BrowserWindow({
    width: 800,
    height: 450,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false
    }
  })

  addWindow.loadURL(path.join('file://', __dirname, '/../addwindow/index.html'))
  addWindow.on('closed', () => delete addWindowSet[addWindowId])
  addWindow.productSet = productSet
  addWindow.initLocale = initLocale
  addWindowSet[addWindowId] = addWindow

  if (testMode) {
    BrowserWindow.addDevToolsExtension('/Users/byron1st/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.4_0')
    addWindow.webContents.openDevTools()
  }
}

function _getInitData () {
  const EMPTY_STORE = {
    productSet: {},
    eventSet: {},
    eventGroupSet: {},
    productIdList: [],
    eventGroupIdList: []
  }

  if (testMode) {
    _prepareTestData()
  } else {
    if (!fs.existsSync(app.getPath('userData'))) {
      return EMPTY_STORE
    } else if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(DB_PATH)
    }
  }

  if (DB_FILE_LIST.length === 0) {
    // run at first time
    return EMPTY_STORE
  }
  return JSON.parse(fs.readFileSync(path.join(DB_PATH, DB_FILE_LIST[0])).toString())
}

function _prepareTestData () {
  function _getRandomDate () {
    return new Date(util.getRandomIntInclusive(2013, 2016), util.getRandomIntInclusive(0, 11), util.getRandomIntInclusive(1, 30))
  }

  if (fs.readdirSync(DB_PATH_FOR_TEST).length === 0) {
    const testDBData = JSON.parse(fs.readFileSync(path.join(BASE_DB_PATH_FOR_TEST, 'db.test.json')).toString())

    testDBData.eventGroupIdList.forEach(eventGroupId => {
      testDBData.eventGroupSet[eventGroupId].date = _getRandomDate()
    })
    testDBData.eventGroupIdList.sort((prev, next) => testDBData.eventGroupSet[next].date - testDBData.eventGroupSet[prev].date)
    _saveDBFile(testDBData)
  }
}

function _saveDBFile (data) {
  const newDBFilePath = 'db_' + Date.now() + '.json'

  if (DB_FILE_LIST.length >= DB_FILE_LIST_LENGTH) {
    fs.unlinkSync(path.join(DB_PATH, DB_FILE_LIST[DB_FILE_LIST_LENGTH - 1]))
    DB_FILE_LIST.pop()
  }
  DB_FILE_LIST.unshift(newDBFilePath)

  fs.writeFileSync(path.join(DB_PATH, newDBFilePath), JSON.stringify(data))
}

function _getInitLocale () {
  const locale = app.getLocale()

  if (c.LOCALE_LIST.indexOf(locale) === -1) {
    return 'en'
  }
  return locale
}

function _getDBPath (mode) {
  if (mode) {
    return DB_PATH_FOR_TEST
  } else {
    return DB_PATH_FOR_PRODUCTION
  }
}

function _getDBFileList (path) {
  return fs.readdirSync(path)
    .sort((prev, next) => {
      if (prev < next) {
        return 1
      } else {
        return -1
      }
    })
}
