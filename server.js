const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // To handle large base64 images
app.use(cors({
    origin: 'https://chasing-furries.tiiny.site/index.html', // Replace with your actual frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
}));

// MongoDB connection URI
const uri = "mongodb+srv://BeefBowl:Laurenzo%403@beefbowl.zw2kp.mongodb.net/?retryWrites=true&w=majority&appName=BeefBowl";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to the MongoDB database
async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('chasing_furries_db');
        const missingDogsCollection = db.collection('missingDogs');
        const foundDogsCollection = db.collection('foundDogs');

        // Route for the root URL
        app.get('/', (req, res) => {
            res.send('Welcome to the Dog Reporting API! Use the endpoints /api/missing-dogs and /api/found-dogs to submit reports.');
        });

        // Route to handle missing dog form submission
        app.post('/api/missing-dogs', async (req, res) => {
            try {
                const { name, breed, lastSeen, photo } = req.body;
                const missingDogData = { name, breed, lastSeen, photo };
                await missingDogsCollection.insertOne(missingDogData);
                res.status(201).json({ message: 'Missing dog report saved successfully!' });
            } catch (err) {
                res.status(500).json({ message: 'Failed to save missing dog report', error: err });
            }
        });

        // Route to handle found dog form submission
        app.post('/api/found-dogs', async (req, res) => {
            try {
                const { name, breed, foundLocation, photo } = req.body;
                const foundDogData = { name, breed, foundLocation, photo };
                await foundDogsCollection.insertOne(foundDogData);
                res.status(201).json({ message: 'Found dog report saved successfully!' });
            } catch (err) {
                res.status(500).json({ message: 'Failed to save found dog report', error: err });
            }
        });

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

run().catch(console.dir);
