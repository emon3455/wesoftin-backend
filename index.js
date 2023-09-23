const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;


// middle ware:
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyyhzcl.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();


        // ----------- all collections ------------
        const usersCollections = client.db("jobTask").collection("WesoftinUsers");


        // all queries

        // get all users data:
        app.get("/users", async (req, res) => {

            const cars = await usersCollections.find().toArray();

            if (req.query?.sort === 'desc') {
                cars.sort((a, b) => b.price - a.price); // Sort in descending order based on price
            } else {
                cars.sort((a, b) => a.price - b.price); // Sort in ascending order based on price
            }
            res.send(cars);
        })


        // get single user:
        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollections.findOne(query);
            res.send(result);
        })


        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Wesoftin network is running...");
})


app.listen(port, (req, res) => {
    console.log(`Wesoftin network is running on port: ${port}`);
})
