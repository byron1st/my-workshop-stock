'use strict'

import {shell, app} from 'electron'

const menu = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { shell.openExternal('http://electron.atom.io') }
      },
      {
        label: 'Report issues',
        click () { shell.openExternal('http://byron1st.pe.kr/?page_id=1191')}
      },
      {
        label: 'Toggle Developer Tools',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
    ]
  }
]

if (process.platform === 'darwin') {
  const appName = app.getName()
  menu.unshift({
    label: appName,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { 
        role: 'services',
        submenu: []
      },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

export default menu