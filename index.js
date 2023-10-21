const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o2tazeo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // create database in data

    const automotiveCollection = client
      .db("automotiveDB")
      .collection("automotive");
    const saveCarCollection = client.db("carDB").collection("car");

    // add cart

    app.post("/addToCard", async (req, res) => {
      const addToCard = req.body;
      console.log(addToCard);

      const result = await saveCarCollection.insertOne(addToCard);
      console.log(result);
      res.send(result);
    });

    app.get("/getCart/:userEmail", async (req, res) => {
      try {
        const id = req.params.userEmail;
        console.log(id);
        const result = await saveCarCollection
          .find({ userEmail: id })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error("error:", error);
        res.status(500).send(" Server Error");
      }
    });

    app.delete("/getCart/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await saveCarCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // automotive data

    app.post("/automotive", async (req, res) => {
      const automotive = req.body;
      console.log(automotive);

      const result = await automotiveCollection.insertOne(automotive);
      res.send(result);
    });

    app.get("/automotive", async (req, res) => {
      const cursor = automotiveCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/automotive/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await automotiveCollection.findOne(query);
      res.send(result);
    });

    app.get("/automotive/:brand_name", async (req, res) => {
      const brand_name = req.params.brand_name;
      const query = { brand_name: brand_name };
      const result = await automotiveCollection.findOne(query);
      res.send(result);
    });

    app.delete("/automotive/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await automotiveCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/automotive/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAutomotive = req.body;
      // const newCar = { image, name, Price, brand_name, rating, description }
      const automotive = {
        $set: {
          name: updateAutomotive.name,
          Price: updateAutomotive.Price,
          rating: updateAutomotive.rating,
          description: updateAutomotive.description,
          brand_name: updateAutomotive.brand_name,
          image: updateAutomotive.image,
        },
      };

      const result = await automotiveCollection.updateOne(
        filter,
        automotive,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
