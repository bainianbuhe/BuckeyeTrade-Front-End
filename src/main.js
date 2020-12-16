import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import axios from 'axios'
import Router from 'vue-router'

import {Loading} from 'element-ui'
Vue.use(ElementUI);
Vue.use(Router)
Vue.prototype.axios = axios;
Vue.prototype.$axios=axios;

let loading;
//内存中正在请求的数量
let loadingNum=0;
function startLoading() {
  if(loadingNum==0){
    loading = Loading.service({
      lock: true,
      text: 'Loading...',
      background:'rgba(255,255,255,0.5)',
    })
  }
  //请求数量加1
  loadingNum++;
}
function endLoading() {
  //请求数量减1
  loadingNum--
  if(loadingNum<=0){
    loading.close()
  }
}

//请求数据拦截器
axios.interceptors.request.use(request => {
  startLoading();
  return request
}, err => {
  return Promise.reject(err);
});


//接收响应拦截器
axios.interceptors.response.use(response => {
  endLoading();
  return response
}, err => {
  endLoading();
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = '请求错误(400)'; break;
      case 401: this.$router.push('/login'); break;
      case 403: err.message = '拒绝访问(403)'; break;
      case 404: err.message = '请求出错(404)'; break;
      case 408: err.message = '请求超时(408)'; break;
      case 500: err.message = '服务器错误(500)'; break;
      case 501: err.message = '服务未实现(501)'; break;
      case 502: err.message = '网络错误(502)'; break;
      case 503: err.message = '服务不可用(503)'; break;
      case 504: err.message = '网络超时(504)'; break;
      case 505: err.message = 'HTTP版本不受支持(505)'; break;
      default: err.message = `连接出错(${err.response.status})!`;
    }
  } else {
    err.message = '连接服务器失败!'
  }
  message.error(err.message);
  return Promise.reject(err);
});

const router = new Router({
  mode:'history',
  routes: [
    {
    path: '/',
      redirect: '/main-page'
    },

    {
      //登陆
      path: '/login',
      name: 'Login',
      component: () => import('./views/login.vue'),
      meta: {
        title: 'Login Page',
        type: 'login',
      }
    },
    {
      path:'/register',
      name:'Register',
      component: () => import('./views/register.vue'),
      meta: {
        title: 'Register Page',
        type: ''
      }

    },
    {
      path:'/main-page',
      name:'MainPage',
      component: () => import('./views/mainpage.vue'),
      meta: {
        title: 'Main Page',
        type: 'login'
      }

    },
    {
     path:'/profile',
      name:'Profile',
      component: () => import('./views/profile.vue'),
      meta: {
        title: 'Profile Page',
        type: 'login',
      },

      children: [
        { path: "new-post",  component: () => import('./components/newPost.vue'), name: "NewPost" ,
          meta: {
            title: 'New Post',
            type: 'login'
          },},
        { path: "my-posts",  component: () => import('./components/myPosts.vue'), name: "MyPost" ,
          meta: {
            title: 'My Posts',
            type: 'login'
          },},
        { path: "edit-personal-information",  component: () => import('./components/editPersonalInformation.vue'), name: "EditPersonalInformation" ,
          meta: {
            title: 'Edit Personal Information',
            type: 'login'
          },},
        { path: "following",  component: () => import('./components/following.vue'), name: "Following" ,
          meta: {
            title: 'Following',
            type: 'login'
          },},
        { path: "message",  component: () => import('./components/message.vue'), name: "message" ,
          meta: {
            title: 'Following',
            type: 'login'
          },},
      ]
    },
    {
      path:'/item-detail/:postId',
      name:'ItemDetail',
      component: () => import('./views/itemDetail.vue'),
      meta: {
        title: 'Item Detail',
        type: ''
      }

    },


  ]
})

router.beforeEach((to, from, next) => {
if (to.meta.title) {
    document.title = to.meta.title
  };


  const userData = sessionStorage.getItem("userData");
  let isLogin = typeof userData !== 'undefined' && userData !== null // 是否登录
  if (!isLogin&& to.name != 'Login'&&to.meta.type=='login') {
      next('/login')
  }
  else{
    next();
  };

  next();
});


new Vue({
  el: '#app',
  router,
  components:{
    App
  },
  render: h => h(App)

});