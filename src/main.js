import Vue from 'vue'
import routes from './common/routes';
import App from './app';
import VueRouter from 'vue-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// import './common.css';

let vueRouter = new VueRouter({
  mode: 'hash',
  base: 'index',
  routes: routes
});
// 安装 vue 插件
Vue.use(VueRouter);

Vue.config.productionTip = true;

// 实例化一个 Vue
let vueApp = new Vue({
  router: vueRouter,
  render : h=>h(App)
});
vueApp.$mount("#allinonepc-aio");

window.$app = vueApp;

window.addEventListener('popstate', () => {
  console.demoWarn('popstate: ', window.location.pathname);
});
