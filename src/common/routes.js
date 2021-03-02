import index from '../pages/index.vue';
import home from '../pages/home.vue';


let options = [
  {path: '/index', redirect: '/index'},
  {path: '/', name: 'home', component: home},
  {path: '/index', name: 'index', component: index}
];
export default options;