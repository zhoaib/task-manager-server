const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m5zl65y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const taskCollection = client.db('taskuser').collection('allTask')
        app.post('/allTask', async (req, res) => {
            const allTask = req.body
            const result = await taskCollection.insertOne(allTask);
            res.send(result)
        });

        app.get('/myTask', async (req, res) => {
            const email = req.query.email
            const query = { userEmail: email };
            const result = await taskCollection.find(query).toArray();
            res.send(result)
        });

        app.delete('/myTask/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        });

        app.put('/myTask/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'completed'
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, option)
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('task manager server')
});

app.listen(port, () => {
    console.log(`Task manager server running on ${port}`)
});