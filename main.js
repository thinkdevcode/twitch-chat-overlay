const electron = require('electron')
const localShortcut = require('electron-localshortcut')

const app = electron.app
const nativeImage = electron.nativeImage
const Menu = electron.Menu
const Tray = electron.Tray
const BrowserWindow = electron.BrowserWindow

let mainWnd
let childWnd
let tray
let edit = true
let options = {
  title: 'Twitch Chat Overlay',
  height: 300,
  width: 600
}

function editWindow() {
 if (childWnd) childWnd.close()
 childWnd = new BrowserWindow(Object.assign({
    frame: true,
    transparent: false
  }, options))

  childWnd.setIgnoreMouseEvents(false)
  childWnd.setAlwaysOnTop(false)
  childWnd.setMenu(null)
  childWnd.loadURL(`file://${__dirname}/html/edit.html`)
  registerActions()
}

function playWindow() {
  if (childWnd) childWnd.close()
  childWnd = new BrowserWindow(Object.assign({
    frame: false,
    transparent: true
  }, options))

  childWnd.setIgnoreMouseEvents(true)
  childWnd.setAlwaysOnTop(true)
  childWnd.setMenu(null)
  childWnd.loadURL(`file://${__dirname}/html/play.html`)
  registerActions()
}

function registerActions() {
  childWnd.on('closed', () => childWnd = null)

  localShortcut.register(childWnd, 'F1', () => {
    flipWindow()
  })
}

function flipWindow() {
  edit = !edit
  if (edit) 
    editWindow()
  else
    playWindow()
}

function createMainWnd() {
  mainWnd = new BrowserWindow({
    height: 1,
    width: 1,
    x: 0,
    y: 0,
    frame: false,
    transparent: true
  })
  mainWnd.setFocusable(false)
  mainWnd.setIgnoreMouseEvents(true)
  mainWnd.setMenu(null)
  mainWnd.setSkipTaskbar(true)
  tray = new Tray('./img/worst-icon-ever.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Switch Mode', type: 'normal', click: flipWindow },
    { label: '-', type: 'separator' },
    { label: 'Exit', type: 'normal', role: 'quit' }
  ])
  tray.setToolTip('Twitch Chat Overlay')
  tray.setContextMenu(contextMenu)
  editWindow()
}

app.on('ready', createMainWnd)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (childWnd === null)
    editWindow()
})
