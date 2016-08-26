const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const program = require('commander')

program
    .option('-m, --maximize', 'Presents the overlay maximized')
    .parse(process.argv)

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true
  })

  if (program.maximize) mainWindow.maximize()

  mainWindow.setAlwaysOnTop(true)
  mainWindow.setMenu(null)
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (mainWindow === null)
    createWindow()
})
