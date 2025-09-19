import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Routes
import Home from './views/Home.vue'
import Builder from './views/Builder.vue'
import Templates from './views/Templates.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/builder', name: 'Builder', component: Builder },
  { path: '/builder/:formId', name: 'EditForm', component: Builder },
  { path: '/templates', name: 'Templates', component: Templates },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
