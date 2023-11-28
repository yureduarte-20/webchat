import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue';
import { useAuth } from '@/stores/auth';
import { useNotification } from '@kyvg/vue3-notification';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true
      }
    },
    {
      path: '/chat',
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
