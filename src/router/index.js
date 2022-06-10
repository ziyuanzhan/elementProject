import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../components/LoginView.vue'
import HomeView from '../components/HomeView.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component:LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
  ]
})
router.beforeEach((to,from,next)=>{
  if(to.path=='/login'){
    return next()
  }else{
    const tokenStr=window.sessionStorage.getItem('token')
    if(!tokenStr){
      return next('/login')
    }
    next()
  }
})
export default router
