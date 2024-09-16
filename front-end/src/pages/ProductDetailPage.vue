<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" alt="Product_Image">
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button v-if="user && !itemIsInCart" class="add-to-cart" @click="addToCart"> Add to Cart </button>
      <button v-if="user && itemIsInCart" class="grey-button">Item is already in cart</button>
      <button v-if="!user" class="sign-in" @click="signIn"> Sign in to add to cart </button>
    </div>
  </div>
  <div v-else>
    <NotFoundPage />
  </div>
</template>

<script>
import NotFoundPage from './NotFoundPage.vue';
import axios from 'axios';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

export default {
  name: "ProductDetailPage",
  components: {
    NotFoundPage,
  },
  props: ['user'],
  data() {
    return {
      product: {},
      cartItems: [],
    }
  },
  computed: {
    itemIsInCart() {
      return this.cartItems.some((item) => item.id === this.$route.params.productId);
    }
  },
  watch: {
    async user(newUserValue) {
      if (newUserValue) {
        const cartResponse = await axios.get(`/api/users/${newUserValue.uid}/cart`);
        this.cartItems = cartResponse.data;
      }
    }
  },
  methods: {
    async addToCart() {
      await axios.post(`/api/users/${this.user.uid}/cart`, { id: this.$route.params.productId });
      alert('Successfully added item to cart!');
    },
    async signIn() {
      const email = prompt('Please enter your email to sign in:');
      const auth = getAuth();
      const actionCodeSettings = {
        url: `https://vuejs-fullstack-deployment.onrender.com/products/${this.$route.params.productId}`,
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert('A login link was sent to the email you provided.');
      window.localStorage.setItem('emailForSignIn', email);
    }
  },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      signInWithEmailLink(auth, email, window.location.href);
      alert('successfully signed in!');
      window.localStorage.removeItem('emailForSignIn');
    }

    const response = await axios.get(`/api/products/${this.$route.params.productId}`)
    const product = response.data;
    this.product = product;

    if (this.user) {
      const cartResponse = await axios.get(`/api/users/${this.user.uid}/cart`);
      this.cartItems = cartResponse.data;
    }
  }
}
</script>