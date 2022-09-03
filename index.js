const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// user name: dbuser2
// password : CYc2pFRAAMdEXFjU

const uri = "mongodb+srv://dbuser2:CYc2pFRAAMdEXFjU@cluster1.uqb7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const userCollection = client.db("foodExpress").collection("user");

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });

        app.get('/user/:id', async (req ,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log(`user inserted with id:${result.insertedId}`)
            res.send(newUser)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            };

            const result =  await userCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('this is my practice server side');
})

app.listen(port, () => {
    console.log('Express listen to port', port)
})