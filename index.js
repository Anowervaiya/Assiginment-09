const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.port || 3000;
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://cardoctor-bd.web.app',
      'https://cardoctor-bd.firebaseapp.com',
    ],
    credentials: true,
  })
);
app.use(express.json());

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
    const database = client.db('GroupStudy');
    const Assignment = database.collection('Assignment');

    app.post('/assignment', async (req, res) => {
      const { newAssignment } = req.body;
      const doc = {
        name: newAssignment.name,
        startDate: newAssignment.startDate,
        thumbnail: newAssignment.thumbnail,
        UserName: newAssignment.UserName,
        UserEmail: newAssignment.UserEmail,
        UserPhoto: newAssignment.UserPhoto,
        Marks: newAssignment.Marks,
        description: newAssignment.description,
        difficulty: newAssignment.difficulty,
      };

      const result = await Assignment.insertOne(doc);
      res.send(result);
    });

    app.get('/allassignment', async (req, res) => {
      const cursor = await Assignment.find();
    
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);

    });
    app.delete('/delete', async (req, res) => {
      const Id = req.query.id;
      const email = req.query.email;
      console.log(email);
      const query = {
        _id: new ObjectId(Id),
        email: email,
      };
      const result = await Assignment.deleteOne(query);
      res.send(result);
    });

    app.get('/details', async (req, res) => {
      const Id = req.query.id;
      console.log(Id);

      const query = { _id: new ObjectId(Id) };
      const result = await Assignment.find(query).toArray();
      res.send(result);
    });

    app.put('/update', async (req, res) => {
      const Id = req.query.id;
      const data = req.body;
      const query = { _id: new ObjectId(Id) };

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          description: data.description,

          Marks: data.Marks,
          thumbnail: data.thumbnail,
          UserName: data.UserName,
          UserEmail: data.UserEmail,
          UserPhoto: data.UserPhoto,
        },
      };
      const result = await Assignment.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Create a document to insert

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
