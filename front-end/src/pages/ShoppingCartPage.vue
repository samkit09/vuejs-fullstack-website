<template>
  <h1> Shopping Cart </h1>
  <div v-if="cartItems.length > 0">
    <CartItemsList @remove-from-cart="removeFromCart($event)" :cartItems="cartItems" />
    <button class="checkout-button">
      Proceed to Checkout
    </button>
  </div>
  <div v-if="cartItems.length === 0">
    You currently have no item in the Cart!
  </div>
</template>

<script>
import CartItemsList from '@/components/CartItemList.vue';
import axios from 'axios';

export default {
  name: "ShoppingCartPage",
  components: {
    CartItemsList
  },
  props: ['user'],
  data() {
    return {
      cartItems: [],
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
    async removeFromCart (productId) {
      const response = await axios.delete(`/api/users/${this.user.uid}/cart/${productId}`);
      const updatedCart = response.data;
      this.cartItems = updatedCart;
    }
  },  
  async created(){
    if (this.user) {
      const response = await axios.get(`/api/users/${this.user.uid}/cart/`);
      const cartItems = response.data;
      this.cartItems = cartItems;
    }
  }
}
</script>