<template>
<div id="home">
    <div class="back-home" draggable="true" :style="style" @dragend="dragend($event,1)" @touchstart="touchStart" @touchmove='touchMove' @touchend='touchEnd'>
        <!-- <img src="@/assets/back.png" alt="" @click="goBackWebView"> -->
        <img src="@/assets/fresh.png" alt="" @click="refresh">
        <!-- <img src="@/assets/font.png" alt="" @click="goForwardWebView"> -->
        <!-- <img src="@/assets/home.png" alt="" @click="goInde·x"> -->
    </div>
    <!-- <div class="head">
        <button @click="goIndex">回到首页</button>
        <button @click="goBackWebView">后退</button>
        <button @click="goForwardWebView">前进</button>
        <button @click="refresh">刷新</button>
    </div> -->
    <!-- <button @click="open">打开</button> -->
    <webview class="frame" :style="'height:' + webViewHeight + 'px'" id="wb" :src="url" plugins />
</div>
</template>

<script>
const {
    ipcRenderer
} = window.require('electron')
export default {
    data() {
        return {
            url: '',
            webViewHeight: 1000
        }
    },
    computed: {
        style() {
            return {
                top: this.top + 'px',
                right: this.right + 'px'
            }
        },
        stylepre() {
            return {
                top: this.top2 + 'px',
                right: this.right2 + 'px'
            }
        },
        stylefresh() {
            return {
                top: this.top3 + 'px',
                right: this.right3 + 'px'
            }
        },
        stylefont() {
            return {
                top: this.top4 + 'px',
                right: this.right4 + 'px'
            }
        }
    },
    mounted() {
        // window.location.href = "https://qujiangzc.odrcloud.cn"
        if (this.$route.query.url) {
            this.url = this.$route.query.url
        }else{
            this.url = 'http://122.51.213.5'
        }
        this.webViewHeight = window.screen.height
        let webview = document.querySelector('webview')
        webview.addEventListener('dom-ready', () => {
            const webContents = webview.getWebContents();
            webContents.on('new-window', (event, url) => {
                console.log(url)
                // sessionStorage.setItem('navUrl', url)
                // event.preventDefault();
                // webview.loadURL(url);

                ipcRenderer.send('openCalendarWindow', url)
            });
        });
    },
    methods: {
        goIndex() {
            this.$router.push({
                path: '/'
            })
        },
        open() {
            window.location.href = "http://106.54.206.63/"
        },
        goBackWebView() {
            let webview = document.querySelector('webview')
            webview.goBack()
            // console.log(webview.src)
            // let navUrl = sessionStorage.getItem('navUrl')
            // if (navUrl) {
            //     this.checkUrl(webview.src, navUrl).then(res => {
            //         if (res) {
            //             webview.goBack()
            //         } else {
            //             webview.goBack()
            //             webview.goBack()
            //             sessionStorage.removeItem('navUrl')
            //         }
            //     })
            // } else {
            //     webview.goBack()
            // }
        },
        goForwardWebView() {
            let webview = document.querySelector('webview')
            webview.goForward()
        },
        refresh() {
            let webview = document.querySelector('webview')
            webview.reloadIgnoringCache()
        },
        dragend(e, val) {
            if (val === 1) {
                this.top = e.clientY - 40
                this.right = window.innerWidth - e.clientX - 80
            } else if (val === 2) {
                this.top2 = e.clientY - 40
                this.right2 = window.innerWidth - e.clientX - 80
            } else if (val === 3) {
                this.top3 = e.clientY - 40
                this.right3 = window.innerWidth - e.clientX - 80
            } else if (val === 4) {
                this.top4 = e.clientY - 40
                this.right4 = window.innerWidth - e.clientX - 80
            }
        },
        touchStart() {
            // e = e || event
            // e.preventDefault()
        },
        touchMove(e, val) {
            e = e || event
            e.preventDefault()
            if (val === 1) {
                this.top = e.targetTouches[0].clientY - 40
                this.right = window.innerWidth - e.targetTouches[0].clientX - 40
            } else if (val === 2) {
                this.top2 = e.targetTouches[0].clientY - 40
                this.right2 = window.innerWidth - e.targetTouches[0].clientX - 40
            } else if (val === 3) {
                this.top3 = e.targetTouches[0].clientY - 40
                this.right3 = window.innerWidth - e.targetTouches[0].clientX - 40
            } else if (val === 4) {
                this.top4 = e.targetTouches[0].clientY - 40
                this.right4 = window.innerWidth - e.targetTouches[0].clientX - 40
            }
        },
        touchEnd() {
            // e = e || event
            // e.preventDefault()
        },
        checkUrl(newUrl, oldUrl) {
            return new Promise((resolve, reject) => {
                try {
                    console.log(newUrl, oldUrl)
                    let arrNewUrl = newUrl.split('/')
                    let arrOldUrl = oldUrl.split('/')
                    if ((arrNewUrl[0] + arrNewUrl[1] + arrNewUrl[2]) == (arrOldUrl[0] + arrOldUrl[1] + arrOldUrl[2])) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } catch (err) {
                    reject(err)
                }
            })
        }
    }
}
</script>

<style scoped>
#home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.head {
    width: 100%;
    height: 30px;
}

.frame {
    width: 100%;
}

.back-home {
    position: fixed;
    top: 100px;
    right: 20px;
}

.back-pre {
    position: fixed;
    top: 100px;
    right: 320px;
}

.back-fresh {
    position: fixed;
    top: 100px;
    right: 220px;
}

.back-font {
    position: fixed;
    top: 100px;
    right: 120px;
}

img {
    width: 86px;
}
</style>
