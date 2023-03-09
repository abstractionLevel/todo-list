// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const log = require('electron-log');



const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, '/icon.png'),
        webPreferences: {
            enableRemoteModuel: true
        }

    })

    // Imposta la directory dei log
    log.transports.file.file = 'logs.log';

    // Imposta il livello di log
    log.transports.file.level = 'info';

    // Inizializza il modulo log
    log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

    // Aggiungi un listener all'evento 'console-message' della finestra di rendering
    mainWindow.webContents.on('console-message', (event, level, message) => {
        // Scrivi il messaggio di log nel file di log
        log.info(`[Renderer] [${level}] ${message}`);
    });
    mainWindow.webContents.openDevTools();

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        //  mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    Menu.setApplicationMenu(null);
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.