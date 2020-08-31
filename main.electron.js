const { app, BrowserWindow, Menu } = require('electron')
const {resolve} = require('path')
Menu.setApplicationMenu(null)
function getParam() {
  let param = {
    'BIN_PATH': '',
    'APP_PATH': '',
    'TRTC_ENV': 'production',
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
  let win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      plugins: true,
      webSecurity: false
    }
  });

  // 在执行 npm run start 后，经常会窗口已经显示出来了，但代码还未构建好，此时捕获到 did-fail-load 事件，在之后延迟重载 
  win.webContents.on('did-fail-load', function () {
    console.log(`createWindow: did-fail-load, reload ${param.TRTC_ENV} soon...`);
    setTimeout(() => {
      win.reload();
    }, 1000);
  });
  if (param.TRTC_ENV === 'production') {
    win.loadFile('dist/index.html');
  } else {
    win.loadURL(gerServer());
    win.webContents.openDevTools();
  }
}

// 指定 flash 路径，假定它与 main.js 放在同一目录中。
let plugins =  resolve(__dirname, './lib/pepflashplayer64.dll')

if (__dirname.includes(".asar")) {
  plugins = require('path').join(process.resourcesPath + '/lib/pepflashplayer64.dll')
}
app.commandLine.appendSwitch('ppapi-flash-path', plugins)

// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '26.0.0.131')

app.whenReady().then(createWindow);
