const { app, BrowserWindow, nativeImage } = require('electron');
const { ipcMain } = require('electron')
const fs = require('fs');

let win

function createWindow() {
    let image = nativeImage.createEmpty();

    win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        },
        titleBarStyle: 'hidden',
        resizable: false,
        title: " ",
        icon: image
    })

    win.loadFile('src/index.html')
    win.webContents.openDevTools()
    win.setMenu(null);

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('get-units', (event, arg) => {
    console.log("ipcMain", arg);
    fs.readFile('src/units.json', (err, data) => {  
        if (err) throw err;
    
        event.reply('get-units', data)
    });
})



