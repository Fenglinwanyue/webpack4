import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import 'babel-polyfill';
require('./testhappypack.js');
const attachFastClick = require('fastclick');
// import 'assets/stylus/reset';
import 'assets/stylus/index.styl';
import vMessage from './types/components/message/message';
Vue.use(vMessage);
// console.log(Vue.prototype);
// if (process.env.buildEnv === 'test') {
//     require('./mock');
// }

// require('viewport-units-buggyfill').init()

const str = navigator.userAgent.toLowerCase();
const ver = str.match(/cpu iphone os (.*?) like mac os/);
if (!ver || parseInt(ver[1], 10) < 11) {
    /* tslint:disable:no-string-literal */
    attachFastClick['attach'](document.body);
    /* tslint:enable:no-string-literal */
}

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
