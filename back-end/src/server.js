require('dotenv').config();
import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

(async function start() {
  const username = process.env.mongodb_username;
  const password = process.env.mongodb_password;
  const url = `mongodb+srv://${username}:${password}@cluster0.jvrol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db('vuedb');

  const app = express();
  app.use(express.json());
  app.use('/image', express.static(path.join(__dirname, '../assets')));

  app.use(express.static(
    path.resolve(__dirname,'../dist'),
    {maxAge: '1y', etag: false},
  ));

  // End point to get list of products
  app.get('/api/products', async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  // Helper function 
  async function populatedCartIds(ids) {
    return Promise.all(ids.map(id => db.collection("products").findOne({ id })));
  }

  // Endpoint for getting list of cart items of a particular user
  app.get('/api/users/:userId/cart', async (req, res) => {
    const user = await db.collection('users').findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  // Endponit to get a particular product from the list
  app.get('/api/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection('products').findOne({ id: productId });
    res.json(product);
  });

  // Endpoint for adding a product to cart of the particular user
  app.post('/api/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    const existingUser = await db.collection('users').findOne({ id: userId });
    if (!existingUser) {
      await db.collection('users').insertOne({ id: userId, cartItems: [] });
    }

    db.collection('users').updateOne({ id: userId }, {
      $addToSet: { cartItems: productId }
    })

    const user = await db.collection('users').findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  // Endpoint for deleting a particular product from the cart
  app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection('users').updateOne({ id: userId }, {
      $pull: { cartItems: productId }
    });

    const user = await db.collection('users').findOne({ id: userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log("Server is Listening on port "+port);
  });

})();