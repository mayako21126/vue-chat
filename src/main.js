import Vue from 'vue'
import Main from './main.vue'
import app from './components/App.vue'
import mobile from './components/mobile.vue'
import hello from './components/Hello.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import Vuex from 'vuex';
import store from './store/store';

Vue.use(Vuex);
//引入组件并使用2个模块
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

//hash路由开启
var router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect:'/chat'

    },
    {path: '/hello', component: hello},
    {path: '/chat', component: app},
    {path: '/mobile', component: mobile}
  ]
})
//路由切换前后钩子函数
router.beforeEach(function (transition, form, next) {
  var toPath = transition.path
  console.info(toPath)
  next()
})


router.afterEach(function (transition) {
  console.log('成功浏览到: ' + transition.path + this)
})

var vm = new Vue({
  el: '#app',
  router: router,
  render: h => h(Main),
  store: store
})

