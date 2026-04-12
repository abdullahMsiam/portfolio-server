const express = require("express");
const dns = require("dns");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

dns.setServers([ 
  "1.1.1.1", 
  "8.8.8.8",
]); 

require("dotenv").config();

//middleware
app.options("*", cors(corsConfig)); 
app.use(cors(corsConfig));
app.use(express.json());


// const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8l0xr.mongodb.net/?appName=Cluster0`;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.8l0xr.mongodb.net:27017,cluster0-shard-00-01.8l0xr.mongodb.net:27017,cluster0-shard-00-02.8l0xr.mongodb.net:27017/?ssl=true&replicaSet=atlas-4bcrmy-shard-0&authSource=admin&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// const run = async () => {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     //all collections
//     const skillCollection = client.db("portfoliodb").collection("skills");
//     const projectsCollection = client.db("portfoliodb").collection("projects");
//     const blogsCollection = client.db("portfoliodb").collection("blogs");
//     const qualificationCollection = client
//       .db("portfoliodb")
//       .collection("qualifications");

//     // skills request
//     app.get("/skills", async (req, res) => {
//       const result = await skillCollection.find().toArray();
//       res.send(result);
//     });

//     // projects request -------> post request
//     app.post("/projects", async (req, res) => {
//       const projectData = req.body;
//       // console.log(projectData);
//       const result = await projectsCollection.insertOne(projectData);
//       res.send(result);
//     });

//     // projects request -------> get request
//     app.get("/projects", async (req, res) => {
//       const result = await projectsCollection.find().toArray();
//       res.send(result);
//     });

//     // --------------> update request

//     app.put("/projects/:id", async (req, res) => {
//       const id = req.params.id;
//       const updatedData = req.body;

//       try {
//         const result = await projectsCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedData }
//         );

//         if (result.matchedCount === 0) {
//           return res.status(404).send({ message: "Project not found" });
//         }

//         res.send(result); // Return the updated document
//       } catch (err) {
//         res.send(err.message);
//       }
//     });
//     // -------------- delete request ---------------->
//     app.delete("/projects/:id", async (req, res) => {
//       const id = req.params.id;
//       try {
//         const result = await projectsCollection.deleteOne({
//           _id: new ObjectId(id),
//         });
//         if (result.deletedCount === 0) {
//           return res.status(404).send({ message: "Project not found" });
//         }
//         res.send(result);
//       } catch (err) {
//         res.send(err.message);
//       }
//     });

//     // --------------> qualification request ----------------> post request
//     app.post("/qualifications", async (req, res) => {
//       const qualificationData = req.body;
//       const result = await qualificationCollection.insertOne(qualificationData);
//       res.send(result);
//     });
//     // --------------> qualification request ----------------> get request
//     app.get("/qualifications", async (req, res) => {
//       const result = await qualificationCollection.find().toArray();
//       res.send(result);
//     });

//     // --------------> qualification request ----------------> delete request
//     app.delete("/qualifications/:id", async (req, res) => {
//       const id = req.params.id;
//       try {
//         const result = await qualificationCollection.deleteOne({
//           _id: new ObjectId(id),
//         });
//         if (result.deletedCount === 0) {
//           return res.status(404).send({ message: "Qualification not found" });
//         }
//         res.send(result);
//       } catch (err) {
//         res.send(err.message);
//       }
//     });

//     // --------------> qualification request ----------------> update request
//     app.put("/qualifications/:id", async (req, res) => {
//       const id = req.params.id;
//       const updatedData = req.body;
//       try {
//         const result = await qualificationCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedData }
//         );

//         if (result.matchedCount === 0) {
//           return res.status(404).send({ message: "Qualification not found" });
//         }

//         res.send(result); // Return the updated document
//       } catch (err) {
//         res.send(err.message);
//       }
//     });

//     // ------------------> blogs ------------------>
//     app.post("/blogs", async (req, res) => {
//       const blogData = req.body;
//       const result = await blogsCollection.insertOne(blogData);
//       res.send(result);
//     });
//     app.get("/blogs", async (req, res) => {
//       const result = await blogsCollection.find().toArray();
//       res.send(result);
//     });
//     app.get("/blogs/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
//       res.send(result);
//     });
//     app.put("/blogs/:id", async (req, res) => {
//       const id = req.params.id;
//       const updateBlog = req.body;
//       try {
//         const result = await blogsCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updateBlog }
//         );
//         res.send(result);
//       } catch (err) {
//         res.send(err.message);
//       }
//     });
//     app.delete("/blogs/:id", async (req, res) => {
//       const id = req.params.id;
//       try {
//         const result = await blogsCollection.deleteOne({
//           _id: new ObjectId(id),
//         });
//         if (result.deletedCount === 0) {
//           return res.status(404).send({ message: "Blog not found" });
//         }
//         res.send(result);
//       } catch (err) {
//         res.send(err.message);
//       }
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("portfoliodb").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!" );
// };
// run().catch(console.dir);




// app.get("/", (req, res) => {
//   res.send("portfolio is running");
// });

// app.listen(port, () => {
//   console.log(`portfolio server run on ${port}`);
// });
let db;
async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db("portfoliodb");
  return db;
}
app.get("/", (req, res) => {
  res.send("portfolio is running");
});

app.get("/skills", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("skills").find().toArray();
  res.send(result);
});

app.get("/projects", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("projects").find().toArray();
  res.send(result);
});



app.post("/projects", async (req, res) => {
  console.log(req.body);
  const database = await connectDB();
  const result = await database.collection("projects").insertOne(req.body);
  res.send(result);
});


app.put("/projects/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  console.log(updatedData)

  try {
  const database = await connectDB();
  const result = await database.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );

   if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Project not found" });
        }

        
  res.send(result);

  } catch (err) {
    res.send(err.message);
  }


});

app.delete("/projects/:id", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("projects").deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

// --- Qualifications Routes ---
app.get("/qualifications", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("qualifications").find().toArray();
  res.send(result);
});

app.post("/qualifications", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("qualifications").insertOne(req.body);
  res.send(result);
});

app.delete("/qualifications/:id", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("qualifications").deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

// --- Blogs Routes ---
app.get("/blogs", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("blogs").find().toArray();
  res.send(result);
});

app.get("/blogs/:id", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("blogs").findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

app.post("/blogs", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("blogs").insertOne(req.body);
  res.send(result);
});

app.put("/blogs/:id", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("blogs").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
});

app.delete("/blogs/:id", async (req, res) => {
  const database = await connectDB();
  const result = await database.collection("blogs").deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});


module.exports = app;
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Server on ${port}`));
}