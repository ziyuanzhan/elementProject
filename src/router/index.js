import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../components/LoginView.vue'
import HomeView from '../components/HomeView.vue'
import Welcome from '../components/WelcomeView.vue'
import User from '../components/user/UserView.vue'
import RightsView from '../components/power/RightsView.vue'
import RoleView from '../components/power/RoleView.vue'

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
      redirect: '/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:User},
        {path: '/rights',component: RightsView},
        {path: '/roles',component: RoleView}
      ]
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
