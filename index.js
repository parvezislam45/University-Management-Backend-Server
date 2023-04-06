const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 7000;

// ------------- MiddleWere ------------------------

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iq8sdeu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const studentCollection = client.db("students").collection("studentsInfo");

    app.get("/student", async (req, res) => {
      const query = {};
      const cursor = studentCollection.find(query);
      const students = await cursor.toArray();
      res.send(students);
    });

    app.get('/student/:id', async (req, res) => {
      const id = req.params.id;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
      }
    
      const query = { _id: new ObjectId(id) };
      const result = await studentCollection.findOne(query);
    
      if (!result) {
        return res.status(404).send('Student not found');
      }
    
      res.send(result);
    });

    // ------------------ Add New ---------------------

    app.post("/student", async (req, res) => {
      const newStudent = req.body;
      const result = await studentCollection.insertOne(newStudent);
      res.send(result);
    });

    // ----------------- Update ---------------------
    app.put("/student/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {name : user.name, country : user.country, course: user.course},
      };
      const result = await studentCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    });
    // -------------------- Delate ------------------
    app.delete("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("david hello");
});

app.listen(port, () => {
  console.log("Alhamdullilah Your server is Start");
});
