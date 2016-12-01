'use strict'

import {app, BrowserWindow} from 'electron'

let mainWindow

app.on('ready', initialize)
app.on('will-quit', wrapUp)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function initialize () {
  createMainWindow()
}

function wrapUp () {
  console.log('will quit')
}

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 800,
    minWidth: 700,
    minHeight: 600
  })
  mainWindow.loadURL('file://' + __dirname + '/../mainwindow/index.html')
  mainWindow.on('closed', () => mainWindow = null)
  mainWindow.webContents.openDevTools()
}