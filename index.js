const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8l0xr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    //all collections
    const skillCollection = client.db("portfoliodb").collection("skills");
    const projectsCollection = client.db("portfoliodb").collection("projects");
    const qualificationCollection = client
      .db("portfoliodb")
      .collection("qualifications");

    // skills request
    app.get("/skills", async (req, res) => {
      const result = await skillCollection.find().toArray();
      res.send(result);
    });

    // projects request -------> post request
    app.post("/projects", async (req, res) => {
      const projectData = req.body;
      // console.log(projectData);
      const result = await projectsCollection.insertOne(projectData);
      res.send(result);
    });

    // projects request -------> get request
    app.get("/projects", async (req, res) => {
      const result = await projectsCollection.find().toArray();
      res.send(result);
    });

    // --------------> update request

    app.put("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      try {
        const result = await projectsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Project not found" });
        }

        res.send(result); // Return the updated document
      } catch (err) {
        res.send(err.message);
      }
    });
    // -------------- delete request ---------------->
    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await projectsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Project not found" });
        }
        res.send(result);
      } catch (err) {
        res.send(err.message);
      }
    });

    // --------------> qualification request ----------------> post request
    app.post("/qualifications", async (req, res) => {
      const qualificationData = req.body;
      const result = await qualificationCollection.insertOne(qualificationData);
      res.send(result);
    });
    // --------------> qualification request ----------------> get request
    app.get("/qualifications", async (req, res) => {
      const result = await qualificationCollection.find().toArray();
      res.send(result);
    });

    // --------------> qualification request ----------------> delete request
    app.delete("/qualifications/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await qualificationCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Qualification not found" });
        }
        res.send(result);
      } catch (err) {
        res.send(err.message);
      }
    });

    // --------------> qualification request ----------------> update request
    app.put("/qualifications/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      try {
        const result = await qualificationCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Qualification not found" });
        }

        res.send(result); // Return the updated document
      } catch (err) {
        res.send(err.message);
      }
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
  res.send("portfolio is running");
});

app.listen(port, () => {
  console.log(`portfolio server run on ${port}`);
});
