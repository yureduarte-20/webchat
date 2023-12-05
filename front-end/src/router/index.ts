import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue';
import CreateUser from '@/views/CreateUser.vue';
import { useAuth } from '@/stores/auth';
import { useNotification } from '@kyvg/vue3-notification';
import Profile from '@/views/Profile.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: CreateUser
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        auth: true
      }
    },
    {
      path: '/',
      name: 'chat',
      component: ChatView,
      meta: {
        auth: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta?.auth) {
    const auth = useAuth();
    const { notify } = useNotification()
    if (auth.token) {
      auth.check()
        .then(() => next())
        .catch(() => {
          auth.setToken(null)
          auth.setUser(null)
          notify({
            title: 'Sua sessão expirou',
            type: 'error'
           })
          next({ name: 'login' })
        })
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})
export default router
