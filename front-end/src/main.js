import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
import './main.css'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};
initializeApp(firebaseConfig);

createApp(App)
  .use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
      path: '/cart',
      component: ShoppingCartPage,
    }, {
      path:'/',
      redirect: '/products',
    },
    {
      path: '/products',
      component: ProductsPage,
    }, {
      path: '/products/:productId',
      component: ProductDetailPage,
    }, {
      path: '/:pathMatch(.*)*',
      component: NotFoundPage,
    }
    ]
  }))
  .mount('#app')
