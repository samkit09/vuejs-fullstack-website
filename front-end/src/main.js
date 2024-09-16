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
  apiKey: "AIzaSyCdKGh_jDtKlUsfALrJsQc_50aZEG4oOG4",
  authDomain: "vuejs-b9cda.firebaseapp.com",
  projectId: "vuejs-b9cda",
  storageBucket: "vuejs-b9cda.appspot.com",
  messagingSenderId: "447418813031",
  appId: "1:447418813031:web:9e6cb30d7d852c64a762c2"

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
