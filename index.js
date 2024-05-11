const express = require('express');
const app = express();
const port = process.env.port || 3000
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.zsn3kat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
   
    await client.connect();
  
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);

















app.get('/', (req, res) => {
  res.send('Hello World!');
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
