const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { resolve } = require('path')
const fs = require('fs')
let win = null
Menu.setApplicationMenu(null)
function getParam() {
  let param = {
    'BIN_PATH': '',
    'APP_PATH': '',
    'AIO_ENV': 'production',
  };
  let tmp = Array.from(process.argv);
  param.BIN_PATH = tmp[0];
  param.APP_PATH = tmp[1];
  tmp.forEach((value, index) => {
    if (index <= 1) return;
    let splitValue = value.split('=');
    let key = splitValue[0].replace(/--/g, '').replace(/\s/g, '').toUpperCase();
    let val = splitValue[1].replace(/\s/g, '');
    if (typeof param[key] !== 'undefined') {
      param[key] = val;
    }
  });
  return param;
}
let param = getParam();
console.log('electron param:', param);
let portStart = 8080;
function gerServer() {
  return `http://localhost:${portStart}`;
}

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      minimizable: false,
      maximizable: false,
      closable: false,
      plugins: true,
      webSecurity: false,
      enableRemoteModule: true
    }
  });

  // 在执行 npm run start 后，经常会窗口已经显示出来了，但代码还未构建好，此时捕获到 did-fail-load 事件，在之后延迟重载 
  win.webContents.on('did-fail-load', function () {
    console.log(`createWindow: did-fail-load, reload ${param.AIO_ENV} soon...`);
    setTimeout(() => {
      win.reload();
    }, 1000);
  });
  if (param.AIO_ENV === 'production') {
    win.loadFile('dist/index.html');
    // win.webContents.openDevTools();
  } else {
    win.loadURL(gerServer());
    win.webContents.openDevTools();
  }
}

// 指定 flash 路径，假定它与 main.js 放在同一目录中。
let plugins = resolve(__dirname, './lib/pepflashplayer64.dll')

if (__dirname.includes(".asar")) {
  plugins = require('path').join(process.resourcesPath + '/lib/pepflashplayer64.dll')
}
app.commandLine.appendSwitch('ppapi-flash-path', plugins)

// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '26.0.0.131')

app.whenReady().then(createWindow);

let calendarWin;
// 创建calendar窗口方法
function openCalendarWindow(args) {
  console.log(args)
  calendarWin = new BrowserWindow({
    width: 1920,
    height: 1080,
    movable: false,
    fullscreen: false,
    resizable: false,
    alwaysOnTop: true,
    minimizable: false,
    parent: win, // win是主窗口
    webPreferences: {
      nodeIntegration: false
    }
  })
  calendarWin.loadURL(args);
  calendarWin.maximize();
  calendarWin.webContents.openDevTools();
  calendarWin.on('closed', () => { calendarWin = null })
  calendarWin.webContents.on('new-window', (event, url) => {
    initNewWindow(event, url)
  })
}
const initNewWindow = (event, url) => {
  event.preventDefault()
  const chindWin = new BrowserWindow({
    width: 1920,
    height: 1080,
    movable: false,
    fullscreen: false,
    minimizable: false,
    resizable: false,
    alwaysOnTop: true,
    parent: win, // win是主窗口
    webPreferences: {
      nodeIntegration: false
    }
  })
  chindWin.loadURL(url);
  chindWin.maximize();
  // chindWin.on('closed', () => { chindWin = null })
  chindWin.webContents.on('new-window', (event, url) => {
    initNewWindow(event, url)
  })
  event.newGuest = chindWin
}
ipcMain.on('openCalendarWindow', (e, args) =>
  openCalendarWindow(args)
);

//关闭当前多窗口
ipcMain.on('closeCalendarWindow', e =>
  calendarWin.close()
);
//最小化当前多窗口
ipcMain.on('minimizeCalendarWindow', e =>
  calendarWin.minimize()
);

ipcMain.on('readConfig-message', function (event, arg) {
  // arg是从渲染进程返回来的数据
  console.log(arg);

  // 这里是传给渲染进程的数据
  let configPath = resolve(__dirname, './lib/config.json')

if (__dirname.includes(".asar")) {
  configPath = require('path').join(process.resourcesPath + '/lib/config.json')
}
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      event.sender.send('readConfig-reply',err);
    } else {
      event.sender.send('readConfig-reply', data);
    }

  })
});
