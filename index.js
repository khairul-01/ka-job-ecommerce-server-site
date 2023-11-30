const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// DB_USER=jobEcmmerce
// DB_PASS=tApzxHdJlLYOnNCJ
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evyc2iz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db('jobEcommerce').collection('jobs');
    const bidJobCollection = client.db('jobEcommerce').collection('bidJobs');

    // Jobs information
    app.get('/jobs', async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    })
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      };
      const result = await jobCollection.findOne(query);
      res.send(result);
    })
    app.post('/jobs', async (req, res) => {
      const job = req.body;
      console.log(job);
      const result = await jobCollection.insertOne(job);
      console.log(result);
      res.send(result);
    })
    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log('id', id);
      console.log(data.job_title);
      const filter = {_id: new ObjectId(id)};
      console.log(filter)
      const updateJob = {
        $set: {
          job_title: data.job_title,
          deadline: data.deadline,
          job_description: data.job_description,
          category: data.category,
          minimum_price: data.minimum_price,
          maximum_price: data.maximum_price,
        }
      }
      const result = await jobCollection.updateOne(filter, updateJob);
      res.send(result);
    })
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Deleted id', id);
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    })

    // bidde jobs information
    app.get('/bidJobs', async (req, res) => {
      const result = await bidJobCollection.find().toArray();
      res.send(result);
    })
    app.get('/bidJobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await bidJobCollection.findOne(query);
      res.send(result);
    })
    app.post('/bidJobs', async (req, res) => {
      const bidJob = req.body;
      console.log(bidJob);
      const result = await bidJobCollection.insertOne(bidJob);
      res.send(result);
    })
    app.put('/bidJobs/:id', async (req, res) => {
      const statusInfo = req.body;
      console.log(statusInfo);
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateStatus = {
        $set: {
          status: statusInfo.status,
        }
      }
      const options = {upsert:true};
      const result = await bidJobCollection.updateOne(filter, updateStatus, options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);

// middlewar
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
   res.send('crud operation KH Job server side is running');
})

app.listen(port,() => {
   console.log(`Assignment eleven is running on port ${port}`);
})