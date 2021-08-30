import index from '../pages/index.vue';
import home from '../pages/home.vue';
import video from '../pages/video.vue';

let options = [
  {path: '/', redirect: '/video'},
  {path: '/home', name: 'home', component: home},
  {path: '/video', name: 'video', component: video},
  {path: '/index', name: 'index', component: index}
];
export default options;